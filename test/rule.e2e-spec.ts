import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker';
import { StateEnum } from '../src/rule/schema/rule.schema';
import { user } from './mocks/userMocks';
import { rule } from './mocks/mocks';
import { assignPrivileges } from './utils';

jest.setTimeout(50000);
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  const loginUser = async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect('Content-Type', /json/);
  };
  const getRules = async () => {
    const response = await request(app.getHttpServer())
      .get('/rule')
      .set('Authorization', `Bearer ${userToken}`);
    return response.body.rules;
  };

  const createRule = async () => {
    const response = await request(app.getHttpServer())
      .post('/rule')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        ...rule,
      });
    return response.body;
  };

  describe('/auth e2e tests', () => {
    it('/auth/login (POST) should login a user', async () => {
      const response = await loginUser();
      expect(response.status).toBe(201);
      expect(response.body.access_token).toBeDefined();
      expect(response.body.token_type).toEqual('Bearer');
      userToken = response.body.access_token;
      await assignPrivileges(userToken, user.username);
    });
  });

  describe('/rule e2e tests', () => {
    it('/ (POST) should create a new rule', async () => {
      const response = await request(app.getHttpServer())
        .post('/rule')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          ...rule,
        });
      expect(response.status).toBe(201);
    });

    it('/ (POST) should fail on invalid state enum', async () => {
      const response = await request(app.getHttpServer())
        .post('/rule')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          ...rule,
          state: faker.string.sample(),
        });
      expect(response.status).toBe(400);
    });

    it('/ (GET) get all rules', async () => {
      const response = await request(app.getHttpServer())
        .get('/rule')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(200);
    });

    it('/:id (GET) should get a single rule', async () => {
      const id = (await createRule())._key;
      const result = await request(app.getHttpServer())
        .get(`/rule/${id}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(result.status).toBe(200);
    });

    it('/:id (GET) should fail on non existing rule', async () => {
      const id = faker.string.uuid();
      const result = await request(app.getHttpServer())
        .get(`/rule/${id}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(result.status).toBe(404);
    });

    it('/:id (PATCH) should update an existing rule', async () => {
      const id = (await createRule())._key;
      const result = await request(app.getHttpServer())
        .patch(`/rule/${id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          cfg: faker.string.sample(),
          state: StateEnum['90_ABANDONED'],
          desc: faker.string.sample(),
        });
      expect(result.status).toBe(200);
    });

    it('/:id/disable (POST) should disable an existing rule', async () => {
      const id = (await createRule())._key;
      const response = await request(app.getHttpServer())
        .post(`/rule/${id}/disable`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(201);
    });

    it('/:id (DELETE) should make a rule for deletion', async () => {
      const id = (await createRule())._key;
      const response = await request(app.getHttpServer())
        .delete(`/rule/${id}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(200);
    });

    it('/rule-config (GET) should return rules with the configuration', async () => {
      await createRule();
      const response = await request(app.getHttpServer())
        .get(`/rule/rule-config`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body.rules[0].ruleConfigs).toBeDefined();
    });
  });
});
