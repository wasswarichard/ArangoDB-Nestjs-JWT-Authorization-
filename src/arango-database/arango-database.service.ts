import 'dotenv-defaults/config';
import { Injectable } from '@nestjs/common';
import * as arangojs from 'arangojs';
import { RULE_COLLECTION, ruleSchema } from '../rule/schema/rule.schema';
import { databaseConfig } from './database.config';
import {
  RULE_CONFIG_COLLECTION,
  ruleConfigSchema,
} from '../rule-config/schema/rule-config.schema';

@Injectable()
export class ArangoDatabaseService {
  private readonly database: arangojs.Database;

  constructor() {
    this.database = new arangojs.Database(databaseConfig);
  }

  getDatabase() {
    return this.database;
  }

  async initializeCollections() {
    // Specify the collections you want to ensure exist
    const collections = [
      { name: RULE_COLLECTION, options: ruleSchema },
      { name: RULE_CONFIG_COLLECTION, options: ruleConfigSchema },
    ];

    // Iterate over the collection names and create them if they don't exist
    for (const { name, options } of collections) {
      if (!(await this.collectionExists(name))) {
        try {
          await this.database.createCollection(name, {
            schema: options.schema,
            computedValues: [...options.computedValues],
          });
        } catch (error) {
          console.error('Error initializing schema');
        }
      }
    }
  }

  private async collectionExists(collectionName: string) {
    // Check if the specified collection Exists
    const collections = await this.database.listCollections();
    return collections.some(
      (collection: { name: string }) => collection.name === collectionName,
    );
  }

  async initializeDatabase() {
    try {
      await this.initializeCollections();
      console.log(`Database '${databaseConfig.databaseName}' is ready.`);
    } catch (error) {
      console.error(`Error initializing database: ${error.message} `);
    }
  }
}
