import { Test, TestingModule } from '@nestjs/testing';
import { RuleConfigService } from './rule-config.service';
import { createMock } from '@golevelup/ts-jest';

describe('RuleConfigService', () => {
  let service: RuleConfigService;
  const mockArangoDatabaseService = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RuleConfigService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<RuleConfigService>(RuleConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a rule config', () => {
    expect(mockArangoDatabaseService).toBeDefined();
  });
});
