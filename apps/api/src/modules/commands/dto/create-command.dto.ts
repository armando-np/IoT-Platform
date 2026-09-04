import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCommandDto {
  @ApiProperty({ enum: ['reboot', 'sync', 'request_status', 'update_config', 'update_firmware', 'custom_command'] })
  @IsIn(['reboot', 'sync', 'request_status', 'update_config', 'update_firmware', 'custom_command'])
  command!: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  parameters?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  messageId?: string;
}
