import { Prisma } from '@prisma/client';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RealtimeEvents } from '@nexaiot/shared';
import {
  buildSharedSubscription,
  cloudAlertsWildcard,
  cloudResponseWildcard,
  cloudStatusWildcard,
  cloudTelemetryWildcard,
  extractCloudNodeId,
  statusWildcard,
  telemetryWildcard
} from '@nexaiot/mqtt';
import mqtt, { MqttClient } from 'mqtt';
import { PrismaService } from '../../prisma/prisma.service';
import { RealtimeService } from '../realtime/realtime.service';
import {
  validateAlertPayload,
  validateCommandResponsePayload,
  validateStatusPayload,
  validateTelemetryPayload
} from './mqtt-message.validator';

@Injectable()
export class MqttConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttConsumerService.name);
  private client?: MqttClient;

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService
  ) {}

  onModuleInit() {
    const url = process.env.MQTT_BROKER_URL ?? 'mqtt://localhost:1883';
    const clientId = process.env.MQTT_CLIENT_ID ?? 'nexaiot-api-dev';
    const username = process.env.MQTT_USERNAME;
    const password = process.env.MQTT_PASSWORD;
    const topicMode = process.env.MQTT_TOPIC_MODE ?? 'cloud';
    const topicBase = process.env.MQTT_TOPIC_BASE ?? 'nexa/nodes';
    const root = process.env.MQTT_TOPIC_ROOT ?? 'iot';
    const environment = process.env.MQTT_ENVIRONMENT ?? 'dev';
    const group = process.env.MQTT_SHARED_GROUP ?? 'api-consumers';
    const useSharedSubscriptions = process.env.MQTT_USE_SHARED_SUBSCRIPTIONS !== 'false';

    this.client = mqtt.connect(url, {
      clientId,
      username,
      password,
      clean: false,
      reconnectPeriod: 5000,
      rejectUnauthorized: process.env.MQTT_TLS_REJECT_UNAUTHORIZED !== 'false'
    });

    this.client.on('connect', () => {
      const rawTopics = topicMode === 'legacy'
        ? [telemetryWildcard(root, environment), statusWildcard(root, environment)]
        : [cloudTelemetryWildcard(topicBase), cloudStatusWildcard(topicBase), cloudAlertsWildcard(topicBase), cloudResponseWildcard(topicBase)];
      const topics = useSharedSubscriptions ? rawTopics.map((topic) => buildSharedSubscription(group, topic)) : rawTopics;
      topics.forEach((topic) => this.client?.subscribe(topic, { qos: 1 }));
      this.logger.log(`Connected to MQTT broker and subscribed to ${topics.join(', ')}`);
    });

    this.client.on('message', (topic, payload) => {
      void this.handleMessage(topic, payload);
    });

    this.client.on('error', (error) => {
      this.logger.error(`MQTT error: ${error.message}`);
    });

    this.client.on('close', () => {
      this.logger.warn('MQTT connection closed');
    });
  }

  async onModuleDestroy() {
    this.client?.end(true);
  }

  private async handleMessage(topic: string, payload: Buffer) {
    const parsedPayload = safeJson(payload);
    await this.prisma.mqttMessage.create({
      data: {
        topic,
        payload: parsedPayload as Prisma.InputJsonObject,
        direction: 'INBOUND',
        qos: 1,
        messageId: readMessageId(parsedPayload),
        receivedAt: new Date()
      }
    });

    this.realtime.emit(RealtimeEvents.MqttMessageReceived, { topic, receivedAt: new Date().toISOString() });

    if (topic.endsWith('/telemetry')) {
      await this.handleTelemetry(topic, payload);
      return;
    }

    if (topic.endsWith('/status')) {
      await this.handleStatus(topic, payload);
      return;
    }

    if (topic.endsWith('/alerts')) {
      await this.handleAlert(topic, payload);
      return;
    }

    if (topic.endsWith('/response')) {
      await this.handleCommandResponse(topic, payload);
    }
  }

  private async handleTelemetry(topic: string, payload: Buffer) {
    const validation = validateTelemetryPayload(payload);
    if (!validation.ok || !validation.value) {
      this.logger.warn(`Rejected telemetry from ${topic}: ${validation.error}`);
      return;
    }

    const message = validation.value;
    const nodeId = message.nodeId || extractCloudNodeId(topic, process.env.MQTT_TOPIC_BASE ?? 'nexa/nodes');
    if (!nodeId) {
      this.logger.warn(`Telemetry without node id from topic: ${topic}`);
      return;
    }

    const node = await this.prisma.node.findUnique({
      where: { nodeId },
      include: { sensors: true }
    });

    if (!node) {
      this.logger.warn(`Telemetry from unknown node: ${nodeId}`);
      return;
    }

    const sensorById = new Map(node.sensors.map((sensor) => [sensor.sensorId, sensor]));
    const readings: Prisma.SensorReadingCreateManyInput[] = [];

    for (const [sensorKey, reading] of Object.entries(message.payload.sensors)) {
      const sensor = sensorById.get(sensorKey);
      if (!sensor) {
        this.logger.warn(`Unknown sensor ${sensorKey} for node ${nodeId}`);
        continue;
      }

      readings.push({
        time: new Date(message.timestamp),
        nodeId: node.id,
        sensorId: sensor.id,
        valueNumber: typeof reading.value === 'number' ? reading.value : null,
        valueText: typeof reading.value === 'string' ? reading.value : null,
        valueBoolean: typeof reading.value === 'boolean' ? reading.value : null,
        unit: reading.unit ?? sensor.unit,
        quality: reading.quality ?? 'GOOD',
        metadata: (reading.metadata ?? {}) as Prisma.InputJsonObject
      });
    }

    if (readings.length === 0) return;

    await this.prisma.sensorReading.createMany({ data: readings, skipDuplicates: true });
    await this.prisma.node.update({
      where: { id: node.id },
      data: { status: 'ONLINE', lastSeenAt: new Date(message.timestamp) }
    });

    this.realtime.emit(RealtimeEvents.SensorValueUpdated, {
      nodeId: node.nodeId,
      messageId: message.messageId,
      timestamp: message.timestamp,
      readings
    });
  }

  private async handleStatus(topic: string, payload: Buffer) {
    const validation = validateStatusPayload(payload);
    if (!validation.ok || !validation.value) {
      this.logger.warn(`Rejected status from ${topic}: ${validation.error}`);
      return;
    }

    const message = validation.value;
    const nodeId = message.nodeId || extractCloudNodeId(topic, process.env.MQTT_TOPIC_BASE ?? 'nexa/nodes');
    if (!nodeId) return;

    const node = await this.prisma.node.findUnique({ where: { nodeId } });
    if (!node) {
      this.logger.warn(`Status from unknown node: ${nodeId}`);
      return;
    }

    const timestamp = new Date(message.timestamp);
    const updated = await this.prisma.node.update({
      where: { id: node.id },
      data: {
        status: message.payload.status,
        lastSeenAt: timestamp,
        firmwareVersion: message.payload.firmwareVersion ?? node.firmwareVersion,
        ipAddress: message.payload.ipAddress ?? node.ipAddress
      }
    });

    await this.prisma.nodeStatusHistory.create({
      data: {
        nodeId: node.id,
        status: message.payload.status,
        reason: message.payload.reason,
        source: 'MQTT'
      }
    });

    this.realtime.emit(RealtimeEvents.NodeStatusChanged, {
      nodeId: updated.nodeId,
      status: updated.status,
      lastSeenAt: updated.lastSeenAt?.toISOString()
    });
  }

  private async handleAlert(topic: string, payload: Buffer) {
    const validation = validateAlertPayload(payload);
    if (!validation.ok || !validation.value) {
      this.logger.warn(`Rejected alert from ${topic}: ${validation.error}`);
      return;
    }

    const message = validation.value;
    const node = await this.prisma.node.findUnique({ where: { nodeId: message.nodeId } });
    if (!node) {
      this.logger.warn(`Alert from unknown node: ${message.nodeId}`);
      return;
    }

    const sensor = message.payload.sensorId
      ? await this.prisma.sensor.findUnique({ where: { sensorId: message.payload.sensorId } })
      : null;

    const alert = await this.prisma.alert.create({
      data: {
        nodeId: node.id,
        sensorId: sensor?.id,
        severity: message.payload.severity,
        status: 'ACTIVE',
        title: message.payload.title,
        message: message.payload.message,
        triggeredAt: new Date(message.timestamp),
        metadata: (message.payload.metadata ?? {}) as Prisma.InputJsonObject
      }
    });

    this.realtime.emit(RealtimeEvents.AlertCreated, {
      id: alert.id,
      nodeId: node.nodeId,
      severity: alert.severity,
      title: alert.title,
      message: alert.message,
      triggeredAt: alert.triggeredAt.toISOString()
    });
  }

  private async handleCommandResponse(topic: string, payload: Buffer) {
    const validation = validateCommandResponsePayload(payload);
    if (!validation.ok || !validation.value) {
      this.logger.warn(`Rejected command response from ${topic}: ${validation.error}`);
      return;
    }

    const message = validation.value;
    const commandMessageId = message.payload.commandMessageId ?? message.messageId;
    const command = await this.prisma.command.findUnique({ where: { messageId: commandMessageId } });
    if (!command) {
      this.logger.warn(`Command response for unknown command: ${commandMessageId}`);
      return;
    }

    const status = message.payload.status === 'FAILED' ? 'FAILED' : message.payload.status === 'TIMEOUT' ? 'TIMEOUT' : 'ACKNOWLEDGED';
    const result = await this.prisma.commandResult.create({
      data: {
        commandId: command.id,
        status,
        response: (message.payload.response ?? {}) as Prisma.InputJsonObject,
        error: message.payload.error,
        completedAt: new Date(message.timestamp)
      }
    });

    await this.prisma.command.update({ where: { id: command.id }, data: { status } });

    this.realtime.emit(RealtimeEvents.CommandCompleted, {
      commandId: command.id,
      messageId: command.messageId,
      status: result.status,
      completedAt: result.completedAt?.toISOString()
    });
  }
}

function safeJson(payload: Buffer): Record<string, unknown> {
  try {
    const parsed = JSON.parse(payload.toString('utf8')) as unknown;
    return isPlainObject(parsed) ? parsed : { value: parsed };
  } catch {
    return { raw: payload.toString('utf8') };
  }
}

function readMessageId(payload: Record<string, unknown>): string | undefined {
  return typeof payload.messageId === 'string' ? payload.messageId : undefined;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
