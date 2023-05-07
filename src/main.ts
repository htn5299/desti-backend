import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
// import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: ['http://localhost:3000'], credentials: true })
  app.setGlobalPrefix('api')
  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT')
  console.log('Running on port: ', port)
  console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`configService: ${configService.get<string>('NODE_ENV')}`)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  // app.use(cookieParser());
  await app.listen(port || 3000)
}

bootstrap()
