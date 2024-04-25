import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypeEnum, StateEnum } from '../schema/rule.schema';

export class CreateRuleDto {
  @ApiProperty()
  @IsString()
  readonly cfg: string;

  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsEnum(DataTypeEnum, {
    message: () => {
      const enumValues = Object.values(DataTypeEnum).join(', ');
      return `Data type must be one of the following values : ${enumValues}`;
    },
  })
  readonly dataType: DataTypeEnum;

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
}
