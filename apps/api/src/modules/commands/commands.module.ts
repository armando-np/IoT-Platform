import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { CommandsController } from './commands.controller';
import { CommandsService } from './commands.service';
import { MqttModule } from '../mqtt/mqtt.module';

@Module({ imports: [CommonModule, MqttModule], controllers: [CommandsController], providers: [CommandsService], exports: [CommandsService] })
export class CommandsModule {}
