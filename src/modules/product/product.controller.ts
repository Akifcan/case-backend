import { Controller, Get, Inject } from '@nestjs/common'
import { CurrentUser } from '../../decorators/current-user.decorator'
import { User } from '../user/user.entity'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
  @Inject() productService: ProductService

  @Get()
  products(@CurrentUser() currentUser: User) {
    return this.productService.products()
  }
}
