import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe, Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // app.enableCors({ origin: ['http://localhost:3000'], credentials: true })
  app.setGlobalPrefix('api')
  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  await app.listen(port || 3000)
}

bootstrap().then(() => {
  const logger: Logger = new Logger('NestApplication')
  logger.log(`Process env ${process.env.NODE_ENV}`)
  logger.log(`Running on port ${process.env.PORT}`)
})
