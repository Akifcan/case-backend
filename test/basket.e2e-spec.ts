import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { BasketService } from '../src/modules/basket/basket.service'
import { UserService } from '../src/modules/user/user.service'
import { SeedController } from '../src/seed/seed.controller'
import { Currency } from '../src/shared/shared.types'

describe('Basket Controller (e2e)', () => {
  let app: INestApplication
  let basketService: BasketService
  let userService: UserService
  let seedController: SeedController

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    basketService = moduleFixture.get<BasketService>(BasketService)
    userService = moduleFixture.get<UserService>(UserService)
    seedController = moduleFixture.get<SeedController>(SeedController)

    await app.init()
  })

  it('/basket/:productId (POST)', async () => {
    const products = await seedController.productRepository.find({ take: 3 })
    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'johndoe@mail.com',
      password: 'test123A%',
    })

    expect(login.body).toHaveProperty('accessToken')

    const userId = login.body.user.id
    const accessToken = login.body.accessToken

    const response = await request(app.getHttpServer())
      .post(`/basket/${products[0].id}`)
      .send({
        visitorId: 1134,
        quantity: 1,
        currency: 'tl',
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('message')
    await basketService.basketRepository.delete({ user: { id: userId } })

    // expect(response.statusCode).toBe(201)
    // expect(response.body).toHaveProperty('products')
  })

  it('Should empty basket', async () => {
    const products = await seedController.productRepository.find({ take: 3 })
    const productId = products[0].id
    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'johndoe@mail.com',
      password: 'test123A%',
    })

    expect(login.body).toHaveProperty('accessToken')
    const accessToken = login.body.accessToken

    await request(app.getHttpServer())
      .post(`/basket/${productId}`)
      .send({
        visitorId: 1134,
        quantity: 1,
        currency: 'tl',
      })
      .set('Authorization', `Bearer ${accessToken}`)

    const response = await request(app.getHttpServer())
      .delete(`/basket/${productId}`)
      .send({
        quantity: 1,
        currency: Currency.tl,
        visitorId: 1134,
      })
      .set('Authorization', `Bearer ${accessToken}`)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('This item removed from basket')
  })

  it('should list the basket', async () => {
    const products = await seedController.productRepository.find({ take: 3 })
    const product1 = products[0].id
    const product2 = products[1].id

    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'johndoe@mail.com',
      password: 'test123A%',
    })

    expect(login.body).toHaveProperty('accessToken')

    const userId = login.body.user.id
    const accessToken = login.body.accessToken

    await request(app.getHttpServer())
      .post(`/basket/${product1}`)
      .send({
        visitorId: 1134,
        quantity: 1,
        currency: 'tl',
      })
      .set('Authorization', `Bearer ${accessToken}`)
    await request(app.getHttpServer())
      .post(`/basket/${product1}`)
      .send({
        visitorId: 1134,
        quantity: 1,
        currency: 'tl',
      })
      .set('Authorization', `Bearer ${accessToken}`)
    await request(app.getHttpServer())
      .post(`/basket/${product2}`)
      .send({
        visitorId: 1134,
        quantity: 1,
        currency: 'tl',
      })
      .set('Authorization', `Bearer ${accessToken}`)

    const response = await request(app.getHttpServer())
      .post(`/basket/`)
      .send({
        visitorId: 1134,
        currency: 'tl',
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('basket')
    expect(response.body).toHaveProperty('pricing')
    expect(response.body.basket.length).toBe(2)
    await basketService.basketRepository.delete({ user: { id: userId } })
  })

  it('should list count of the basket', async () => {
    const products = await seedController.productRepository.find({ take: 3 })
    const product1 = products[0].id
    const product2 = products[1].id

    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'johndoe@mail.com',
      password: 'test123A%',
    })

    expect(login.body).toHaveProperty('accessToken')

    const userId = login.body.user.id
    const accessToken = login.body.accessToken

    await request(app.getHttpServer())
      .post(`/basket/${product1}`)
      .send({
        visitorId: 1134,
        quantity: 1,
        currency: 'tl',
      })
      .set('Authorization', `Bearer ${accessToken}`)
    await request(app.getHttpServer())
      .post(`/basket/${product1}`)
      .send({
        visitorId: 1134,
        quantity: 1,
        currency: 'tl',
      })
      .set('Authorization', `Bearer ${accessToken}`)
    await request(app.getHttpServer())
      .post(`/basket/${product2}`)
      .send({
        visitorId: 1134,
        quantity: 1,
        currency: 'tl',
      })
      .set('Authorization', `Bearer ${accessToken}`)

    const response = await request(app.getHttpServer())
      .post(`/basket/count`)
      .send({
        visitorId: 1134,
        currency: 'tl',
      })
      .set('Authorization', `Bearer ${accessToken}`)
    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('totalItem')
    expect(response.body.totalItem).toBe(2)
    // expect(response.statusCode).toBe(201)
    // expect(response.body).toHaveProperty('basket')
    // expect(response.body).toHaveProperty('pricing')
    // expect(response.body.basket.length).toBe(2)
    await basketService.basketRepository.delete({ user: { id: userId } })
  })
})
