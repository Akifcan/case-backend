import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { SeedController } from '../src/seed/seed.controller'

describe('User Controller (e2e)', () => {
  let app: INestApplication
  let seedController: SeedController

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    seedController = moduleFixture.get<SeedController>(SeedController)

    await app.init()
  })

  it('/user (GET)', async () => {
    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'johndoe@mail.com',
      password: 'test123A%',
    })

    expect(login.body).toHaveProperty('accessToken')

    const accessToken = login.body.accessToken

    const response = await request(app.getHttpServer())
      .get(`/user`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('user')
    expect(response.body.user).toHaveProperty('name')
    expect(response.body.user).toHaveProperty('email')
    expect(response.body.user).toHaveProperty('role')
  })

  it('/user (PATCH)', async () => {
    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'johndoe@mail.com',
      password: 'test123A%',
    })

    expect(login.body).toHaveProperty('accessToken')

    const accessToken = login.body.accessToken
    const userId = login.body.user.id

    const response = await request(app.getHttpServer())
      .patch(`/user`)
      .send({
        name: 'demoxc',
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toEqual('Updated this record')
    await seedController.userRepository.update({ id: userId }, { name: 'john doe' })
  })
})
