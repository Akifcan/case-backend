import { Test, TestingModule } from '@nestjs/testing'
import { ProductService } from './product.service'
import { AppModule } from '../../app.module'

describe('ProductService', () => {
  let service: ProductService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    service = module.get<ProductService>(ProductService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should list the all products', async () => {
    const result = await service.products(
      {
        currency: 'tl',
        category: 'ayakkabi',
      },
      {
        page: 1,
        limit: 5,
      },
    )
    expect(Array.isArray(result.products)).toBe(true)
    const obj = result.products[0]
    expect(obj).toHaveProperty('id')
    expect(obj).toHaveProperty('name')
    expect(obj).toHaveProperty('description')
    expect(obj).toHaveProperty('slug')
    expect(obj).toHaveProperty('product')
    expect(obj).toHaveProperty('images')
    expect(Array.isArray(obj.images)).toBe(true)
    expect(result).toHaveProperty('totalPage')
    expect(result.totalPage).toBeGreaterThan(0)
  })

  it('product array length should be less than limit count', async () => {
    const limit = 5
    const result = await service.products(
      {
        currency: 'tl',
        category: 'ayakkabi',
      },
      {
        page: 1,
        limit,
      },
    )
    expect(Array.isArray(result.products)).toBe(true)
    expect(result.products.length).toBeLessThanOrEqual(limit)
  })

  it('should list the product details', async () => {
    // NOTE MAKE SURE YOU RUN THE SEEDER BEFORE RUN THIS TEST!
    const slug = 'nike-blue-shoe'

    const result = await service.product(slug, {
      currency: 'tl',
    })
    const product = result.product
    expect(product).toHaveProperty('id')
    expect(product).toHaveProperty('name')
    expect(product).toHaveProperty('description')
    expect(product).toHaveProperty('product')
    expect(product).toHaveProperty('price')
    expect(product).toHaveProperty('discountPrice')
    expect(product).toHaveProperty('currency')
    expect(product).toHaveProperty('images')
  })

  it('error code should be **product.not_found** when the slug is not found', async () => {
    const slug = 'nike-blue-shoeasdfadsf'

    try {
      await service.product(slug, {
        currency: 'tl',
      })
      expect(true).toBe(false)
    } catch (e) {
      expect(e.response.error_code).toBe('product.not_found')
    }
  })
})
