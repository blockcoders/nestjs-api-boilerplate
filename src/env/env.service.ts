import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Params as PinoParams } from 'nestjs-pino'
import { Level as PinoLevel, LoggerOptions } from 'pino'
import { Environment } from 'src/env/env.validation'

@Injectable()
export class EnvService {
  public readonly NODE_ENV: Environment
  public readonly PORT: number
  public readonly API_BASE_PATH: string
  public readonly LOG_NAME: string
  public readonly LOG_LEVEL: PinoLevel

  constructor(private readonly config: ConfigService) {
    // public env variables
    this.NODE_ENV = this.config.get<Environment>('NODE_ENV', Environment.Development)
    this.PORT = parseInt(this.config.get<string>('PORT', '8080'), 10)
    this.API_BASE_PATH = this.config.get<string>('API_BASE_PATH', '/api/v1')
    this.LOG_NAME = this.config.get<string>('LOG_NAME', 'nestjs-api-boilerplate')
    this.LOG_LEVEL = this.config.get<PinoLevel>('LOG_LEVEL', 'debug')
  }

  public isProduction(): boolean {
    return this.NODE_ENV === Environment.Production
  }

  public isDevelopment(): boolean {
    return this.NODE_ENV === Environment.Development
  }

  public isTest(): boolean {
    return this.NODE_ENV === Environment.Test
  }

  public isStaging(): boolean {
    return this.NODE_ENV === Environment.Staging
  }

  public getPinoConfig(): PinoParams {
    const pinoHttp: LoggerOptions = {
      name: this.LOG_NAME,
      level: this.LOG_LEVEL,
    }

    if (!this.isProduction()) {
      pinoHttp.transport = {
        target: 'pino-pretty',
        options: { colorize: true, singleLine: true, translateTime: true },
      }
    }

    return { pinoHttp }
  }
}
