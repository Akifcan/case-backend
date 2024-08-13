import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { SeedController } from '../src/seed/seed.controller'

describe('Comment Controller (e2e)', () => {
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

  it('/comment/:id (GET)', async () => {
    const products = await seedController.productRepository.find({ take: 3 })

    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'johndoe@mail.com',
      password: 'test123A%',
    })

    expect(login.body).toHaveProperty('accessToken')

    const accessToken = login.body.accessToken

    const response = await request(app.getHttpServer())
      .get(`/comment/${products[0].id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('totalCount')
    expect(response.body).toHaveProperty('comments')
    expect(response.body.totalCount).toBeGreaterThanOrEqual(1)
    expect(Array.isArray(response.body.comments)).toBe(true)
  })

  it('/comment/:id (POST)', async () => {
    const products = await seedController.productRepository.find({ take: 3 })

    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'johndoe@mail.com',
      password: 'test123A%',
    })

    expect(login.body).toHaveProperty('accessToken')

    const accessToken = login.body.accessToken
    const userId = login.body.user.id

    const response = await request(app.getHttpServer())
      .post(`/comment/${products[0].id}`)
      .send({
        comment: 'nice product',
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(201)
    const commentId = response.body.id

    await seedController.commentRepository.delete({ id: commentId, user: { id: userId } })
  })
})
