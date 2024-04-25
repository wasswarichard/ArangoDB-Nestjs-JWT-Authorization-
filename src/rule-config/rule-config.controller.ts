import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { RuleConfigService } from './rule-config.service';
import { CreateRuleConfigDto } from './dto/create-rule-config.dto';
import { UpdateRuleConfigDto } from './dto/update-rule-config.dto';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RuleConfigPrivilege } from './privilege.constant';
import { RuleConfig } from './entities/rule-config.entity';

@Controller('rule-config')
@ApiTags('rule config')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RuleConfigController {
  constructor(private readonly ruleConfigService: RuleConfigService) {}

  @Roles(RuleConfigPrivilege.CREATE_RULE_CONFIG)
  @Post()
  @ApiOkResponse({ description: 'Created Rule Config', type: RuleConfig })
  create(@Body() createRuleConfigDto: CreateRuleConfigDto, @Request() req) {
    return this.ruleConfigService.create(createRuleConfigDto, req);
  }

  @Roles(RuleConfigPrivilege.GET_RULE_CONFIGS)
  @ApiOkResponse({
    description: 'Get all rule configs',
    type: RuleConfig,
    isArray: true,
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ count: number; data: RuleConfig[] }> {
    return this.ruleConfigService.findAll({ page, limit });
  }

  @ApiExcludeEndpoint()
  @Roles(RuleConfigPrivilege.GET_RULE_CONFIG)
  @Get(':id')
  @ApiOkResponse({
    description: 'Find single rule config by id',
    type: RuleConfig,
  })
  findOne(@Param('id') id: string): Promise<RuleConfig> {
    return this.ruleConfigService.findOne(id);
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  @Roles(RuleConfigPrivilege.UPDATE_RULE_CONFIG)
  @ApiOkResponse({
    description: 'Update single rule config',
    type: RuleConfig,
  })
  update(
    @Param('id') id: string,
    @Body() updateRuleConfigDto: UpdateRuleConfigDto,
    @Request() req,
  ) {
    return this.ruleConfigService.duplicateRuleConfig(
      id,
      updateRuleConfigDto,
      req,
    );
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  @Roles(RuleConfigPrivilege.DELETE_RULE_CONFIG)
  @ApiOkResponse({
    description: 'Delete a single rule config',
    type: RuleConfig,
  })
  remove(@Param('id') id: string, @Request() req) {
    return this.ruleConfigService.remove(id, req);
  }

  @ApiExcludeEndpoint()
  @Roles(RuleConfigPrivilege.DISABLE_RULE)
  @Post(':id/disable')
  @ApiOkResponse({
    description: 'Disabling a single rule config',
    type: RuleConfig,
  })
  async disableRule(
    @Param('id') id: string,
    @Request() req,
  ): Promise<RuleConfig> {
    return await this.ruleConfigService.disableRuleConfig(id, req);
  }
}
