import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateSensorDto {
  @ApiProperty({ example: 'SEN-TEMP-001' })
  @IsString()
  @MaxLength(80)
  sensorId!: string;

  @ApiProperty({ example: 'Waterproof DS18B20' })
  @IsString()
  @MaxLength(160)
  name!: string;

  @ApiProperty()
  @IsUUID()
  nodeId!: string;

  @ApiProperty()
  @IsUUID()
  sensorTypeId!: string;

  @ApiProperty({ example: 'C' })
  @IsString()
  unit!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
