import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRuleConfigDto } from './dto/create-rule-config.dto';
import { UpdateRuleConfigDto } from './dto/update-rule-config.dto';
import { Request } from 'express';
import { ArangoDatabaseService } from '../arango-database/arango-database.service';
import { RULE_CONFIG_COLLECTION } from './schema/rule-config.schema';
import { RuleConfig } from './entities/rule-config.entity';
import { v4 as uuidv4 } from 'uuid';
import { StateEnum } from '../rule/schema/rule.schema';
import { RuleService } from '../rule/rule.service';

@Injectable()
export class RuleConfigService {
  constructor(
    private readonly arangoDatabaseService: ArangoDatabaseService,
    private readonly ruleService: RuleService,
  ) {}
  async create(createRuleConfigDto: CreateRuleConfigDto, req: Request) {
    const db = this.arangoDatabaseService.getDatabase();
    const collection = db.collection(RULE_CONFIG_COLLECTION);
    await this.ruleService.findOne(createRuleConfigDto.ruleId);
    const id = uuidv4();

    try {
      // Insert the new document into the 'rule config' collection;
      return await collection.save({
        ...createRuleConfigDto,
        ownerId: req['user'].username,
        _key: id,
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAll(options: {
    page: number;
    limit: number;
  }): Promise<{ count: number; data: RuleConfig[] }> {
    const { limit, page } = options;
    const db = this.arangoDatabaseService.getDatabase();
    const skip = (page - 1) * limit;
    try {
      const cursor = await db.query(
        `
        LET count = LENGTH(FOR doc IN ${RULE_CONFIG_COLLECTION} FILTER doc.edited != @edited RETURN doc)
        LET data = (
            FOR config IN ${RULE_CONFIG_COLLECTION}
            FILTER config.edited != @edited
            sort config.createdAt ASC
            LIMIT ${skip}, ${limit}
            RETURN config
          )
        RETURN { count, data }
        `,
        { edited: true },
      );
      return await cursor.next();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findOne(id: string): Promise<RuleConfig> {
    const db = this.arangoDatabaseService.getDatabase();
    try {
      return await db.collection(RULE_CONFIG_COLLECTION).document(id);
    } catch (e) {
      throw new NotFoundException(`rule config with id ${id} not found`);
    }
  }

  async duplicateRuleConfig(
    id: string,
    updateRuleConfigDto: UpdateRuleConfigDto,
    req: Request,
  ): Promise<RuleConfig> {
    const db = this.arangoDatabaseService.getDatabase();
    const collection = db.collection(RULE_CONFIG_COLLECTION);

    // check if the rule exists
    const existingRuleConfig = await this.findOne(id);

    // check if rule config is already edited
    const childRuleConfig = await collection.byExample({ originatedID: id });
    if (childRuleConfig.count > 0) {
      throw new ForbiddenException(
        `Could not update rule config with id ${id}, rule config is already updated`,
      );
    }
    const uuid = uuidv4();
    const { _key, _id, _rev, ...rest } = existingRuleConfig;

    // save rule to the database
    try {
      const rule = await collection.save({
        ...rest,
        ...updateRuleConfigDto,
        _key: uuid,
        originatedID: id,
        updatedBy: req['user'].username,
      });
      await this.update(id, { edited: true });
      return this.findOne(rule._id);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async update(id: string, updateRuleConfigDto: any): Promise<RuleConfig> {
    const db = this.arangoDatabaseService.getDatabase();
    const rule = await db
      .collection(RULE_CONFIG_COLLECTION)
      .update(id, updateRuleConfigDto);
    return rule.new;
  }

  async remove(id: string, req: Request) {
    const database = this.arangoDatabaseService.getDatabase();

    // check if the rule exists
    const existingRuleConfig = await this.findOne(id);
    if (existingRuleConfig.state === StateEnum['93_MARKED_FOR_DELETION']) {
      throw new BadRequestException(
        `Rule config with id ${id} already marked for deletion`,
      );
    }

    // Save the rule to the database
    try {
      await database.collection(RULE_CONFIG_COLLECTION).update(id, {
        ...existingRuleConfig,
        state: StateEnum['93_MARKED_FOR_DELETION'],
        updatedBy: req['user'].username,
      });
      return;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async disableRuleConfig(id: string, req: Request): Promise<RuleConfig> {
    const db = this.arangoDatabaseService.getDatabase();

    // check if the rule exists
    const existingRuleConfig = await this.findOne(id);
    if (existingRuleConfig.state === StateEnum['92_DISABLED']) {
      throw new BadRequestException(
        `Rule config with id ${id} already disabled`,
      );
    }

    // Save the updated rule to the database
    try {
      await db.collection(RULE_CONFIG_COLLECTION).update(id, {
        ...existingRuleConfig,
        state: StateEnum['92_DISABLED'],
        updatedBy: req['user'].username,
      });
      return await this.findOne(id);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
