import { Controller, Get, Query, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TelemetryService } from './telemetry.service';

@ApiTags('telemetry')
@ApiBearerAuth()
@Controller('telemetry')
@UseGuards(JwtAuthGuard)
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get()
  @Version('1')
  query(@Query('sensorId') sensorId?: string, @Query('from') from?: string, @Query('to') to?: string, @Query('limit') limit?: string) {
    return this.telemetryService.query({ sensorId, from, to, limit: limit ? Number(limit) : undefined });
  }
}
