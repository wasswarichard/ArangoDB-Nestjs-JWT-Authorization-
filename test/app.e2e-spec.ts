import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker';
import { user } from './mocks/userMocks';

jest.setTimeout(50000);
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  afterEach(async () => {
    await app.close();
  });

  describe('/ e2e Should check the application is up', () => {
    it('/ (GET)  API is running', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Api is running!');
    });
  });
});
