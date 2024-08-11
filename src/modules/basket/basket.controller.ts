import { Body, Controller, Inject, Param, Post } from '@nestjs/common'
import { Public } from '../../decorators/is-public.decorator'
import { BasketDto } from './dtos/basket.dto'
import { CurrentUser } from '../../decorators/current-user.decorator'
import { User } from '../user/user.entity'
import { BasketService } from './basket.service'

@Controller('basket')
export class BasketController {
  @Inject() basketService: BasketService

  @Public()
  @Post(':productId')
  basket(@Param('productId') productId: number, @Body() basketDto: BasketDto, @CurrentUser() user: User) {
    return this.basketService.addToBasket(productId, basketDto, user)
  }
}
