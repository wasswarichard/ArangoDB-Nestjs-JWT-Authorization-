import 'dotenv-defaults/config';

const mandatoryEnvironmentVariables = [
  'AUTH_N_SVC_BASEURL',
  'AUTHORIZATION_BASEURL',
  'AUTH_N_TOKEN_ISSUER_NAME',
  'AUTH_N_TOKEN_AUDIENCE',
  'KAFKA_URL',
  'BC_NAME',
  'APP_NAME',
  'APP_VERSION',
  'SVC_CLIENT_ID',
  'SVC_CLIENT_SECRET',
  'DATABASE_HOST',
  'DATABASE_NAME',
  'DATABASE_USERNAME',
  'DATABASE_PASSWORD',
];
const missingEnvironmentVariables = mandatoryEnvironmentVariables.filter(
  (variable) => !process.env[variable],
);
if (missingEnvironmentVariables.length > 0) {
  console.error(
    `Environment Variables [${missingEnvironmentVariables.join(',')}] not defined, terminating ...`,
  );
  process.exit(1);
}

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrivilegeModule } from './privilege/privilege.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3005;
  const app = await NestFactory.create(AppModule);

  // initialize privileges
  const privilegeModule = app.select(PrivilegeModule);
  await privilegeModule.get(PrivilegeModule).seedPrivileges();

  // api prefixing
  app.setGlobalPrefix('api', { exclude: [''] });

  // swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('LexTego Api')
    .setDescription('The lexTego API description')
    .setVersion('1.0')
    .addTag('lexTego')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  await app.listen(PORT);
}
bootstrap();
