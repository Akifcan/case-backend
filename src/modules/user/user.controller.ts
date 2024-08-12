import { Body, Controller, Get, Inject, Patch } from '@nestjs/common'
import { CurrentUser } from '../../decorators/current-user.decorator'
import { User } from './user.entity'
import { UserService } from './user.service'
import { UpdateUserDto } from './dtos/update-user.dto'

@Controller('user')
export class UserController {
  @Inject() userService: UserService

  @Get()
  user(@CurrentUser() user: User) {
    return this.userService.user(user.id)
  }

  @Patch()
  updateUser(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(user.id, updateUserDto)
  }
}
