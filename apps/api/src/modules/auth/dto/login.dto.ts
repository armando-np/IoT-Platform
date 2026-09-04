import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin.demo@nexaiot.local' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'ChangeMe_DEMO_Only_123!' })
  @IsString()
  @MinLength(12)
  password!: string;
}
