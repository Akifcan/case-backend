import { Test, TestingModule } from '@nestjs/testing'
import { BasketService } from './basket.service'
import { AppModule } from '../../app.module'

describe('BasketService', () => {
  let service: BasketService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    service = module.get<BasketService>(BasketService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
