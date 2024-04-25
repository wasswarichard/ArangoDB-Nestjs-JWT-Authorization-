import { StateEnum } from '../../rule/schema/rule.schema';
import { SchemaOptions } from 'arangojs/collection';

export const RULE_CONFIG_COLLECTION = 'rule_config';
export const ruleConfigSchema: { schema: SchemaOptions; computedValues: any } =
  {
    schema: {
      rule: {
        properties: {
          _key: { type: 'string' },
          desc: { type: 'string' },
          cfg: { type: 'string' },
          state: {
            type: 'string',
            enum: Object.values(StateEnum),
            default: StateEnum['01_DRAFT'],
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          updatedBy: { type: 'string' },
          approverId: { type: 'string' },
          ownerId: { type: 'string' },
          ruleId: { type: 'string' },
          originatedID: { type: 'string', default: null },
          edited: { type: 'boolean', default: false },
          config: {
            type: 'object',
            properties: {
              parameters: {
                type: 'object',
                additionalProperties: true,
              },
              exitConditions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    subRuleRef: { type: 'string' },
                    outcome: { type: 'boolean' },
                    reason: { type: 'string' },
                  },
                },
              },
              bands: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    subRuleRef: { type: 'string' },
                    upperLimit: { type: ['number', 'null'] },
                    lowerLimit: { type: ['number', 'null'] },
                    outcome: { type: 'boolean' },
                    reason: { type: 'string' },
                  },
                },
              },
              cases: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    subRuleRef: { type: 'string' },
                    value: { type: ['string', 'number'] },
                    outcome: { type: 'boolean' },
                    reason: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        required: ['cfg', 'ruleId', 'state', 'desc', 'ownerId'],
        additionalProperties: false,
      },
    },
    computedValues: [
      {
        name: 'createdAt',
        expression: 'RETURN DATE_ISO8601(DATE_NOW())',
        computeOn: ['insert'],
        overwrite: true,
      },
      {
        name: 'updatedAt',
        expression: 'RETURN DATE_ISO8601(DATE_NOW())',
        computeOn: ['insert', 'update'],
        overwrite: true,
      },
    ],
  };
