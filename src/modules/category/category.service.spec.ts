import { Test, TestingModule } from '@nestjs/testing'
import { CategoryService } from './category.service'
import { AppModule } from '../../app.module'

describe('CategoryService', () => {
  let service: CategoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    service = module.get<CategoryService>(CategoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should list the categories', async () => {
    const result = await service.categories()
    expect(Array.isArray(result)).toBe(true)
    const obj = result[0]
    expect(obj).toHaveProperty('name')
    expect(obj).toHaveProperty('slug')
    expect(obj).toHaveProperty('category')
  })
})
