import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';

@Module({ imports: [CommonModule], controllers: [SensorsController], providers: [SensorsService], exports: [SensorsService] })
export class SensorsModule {}
