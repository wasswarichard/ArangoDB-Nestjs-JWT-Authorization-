import { ApiProperty } from '@nestjs/swagger';
import { Band } from '../../band/entities/band.entity';
import { Case } from '../../case/entities/case.entity';
import { IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Parameters {
  @ApiProperty()
  maxQueryLimit: number;

  @ApiProperty()
  tolerance: number;
}
class ExitConditions {
  @ApiProperty()
  subRuleRef: string;

  @ApiProperty()
  outcome: boolean;

  @ApiProperty()
  reason: string;
}

export class Configuration {
  @ApiProperty()
  parameters: Parameters;

  @ApiProperty({ type: () => [ExitConditions] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExitConditions)
  exitConditions: ExitConditions;

  @ApiProperty({ type: () => [Band] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Band)
  bands: Band[];

  @ApiProperty({ type: () => [Case] })
  @IsArray()
  @IsObject()
  @ValidateNested({ each: true })
  case: Case[];
}

export class RuleConfig {
  @ApiProperty()
  _key: string;

  @ApiProperty()
  _id: string;

  @ApiProperty()
  _rev: string;

  @ApiProperty()
  cfg: string;

  @ApiProperty()
  desc: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  updatedBy: string;

  @ApiProperty()
  approverId: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  ruleId: string;

  @ApiProperty()
  config: Configuration;
}
