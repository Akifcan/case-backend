import { Controller, Get, Inject } from '@nestjs/common'
import { Public } from '../../decorators/is-public.decorator'
import { CategoryService } from './category.service'

@Controller('category')
@Public()
export class CategoryController {
  @Inject() categoryService: CategoryService

  @Get()
  categories() {
    return this.categoryService.categories()
  }
}
