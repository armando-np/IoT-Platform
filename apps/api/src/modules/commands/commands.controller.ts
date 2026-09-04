import { Body, Controller, Param, Post, Req, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CommandsService } from './commands.service';
import { CreateCommandDto } from './dto/create-command.dto';

@ApiTags('commands')
@ApiBearerAuth()
@Controller('nodes/:id/commands')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Post()
  @Version('1')
  @Roles('ADMIN', 'OPERATOR')
  send(@Param('id') id: string, @Body() dto: CreateCommandDto, @Req() request: { user?: { sub: string } }) {
    return this.commandsService.send(id, dto, request.user?.sub);
  }
}
