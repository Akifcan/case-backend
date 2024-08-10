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
})
