import compress from '@fastify/compress'
import helmet from '@fastify/helmet'
import { Logger as NestLogger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
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
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  })

  app.register(compress)

  await app.listen(env.PORT, '0.0.0.0', (err: Error, address: string) => {
    if (err) {
      NestLogger.error(err)
      process.exit(1)
    }

    NestLogger.log(`App listening on ${address}`)
  })
}

bootstrap()
