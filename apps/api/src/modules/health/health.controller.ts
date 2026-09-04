import { Controller, Get, Version } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @Version('1')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('readiness')
  @Version('1')
  readiness() {
    return { status: 'ready', timestamp: new Date().toISOString() };
  }

  @Get('liveness')
  @Version('1')
  liveness() {
    return { status: 'alive', timestamp: new Date().toISOString() };
  }
}
