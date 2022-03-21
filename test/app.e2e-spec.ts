import { INestApplication } from '@nestjs/common'
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter())
    await app.listen(4000)
  })

  afterEach(async () => {
    await app.close()
  })

  it('/ping (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/ping')

    expect(response.status).toEqual(200)
    expect(response.text).toEqual('pong')
  })
})
