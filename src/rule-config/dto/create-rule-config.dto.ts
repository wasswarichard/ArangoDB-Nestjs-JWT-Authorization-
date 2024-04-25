import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { StateEnum } from '../../rule/schema/rule.schema';
import { Configuration } from '../entities/rule-config.entity';

export class CreateRuleConfigDto {
  @ApiProperty()
  @IsString()
  readonly cfg: string;

  @ApiProperty()
  @IsEnum(StateEnum, {
    message: () => {
      const enumValues = Object.values(StateEnum).join(', ');
      return `State must be one of the following values : ${enumValues}`;
    },
  })
  readonly state: StateEnum;

  @ApiProperty()
  @IsString()
  readonly desc: string;

  @ApiProperty()
  @IsString()
  readonly ruleId: string;

  @ApiProperty({ type: () => Configuration })
  @IsObject()
  config: Configuration;
}
