import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RealtimeEvents } from '@nexaiot/shared';
import { buildSharedSubscription, telemetryWildcard, statusWildcard } from '@nexaiot/mqtt';
import mqtt, { MqttClient } from 'mqtt';
import { PrismaService } from '../../prisma/prisma.service';
import { RealtimeService } from '../realtime/realtime.service';
import { validateTelemetryPayload } from './mqtt-message.validator';

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
    const root = process.env.MQTT_TOPIC_ROOT ?? 'iot';
    const environment = process.env.MQTT_ENVIRONMENT ?? 'dev';
    const group = process.env.MQTT_SHARED_GROUP ?? 'api-consumers';

    this.client = mqtt.connect(url, {
      clientId,
      username,
      password,
      clean: false,
      reconnectPeriod: 5000
    });

    this.client.on('connect', () => {
      const topics = [
        buildSharedSubscription(group, telemetryWildcard(root, environment)),
        buildSharedSubscription(group, statusWildcard(root, environment))
      ];
      topics.forEach((topic) => this.client?.subscribe(topic, { qos: 1 }));
      this.logger.log(`Connected to MQTT broker and subscribed to ${topics.join(', ')}`);
    });

    this.client.on('message', (topic, payload) => {
      void this.handleMessage(topic, payload);
    });

    this.client.on('error', (error) => {
      this.logger.error(`MQTT error: ${error.message}`);
    });
  }

  async onModuleDestroy() {
    this.client?.end(true);
  }

  private async handleMessage(topic: string, payload: Buffer) {
    await this.prisma.mqttMessage.create({
      data: {
        topic,
        payload: safeJson(payload),
        direction: 'INBOUND',
        qos: 1,
        receivedAt: new Date()
      }
    });
    this.realtime.emit(RealtimeEvents.MqttMessageReceived, { topic, receivedAt: new Date().toISOString() });

    if (topic.endsWith('/telemetry')) {
      await this.handleTelemetry(topic, payload);
    }
  }

  private async handleTelemetry(topic: string, payload: Buffer) {
    const validation = validateTelemetryPayload(payload);
    if (!validation.ok || !validation.value) {
      this.logger.warn(`Rejected telemetry: ${validation.error}`);
      return;
    }
    const message = validation.value;
    const node = await this.prisma.node.findUnique({ where: { nodeId: message.nodeId }, include: { sensors: true } });
    if (!node) {
      this.logger.warn(`Telemetry from unknown node: ${message.nodeId}`);
      return;
    }

    const sensorByType = new Map(node.sensors.map((sensor) => [sensor.sensorId, sensor]));
    const readings = Object.entries(message.payload.sensors)
      .map(([sensorKey, reading]) => {
        const sensor = sensorByType.get(sensorKey);
        if (!sensor) return null;
        return {
          time: new Date(message.timestamp),
          nodeId: node.id,
          sensorId: sensor.id,
          valueNumber: typeof reading.value === 'number' ? reading.value : null,
          valueText: typeof reading.value === 'string' ? reading.value : null,
          valueBoolean: typeof reading.value === 'boolean' ? reading.value : null,
          unit: reading.unit,
          quality: reading.quality ?? 'GOOD',
          metadata: reading.metadata ?? {}
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (readings.length > 0) {
      await this.prisma.sensorReading.createMany({ data: readings, skipDuplicates: true });
      await this.prisma.node.update({ where: { id: node.id }, data: { status: 'ONLINE', lastSeenAt: new Date(message.timestamp) } });
      this.realtime.emit(RealtimeEvents.SensorValueUpdated, { nodeId: node.nodeId, messageId: message.messageId, readings });
    }
  }
}

function safeJson(payload: Buffer) {
  try {
    return JSON.parse(payload.toString('utf8')) as object;
  } catch {
    return { raw: payload.toString('utf8') };
  }
}
