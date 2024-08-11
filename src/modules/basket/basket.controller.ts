import { Body, Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common'
import { Public } from '../../decorators/is-public.decorator'
import { BasketDto } from './dtos/basket.dto'
import { CurrentUser } from '../../decorators/current-user.decorator'
import { User } from '../user/user.entity'
import { BasketService } from './basket.service'

@Controller('basket')
export class BasketController {
  @Inject() basketService: BasketService

  @Public()
  @Post()
  basket(@Body() basketDto: BasketDto, @CurrentUser() user: User) {
    return this.basketService.basket(basketDto, user)
  }

  @Public()
  @Post('count')
  basketCount(@Body() basketDto: BasketDto, @CurrentUser() user: User) {
    return this.basketService.basketCount(basketDto, user)
  }

  @Public()
  @Post(':productId')
  updateBasket(
    @Param('productId') productId: number,
    @Body() basketDto: BasketDto,
    @CurrentUser() user: User,
  ) {
    return this.basketService.updateBasket(productId, basketDto, user)
  }

  @Public()
  @Delete(':productId')
  removeFromBasket(@Param('productId') productId: number, @Body() basketDto: BasketDto) {
    return this.basketService.removeFromBasket(productId, basketDto)
  }
}
