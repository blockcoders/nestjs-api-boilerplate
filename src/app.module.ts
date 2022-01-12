import { Module } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'
import { AppController } from './app.controller'
import { EnvModule } from './env/env.module'
import { EnvService } from './env/env.service'

@Module({
  imports: [
    EnvModule,
    LoggerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (env: EnvService) => env.getPinoConfig(),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
