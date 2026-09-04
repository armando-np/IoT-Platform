import { Module } from '@nestjs/common';
import { MqttConsumerService } from './mqtt-consumer.service';
import { MqttPublisherService } from './mqtt-publisher.service';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [RealtimeModule], providers: [MqttConsumerService, MqttPublisherService], exports: [MqttPublisherService] })
export class MqttModule {}
