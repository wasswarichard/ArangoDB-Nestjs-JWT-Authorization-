import 'dotenv-defaults/config';

export const databaseConfig = {
  url: process.env.DATABASE_HOST,
  databaseName: process.env.DATABASE_NAME,
  auth: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
};
