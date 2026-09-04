import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAlertRuleDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsUUID()
  sensorId!: string;

  @ApiProperty({ enum: ['GT', 'GTE', 'LT', 'LTE', 'EQ', 'NEQ', 'OUTSIDE_RANGE'] })
  @IsEnum(['GT', 'GTE', 'LT', 'LTE', 'EQ', 'NEQ', 'OUTSIDE_RANGE'])
  operator!: string;

  @ApiProperty()
  @IsNumber()
  threshold!: number;

  @ApiProperty({ enum: ['INFO', 'WARNING', 'CRITICAL'] })
  @IsEnum(['INFO', 'WARNING', 'CRITICAL'])
  severity!: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
