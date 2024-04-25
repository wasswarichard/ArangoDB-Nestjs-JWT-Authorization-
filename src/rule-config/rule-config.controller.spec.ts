import { Test, TestingModule } from '@nestjs/testing';
import { RuleConfigController } from './rule-config.controller';
import { RuleConfigService } from './rule-config.service';
import { CanActivate } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrivilegeService } from '../privilege/privilege.service';

describe('RuleConfigController', () => {
  let controller: RuleConfigController;
  const mockRuleConfigService = {
    findAll: jest.fn().mockImplementation((dto: RuleConfigService) => {
      return [{ ...dto }];
    }),
    create: jest.fn().mockImplementation((dto) => {
      return {
        ...dto,
      };
    }),
  };
  const mockPrivilegeService = {};
  beforeEach(async () => {
    const mockAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };
    const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuleConfigController],
      providers: [RuleConfigService],
    })
      .overrideProvider(RuleConfigService)
      .useValue(mockRuleConfigService)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .overrideProvider(PrivilegeService)
      .useValue(mockPrivilegeService)
      .compile();

    controller = module.get<RuleConfigController>(RuleConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
