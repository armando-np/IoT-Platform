import { Prisma } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSensorDto } from './dto/create-sensor.dto';

@Injectable()
export class SensorsService {
  constructor(private readonly prisma: PrismaService) {}

  list(nodeId?: string) {
    return this.prisma.sensor.findMany({
      where: { deletedAt: null, node: nodeId ? { nodeId } : undefined },
      include: { node: true, sensorType: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  create(dto: CreateSensorDto) {
    const { metadata, ...sensorData } = dto;
    return this.prisma.sensor.create({
      data: {
        ...sensorData,
        metadata: (metadata ?? {}) as Prisma.InputJsonObject,
        status: 'ACTIVE'
      }
    });
  }

  async get(id: string) {
    const sensor = await this.prisma.sensor.findFirst({
      where: { OR: [{ id }, { sensorId: id }], deletedAt: null },
      include: { node: true, sensorType: true, readings: { take: 100, orderBy: { time: 'desc' } } }
    });
    if (!sensor) throw new NotFoundException('Sensor not found');
    return sensor;
  }

  types() {
    return this.prisma.sensorType.findMany({ orderBy: { name: 'asc' } });
  }
}
