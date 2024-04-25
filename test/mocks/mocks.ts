import { faker } from '@faker-js/faker';
import { DataTypeEnum, StateEnum } from '../../src/rule/schema/rule.schema';

export const rule = {
  name: faker.string.sample(),
  cfg: faker.string.sample(),
  dataType: DataTypeEnum['CURRENCY'],
  state: StateEnum['01_DRAFT'],
  desc: faker.string.sample(),
};

export const ruleConfig = {
  cfg: faker.string.sample(),
  state: StateEnum['01_DRAFT'],
  ruleId: faker.string.uuid(),
  desc: faker.string.sample(),
  config: {
    parameters: {
      maxQueryLimit: 3,
      tolerance: 0.1,
    },
    exitConditions: [
      {
        subRuleRef: '.x00',
        outcome: false,
        reason: 'Incoming transaction is unsuccessful',
      },
    ],
    cases: [
      {
        subRuleRef: '.00',
        outcome: false,
        reason:
          'The transaction type is not defined in this rule configuration',
        value: 'UNDEFINED',
      },
      {
        subRuleRef: '.01',
        value: 'WITHDRAWAL',
        outcome: true,
        reason: 'The transaction is identified as a cash withdrawal',
      },
    ],
  },
};
