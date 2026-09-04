import { Injectable, Logger } from '@nestjs/common';
import { buildCloudNodeTopic, buildNodeTopic } from '@nexaiot/mqtt';
import mqtt, { MqttClient } from 'mqtt';

interface CommandNode {
  nodeId: string;
  site: { slug: string };
  area: { slug: string };
}

@Injectable()
export class MqttPublisherService {
  private readonly logger = new Logger(MqttPublisherService.name);
  private client?: MqttClient;

  private getClient(): MqttClient {
    if (!this.client) {
      this.client = mqtt.connect(process.env.MQTT_BROKER_URL ?? 'mqtt://localhost:1883', {
        clientId: `${process.env.MQTT_CLIENT_ID ?? 'nexaiot-api'}-publisher`,
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        reconnectPeriod: 5000,
        rejectUnauthorized: process.env.MQTT_TLS_REJECT_UNAUTHORIZED !== 'false'
      });
    }
    return this.client;
  }

  async publishCommand(node: CommandNode, command: { messageId: string; command: string; parameters: Record<string, unknown> }) {
    const topic = this.buildCommandTopic(node);
    const payload = JSON.stringify({
      schemaVersion: '1.0',
      messageId: command.messageId,
      timestamp: new Date().toISOString(),
      nodeId: node.nodeId,
      payload: {
        command: command.command,
        parameters: command.parameters
      }
    });

    this.getClient().publish(topic, payload, { qos: 1 }, (error) => {
      if (error) this.logger.error(`Failed to publish command: ${error.message}`);
      else this.logger.log(`Command ${command.messageId} published to ${topic}`);
    });
  }

  private buildCommandTopic(node: CommandNode): string {
    const topicMode = process.env.MQTT_TOPIC_MODE ?? 'cloud';
    if (topicMode === 'legacy') {
      return buildNodeTopic(
        {
          root: process.env.MQTT_TOPIC_ROOT ?? 'iot',
          environment: process.env.MQTT_ENVIRONMENT ?? 'dev',
          site: node.site.slug,
          area: node.area.slug,
          nodeId: node.nodeId
        },
        'command'
      );
    }

    return buildCloudNodeTopic(process.env.MQTT_TOPIC_BASE ?? 'nexa/nodes', node.nodeId, 'commands');
  }
}
