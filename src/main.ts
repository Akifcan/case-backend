import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { AppConfig } from './config/config.interface'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get<ConfigService>(ConfigService)
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  await app.listen(configService.get<AppConfig>('app').port)
}
bootstrap()
