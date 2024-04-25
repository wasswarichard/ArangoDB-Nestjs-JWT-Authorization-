import { ApiProperty } from '@nestjs/swagger';
import { RuleConfig } from '../../rule-config/entities/rule-config.entity';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Rule {
  @ApiProperty()
  _key: string;

  @ApiProperty()
  _id: string;

  @ApiProperty()
  _rev: string;

  @ApiProperty()
  cfg: string;

  @ApiProperty()
  dataType: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  desc: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  updatedBy: string;

  @ApiProperty()
  approverId: string;

  @ApiProperty()
  originatedID: string;
}

export class RuleConfiguration {
  @ApiProperty()
  cfg: string;

  @ApiProperty()
  dataType: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  desc: string;

  @ApiProperty({ type: () => [RuleConfig] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RuleConfig)
  ruleConfigs: RuleConfig[];
}
