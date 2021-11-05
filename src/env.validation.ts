import { plainToClass } from 'class-transformer'
import { IsEnum, IsString, validateSync } from 'class-validator'

export enum Environment {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development

  @IsString()
  PORT = '8080'

  @IsString()
  API_BASE_PATH = '/api/v1'

  @IsString()
  LOG_NAME = 'nestjs-api-boilerplate'

  @IsString()
  LOG_LEVEL = 'debug'
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}
