import { Body, Controller, Get, Post, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AlertsService } from './alerts.service';
import { CreateAlertRuleDto } from './dto/create-alert-rule.dto';

@ApiTags('alerts')
@ApiBearerAuth()
@Controller('alerts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @Version('1')
  list() {
    return this.alertsService.listAlerts();
  }

  @Post('rules')
  @Version('1')
  @Roles('ADMIN', 'OPERATOR')
  createRule(@Body() dto: CreateAlertRuleDto) {
    return this.alertsService.createRule(dto);
  }
}
