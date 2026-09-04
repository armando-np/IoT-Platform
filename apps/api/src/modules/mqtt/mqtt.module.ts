import { Module } from '@nestjs/common';
import { MqttConsumerService } from './mqtt-consumer.service';
import { MqttPublisherService } from './mqtt-publisher.service';

@Module({ providers: [MqttConsumerService, MqttPublisherService], exports: [MqttPublisherService] })
export class MqttModule {}
