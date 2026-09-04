import { Body, Controller, Get, Param, Post, Query, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { SensorsService } from './sensors.service';

@ApiTags('sensors')
@ApiBearerAuth()
@Controller('sensors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get()
  @Version('1')
  list(@Query('nodeId') nodeId?: string) {
    return this.sensorsService.list(nodeId);
  }

  @Post()
  @Version('1')
  @Roles('ADMIN', 'OPERATOR')
  create(@Body() dto: CreateSensorDto) {
    return this.sensorsService.create(dto);
  }

  @Get('types/all')
  @Version('1')
  types() {
    return this.sensorsService.types();
  }

  @Get(':id')
  @Version('1')
  get(@Param('id') id: string) {
    return this.sensorsService.get(id);
  }
}
