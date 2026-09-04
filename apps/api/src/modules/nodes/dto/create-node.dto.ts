import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateNodeDto {
  @ApiProperty({ example: 'NODE-001' })
  @IsString()
  @MaxLength(80)
  nodeId!: string;

  @ApiProperty({ example: 'Raspberry Pi Pico 2 W Lab' })
  @IsString()
  @MaxLength(160)
  name!: string;

  @ApiProperty()
  @IsUUID()
  siteId!: string;

  @ApiProperty()
  @IsUUID()
  areaId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manufacturer?: string;
}
