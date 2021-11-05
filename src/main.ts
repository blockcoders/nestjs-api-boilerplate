import { Logger as NestLogger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as compression from 'compression'
import * as helmet from 'helmet'
import * as hpp from 'hpp'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    bufferLogs: true,
  })
  const configService = app.get(ConfigService)
  const port = parseInt(configService.get<string>('PORT', '8080'), 10)
  const basePath = configService.get<string>('API_BASE_PATH', '/api/v1')

  app.enableCors()
  app.useLogger(app.get(Logger))
  app.setGlobalPrefix(basePath)
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
    }),
  )
  app.use([
    compression(),
    helmet({
      frameguard: false,
      dnsPrefetchControl: {
        allow: true,
      },
    }),
    hpp(),
  ])

  await app.listen(port)

  NestLogger.log(`App listening on port http://localhost:${port}${basePath}`)
}

bootstrap()
