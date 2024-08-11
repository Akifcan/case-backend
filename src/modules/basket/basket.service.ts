import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Basket } from './basket.entity'
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm'
import { BasketDto } from './dtos/basket.dto'
import { User } from '../user/user.entity'

@Injectable()
export class BasketService {
  @InjectRepository(Basket) basketRepository: Repository<Basket>

  async addToBasket(productId: number, basketDto: BasketDto, user?: User) {
    const basket = await this.basketRepository.findOne({
      where: !user ? { visitorId: basketDto.visitorId } : { user: { id: user.id } },
    })
    if (!basket) {
    }
  }
}
