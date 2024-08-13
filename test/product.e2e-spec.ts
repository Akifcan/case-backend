import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('Product Controller (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/product (POST)', async () => {
    const response = await request(app.getHttpServer()).post('/product?page=1&limit=5').send({
      currency: 'tl',
      // "category": "tistortler",
      //"keyword": "nike"
    })
    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('products')
  })

  it('/product/:slug (GET)', async () => {
    const response = await request(app.getHttpServer()).post('/product/nike-blue-shoe').send({
      currency: 'tl',
      // "category": "tistortler",
      //"keyword": "nike"
    })
    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('product')
  })

  it('NOT FOUND /product/:slug (GET)', async () => {
    const response = await request(app.getHttpServer()).post('/product/nike-blue-shoeasdf').send({
      currency: 'tl',
      // "category": "tistortler",
      //"keyword": "nike"
    })
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error_code')
  })
})
