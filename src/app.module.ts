import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import pino from 'pino'
import { AppController } from './app.controller'
import { Environment, validate } from './env.validation'

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, validate }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const pinoHttp: pino.LoggerOptions = {
          name: config.get<string>('LOG_NAME', 'nestjs-api'),
          level: config.get<string>('LOG_LEVEL', 'debug'),
        }

        if (config.get<Environment>('NODE_ENV') !== Environment.Production) {
          pinoHttp.transport = {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
              translateTime: true,
            },
          }
        }

        return { pinoHttp }
      },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
