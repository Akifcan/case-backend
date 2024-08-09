import { Controller, Get } from '@nestjs/common'
import { CurrentUser } from '../../decorators/current-user.decorator'
import { User } from '../user/user.entity'

@Controller('product')
export class ProductController {
  @Get()
  products(@CurrentUser() currentUser: User) {
    return currentUser
  }
}
