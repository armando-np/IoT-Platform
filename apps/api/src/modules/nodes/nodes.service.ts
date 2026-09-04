import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

@Injectable()
export class NodesService {
  constructor(private readonly prisma: PrismaService) {}

  list(status?: string) {
    return this.prisma.node.findMany({
      where: { deletedAt: null, status: status ? (status as never) : undefined },
      include: { site: true, area: true, sensors: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  create(dto: CreateNodeDto) {
    return this.prisma.node.create({ data: { ...dto, status: 'UNKNOWN' } });
  }

  async get(id: string) {
    const node = await this.prisma.node.findFirst({
      where: { OR: [{ id }, { nodeId: id }], deletedAt: null },
      include: { site: true, area: true, sensors: true, events: { take: 50, orderBy: { createdAt: 'desc' } } }
    });
    if (!node) throw new NotFoundException('Node not found');
    return node;
  }

  async update(id: string, dto: UpdateNodeDto) {
    const node = await this.get(id);
    return this.prisma.node.update({ where: { id: node.id }, data: dto });
  }

  async softDelete(id: string) {
    const node = await this.get(id);
    return this.prisma.node.update({ where: { id: node.id }, data: { deletedAt: new Date(), status: 'DISABLED' } });
  }
}
