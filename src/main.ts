import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe, Logger } from '@nestjs/common'
import configuration from './utils/config/configuration'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // const configService = app.get(ConfigService)
  const port = configuration().PORT
  const corsOrigin = configuration().CORS_ORIGIN.split(',')
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    credentials: true
  })
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  await app.listen(port || 3000)
}

bootstrap().then(() => {
  const logger: Logger = new Logger('NestApplication')
  logger.log(`Process env ${configuration().NODE_ENV}`)
  logger.log(`Running on port ${configuration().PORT}`)
})
