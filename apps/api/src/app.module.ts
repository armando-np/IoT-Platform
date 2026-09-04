import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { NodesModule } from './modules/nodes/nodes.module';
import { SensorsModule } from './modules/sensors/sensors.module';
import { TelemetryModule } from './modules/telemetry/telemetry.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { CommandsModule } from './modules/commands/commands.module';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.RATE_LIMIT_TTL_MS ?? 60000),
        limit: Number(process.env.RATE_LIMIT_MAX ?? 120)
      }
    ]),
    PrismaModule,
    AuthModule,
    NodesModule,
    SensorsModule,
    TelemetryModule,
    AlertsModule,
    CommandsModule,
    MqttModule,
    RealtimeModule,
    HealthModule
  ]
})
export class AppModule {}
