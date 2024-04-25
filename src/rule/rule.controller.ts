import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Rule, RuleConfiguration } from './entities/rule.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RulePrivileges } from './privilege.constant';

@Controller('rule')
@ApiTags('rule')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Roles(RulePrivileges.CREATE_RULE)
  @Post()
  @ApiOkResponse({ description: 'Created Rule', type: Rule })
  async create(@Body() createRuleDto: CreateRuleDto, @Request() req) {
    return await this.ruleService.create(createRuleDto, req);
  }

  @Roles(RulePrivileges.GET_RULES)
  @ApiOkResponse({ description: 'Get all rules', type: Rule, isArray: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ count: number; rules: Rule[] }> {
    const queryParams = { page, limit };
    return this.ruleService.findAll(queryParams);
  }

  @Roles(RulePrivileges.GET_RULE_RULE_CONFIG)
  @ApiOkResponse({
    description: 'Get all rule and configurations',
    type: RuleConfiguration,
    isArray: true,
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get('/rule-config')
  findRuleConfigs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ count: number; rules: RuleConfiguration[] }> {
    const queryParams = { page, limit };
    return this.ruleService.findRuleConfigs(queryParams);
  }

  @Roles(RulePrivileges.GET_RULE)
  @Get(':id')
  @ApiOkResponse({
    description: 'Find single rule by id',
    type: Rule,
  })
  async findOne(@Param('id') id: string): Promise<Rule> {
    return await this.ruleService.findOne(id);
  }

  @Roles(RulePrivileges.UPDATE_RULE)
  @Patch(':id')
  @ApiOkResponse({
    description: 'Update single rule',
    type: Rule,
  })
  async update(
    @Param('id') id: string,
    @Body() updateRuleDto: UpdateRuleDto,
    @Request() req,
  ) {
    return await this.ruleService.duplicateRule(id, updateRuleDto, req);
  }

  @Roles(RulePrivileges.DELETE_RULE)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete a single rule',
    type: Rule,
  })
  async remove(@Param('id') id: string, @Request() req) {
    return await this.ruleService.remove(id, req);
  }

  @Roles(RulePrivileges.DISABLE_RULE)
  @Post(':id/disable')
  @ApiOkResponse({
    description: 'Disabling a single rule',
    type: Rule,
  })
  async disableRule(@Param('id') id: string, @Request() req): Promise<Rule> {
    return await this.ruleService.disableRule(id, req);
  }
}
