import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { NodesService } from './nodes.service';

@ApiTags('nodes')
@ApiBearerAuth()
@Controller('nodes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get()
  @Version('1')
  list(@Query('status') status?: string) {
    return this.nodesService.list(status);
  }

  @Post()
  @Version('1')
  @Roles('ADMIN', 'OPERATOR')
  create(@Body() dto: CreateNodeDto) {
    return this.nodesService.create(dto);
  }

  @Get(':id')
  @Version('1')
  get(@Param('id') id: string) {
    return this.nodesService.get(id);
  }

  @Patch(':id')
  @Version('1')
  @Roles('ADMIN', 'OPERATOR')
  update(@Param('id') id: string, @Body() dto: UpdateNodeDto) {
    return this.nodesService.update(id, dto);
  }

  @Delete(':id')
  @Version('1')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.nodesService.softDelete(id);
  }
}
