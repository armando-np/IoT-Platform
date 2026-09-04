import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';

@Module({ imports: [CommonModule], controllers: [NodesController], providers: [NodesService], exports: [NodesService] })
export class NodesModule {}
