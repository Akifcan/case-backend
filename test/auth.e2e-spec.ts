import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('Auth Controller (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'johndoe@mail.com',
      password: 'test123A%',
    })
    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('user')
    expect(response.body).toHaveProperty('accessToken')
  })

  it('/auth/register (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `ak${Math.random() * 999}ifcannnn@icloud.comc4`,
        password: '123Aasdf%',
        name: 'akif',
      })
    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('user')
    expect(response.body).toHaveProperty('accessToken')
  })

  it('REGISTER if email exists should throw error', async () => {
    const response = await request(app.getHttpServer()).post('/auth/register').send({
      email: `johndoe@mail.com`,
      password: '123Aasdf%',
      name: 'akif',
    })
    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body).toHaveProperty('error_code')
  })

  it('LOGIN if wrong credential should throw error', async () => {
    const response = await request(app.getHttpServer()).post('/auth/login').send({
      email: `johndoe@mail.com`,
      password: '123Aasdfasdf%',
    })
    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body).toHaveProperty('error_code')
  })
})
