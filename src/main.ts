import { Logger as NestLogger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import compress from 'fastify-compress'
import helmet from 'fastify-helmet'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
  const env = app.get(EnvService)

  app.enableCors()
  app.useLogger(app.get(Logger))
  app.setGlobalPrefix(env.API_BASE_PATH)
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

  app.register(helmet, {
    frameguard: false,
    dnsPrefetchControl: {
      allow: true,
    },
  })

  app.register(compress)

  await app.listen(env.PORT)

  NestLogger.log(`App listening on port http://localhost:${env.PORT}${env.API_BASE_PATH}`)
}

bootstrap()
