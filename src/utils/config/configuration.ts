import { entities } from '../typeorm'
import * as dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
export default () => ({
  // APP
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  ENVIRONMENT_MESSAGE: process.env.ENVIRONMENT_MESSAGE,
  CORS_ORIGIN: process.env.CORS_ORIGIN,

  //POSTGRES
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_DB_HOST: process.env.POSTGRES_DB_HOST,
  POSTGRES_DB_USERNAME: process.env.POSTGRES_DB_USERNAME,
  POSTGRES_DB_PASSWORD: process.env.POSTGRES_DB_PASSWORD,
  POSTGRES_DB_PORT: process.env.POSTGRES_DB_PORT,

  //JWT
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
  JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_EXPIRATION_TIME: process.env.JWT_REFRESH_EXPIRATION_TIME,

  //AWS
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_URL: process.env.AWS_URL,

  CONTAINER: {
    type: 'postgres',
    database: 'postgres',
    host: process.env.POSTGRES_DB_HOST,
    port: parseInt(process.env.POSTGRES_DB_PORT),
    username: process.env.POSTGRES_DB_USERNAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    synchronize: true,
    entities,
    logging: false
  }
})
// import * as dotenv from 'dotenv';
// import { resolve } from 'path';
// dotenv.config({ path: resolve(__dirname, '../.env') });
