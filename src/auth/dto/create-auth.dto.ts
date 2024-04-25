import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty()
  @IsString()
  readonly client_id: string;

  @ApiProperty()
  @IsString()
  readonly grant_type: string;

  @ApiProperty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsString()
  readonly username: string;
}
