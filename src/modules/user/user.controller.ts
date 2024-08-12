import { Controller, Get, Inject } from '@nestjs/common'
import { CurrentUser } from '../../decorators/current-user.decorator'
import { User } from './user.entity'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  @Inject() userService: UserService

  @Get()
  user(@CurrentUser() user: User) {
    return this.userService.user(user.id)
  }
}
