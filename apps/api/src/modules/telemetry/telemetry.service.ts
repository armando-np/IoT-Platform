import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TelemetryService {
  constructor(private readonly prisma: PrismaService) {}

  async query(input: { sensorId?: string; from?: string; to?: string; limit?: number }) {
    const limit = Math.min(input.limit ?? 500, 5000);
    return this.prisma.sensorReading.findMany({
      where: {
        sensor: input.sensorId ? { sensorId: input.sensorId } : undefined,
        time: {
          gte: input.from ? new Date(input.from) : undefined,
          lte: input.to ? new Date(input.to) : undefined
        }
      },
      include: { sensor: true, node: true },
      orderBy: { time: 'desc' },
      take: limit
    });
  }
}
