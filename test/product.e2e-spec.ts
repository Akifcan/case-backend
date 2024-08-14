import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { CreateProductDto } from '../src/modules/product/dtos/create-product.dto'
import { Currency, Locale } from '../src/shared/shared.types'
import { ProductService } from '../src/modules/product/product.service'

describe('Product Controller (e2e)', () => {
  let app: INestApplication
  let productService: ProductService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    productService = moduleFixture.get<ProductService>(ProductService)

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

  it('should create product if authorized user', async () => {
    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'akifcannnn@icloud.com',
      password: 'test123A%',
    })

    const accessToken = login.body.accessToken
    expect(login.body).toHaveProperty('accessToken')

    const obj: CreateProductDto = {
      categoryId: 5,
      images: [
        {
          altTag: 'asdf',
          src: 'https://images.unsplash.com/photo-1719937206220-f7c76cc23d78?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          altTag: 'asdf2',
          src: 'https://images.unsplash.com/photo-1719937206220-f7c76cc23d78?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      ],
      pricing: [
        {
          currency: Currency.tl,
          price: 200,
        },
        {
          currency: Currency.euro,
          price: 10,
        },
        {
          currency: Currency.dollar,
          price: 9,
        },
      ],
      info: [
        {
          language: Locale.tr,
          name: 'testTR',
          description: 'test description',
          slug: 'test',
        },
        {
          language: Locale.en,
          name: 'testEN',
          description: 'test description',
          slug: 'test',
        },
      ],
    }

    const response = await request(app.getHttpServer())
      .post('/product/new-product')
      .send(obj)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('message')
    expect(response.body).toHaveProperty('id')
    expect(response.body.message).toBe('New product created')

    await productService.productRepository.delete({ id: response.body.id })
  })

  it('should throw error if unauthorized user attempt to create a product', async () => {
    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'johndoe@mail.com',
      password: 'test123A%',
    })

    const accessToken = login.body.accessToken
    expect(login.body).toHaveProperty('accessToken')

    const obj: CreateProductDto = {
      categoryId: 5,
      images: [
        {
          altTag: 'asdf',
          src: 'https://images.unsplash.com/photo-1719937206220-f7c76cc23d78?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          altTag: 'asdf2',
          src: 'https://images.unsplash.com/photo-1719937206220-f7c76cc23d78?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      ],
      pricing: [
        {
          currency: Currency.tl,
          price: 200,
        },
        {
          currency: Currency.euro,
          price: 10,
        },
        {
          currency: Currency.dollar,
          price: 9,
        },
      ],
      info: [
        {
          language: Locale.tr,
          name: 'testTR',
          description: 'test description',
          slug: 'test',
        },
        {
          language: Locale.en,
          name: 'testEN',
          description: 'test description',
          slug: 'test',
        },
      ],
    }

    const response = await request(app.getHttpServer())
      .post('/product/new-product')
      .send(obj)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
