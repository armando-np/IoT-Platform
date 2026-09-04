import { Prisma } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { MqttPublisherService } from '../mqtt/mqtt-publisher.service';
import { CreateCommandDto } from './dto/create-command.dto';

@Injectable()
export class CommandsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publisher: MqttPublisherService
  ) {}

  async send(nodeIdOrId: string, dto: CreateCommandDto, userId?: string) {
    const node = await this.prisma.node.findFirst({ where: { OR: [{ id: nodeIdOrId }, { nodeId: nodeIdOrId }], deletedAt: null }, include: { site: true, area: true } });
    if (!node) throw new NotFoundException('Node not found');
    const messageId = dto.messageId ?? `cmd-${uuidv4()}`;
    const command = await this.prisma.command.create({
      data: {
        messageId,
        nodeId: node.id,
        userId,
        command: dto.command,
        parameters: (dto.parameters ?? {}) as Prisma.InputJsonObject,
        status: 'PENDING',
        timeoutAt: new Date(Date.now() + 30000)
      }
    });
    await this.publisher.publishCommand(node, { messageId, command: dto.command, parameters: dto.parameters ?? {} });
    return this.prisma.command.update({ where: { id: command.id }, data: { status: 'SENT', sentAt: new Date() } });
  }
}
