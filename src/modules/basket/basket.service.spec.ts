import { Test, TestingModule } from '@nestjs/testing'
import { BasketService } from './basket.service'
import { AppModule } from '../../app.module'
import { SeedController } from '../../seed/seed.controller'
import { UserService } from '../user/user.service'
import { Currency } from '../../shared/shared.types'

describe('BasketService', () => {
  let basketService: BasketService
  let userService: UserService
  let seedController: SeedController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    basketService = module.get<BasketService>(BasketService)
    userService = module.get<UserService>(UserService)
    seedController = module.get<SeedController>(SeedController)
  })

  it('should be defined', () => {
    expect(basketService).toBeDefined()
    expect(seedController).toBeDefined()
  })

  it('should add products to the basket', async () => {
    const products = await seedController.productRepository.find({ take: 3 })
    const user = await userService.userRepsitory.findOne({
      where: { email: 'akifcannnn@icloud.com' },
    })

    const basket1 = await basketService.updateBasket(
      products[0].id,
      { visitorId: 2323, quantity: 1, currency: Currency.dollar },
      user,
    )

    expect(basket1).toHaveProperty('message')
    expect(basket1.message).toEqual('Added to basket')

    const basket2 = await basketService.updateBasket(
      products[0].id,
      { visitorId: 2323, quantity: 1, currency: Currency.dollar },
      user,
    )

    expect(basket2).toHaveProperty('message')
    expect(basket2.message).toEqual('Updated basket')

    await basketService.basketRepository.delete({ user: { id: user.id } })
  })

  it('should remove product from the basket', async () => {
    const products = await seedController.productRepository.find({ take: 3 })
    const productId = products[0].id

    const user = await userService.userRepsitory.findOne({
      where: { email: 'akifcannnn@icloud.com' },
    })

    await basketService.updateBasket(
      productId,
      { visitorId: 2323, quantity: 1, currency: Currency.dollar },
      user,
    )

    const removeBasket = await basketService.removeFromBasket(
      productId,
      { visitorId: 2323, quantity: 1, currency: Currency.dollar },
      user,
    )

    expect(removeBasket).toHaveProperty('message')
    expect(removeBasket.message).toEqual('This item removed from basket')

    await basketService.basketRepository.delete({ user: { id: user.id } })
  })

  it('should list the products in the basket', async () => {
    const products = await seedController.productRepository.find({ take: 3 })
    const user = await userService.userRepsitory.findOne({
      where: { email: 'akifcannnn@icloud.com' },
    })

    await basketService.updateBasket(
      products[0].id,
      { visitorId: 2323, quantity: 1, currency: Currency.dollar },
      user,
    )

    await basketService.updateBasket(
      products[1].id,
      { visitorId: 2323, quantity: 1, currency: Currency.dollar },
      user,
    )

    await basketService.updateBasket(
      products[2].id,
      { visitorId: 2323, quantity: 1, currency: Currency.dollar },
      user,
    )

    const basketItems = await basketService.basket(
      { visitorId: 2323, quantity: 1, currency: Currency.dollar },
      user,
    )

    expect(basketItems).toHaveProperty('basket')
    expect(basketItems).toHaveProperty('pricing')
    const basketArr = basketItems.basket
    expect(Array.isArray(basketArr)).toBe(true)
    expect(basketArr[0]).toHaveProperty('product')
    expect(basketArr[0]).toHaveProperty('basket')
    expect(basketArr[0]).toHaveProperty('image')
    expect(basketArr[0]).toHaveProperty('pricing')

    await basketService.basketRepository.delete({ user: { id: user.id } })
  })

  it('should list the total count of basket', async () => {
    const products = await seedController.productRepository.find({ take: 3 })
    const user = await userService.userRepsitory.findOne({
      where: { email: 'akifcannnn@icloud.com' },
    })

    await basketService.updateBasket(
      products[0].id,
      { visitorId: 2323, quantity: 1, currency: Currency.dollar },
      user,
    )

    await basketService.updateBasket(
      products[1].id,
      { visitorId: 2323, quantity: 1, currency: Currency.dollar },
      user,
    )

    await basketService.updateBasket(
      products[2].id,
      { visitorId: 2323, quantity: 1, currency: Currency.dollar },
      user,
    )

    const basketItems = await basketService.basketCount(
      { visitorId: 2323, quantity: 1, currency: Currency.dollar },
      user,
    )

    expect(basketItems).toHaveProperty('totalItem')
    expect(basketItems.totalItem).toEqual(3)

    await basketService.basketRepository.delete({ user: { id: user.id } })
  })
})
