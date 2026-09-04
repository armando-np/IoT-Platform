import { AlertSeverity } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAlertRuleDto } from './dto/create-alert-rule.dto';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  listAlerts() {
    return this.prisma.alert.findMany({ include: { rule: true, sensor: true, node: true }, orderBy: { createdAt: 'desc' } });
  }

  createRule(dto: CreateAlertRuleDto) {
    return this.prisma.alertRule.create({
      data: {
        ...dto,
        severity: dto.severity as AlertSeverity,
        enabled: dto.enabled ?? true
      }
    });
  }
}
