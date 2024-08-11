import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Basket } from './basket.entity'
import { FindOptionsWhere, Repository } from 'typeorm'
import { BasketDto } from './dtos/basket.dto'
import { User } from '../user/user.entity'
import { I18nTranslations } from '../../generated/i18n.generated'
import { I18nContext, I18nService } from 'nestjs-i18n'

@Injectable()
export class BasketService {
  @InjectRepository(Basket) basketRepository: Repository<Basket>
  @Inject() i18n: I18nService<I18nTranslations>

  private getQuery(productId: number, basketDto: BasketDto, user?: User): FindOptionsWhere<Basket> {
    return !user
      ? { product: { id: productId }, visitorId: basketDto.visitorId }
      : { product: { id: productId }, user: { id: user.id } }
  }

  async addToBasket(productId: number, basketDto: BasketDto, user?: User) {
    const where = this.getQuery(productId, basketDto, user)

    const basket = await this.basketRepository.findOne({
      where,
    })
    if (!basket) {
      await this.basketRepository.save(
        this.basketRepository.create({
          product: { id: productId },
          visitorId: !user ? basketDto.visitorId : undefined,
          user: user ? { id: user.id } : undefined,
          quantity: 1,
        }),
      )

      return {
        message: this.i18n.t('basket.added', { lang: I18nContext.current()?.lang }),
      }
    } else {
      await this.basketRepository.update(where, { quantity: (basket.quantity += 1) })
      return {
        message: this.i18n.t('basket.updated', { lang: I18nContext.current()?.lang }),
      }
    }
  }

  async removeFromBasket(productId: number, basketDto: BasketDto, user?: User) {
    const where = this.getQuery(productId, basketDto, user)
    const result = await this.basketRepository.delete(where)
    if (!result.affected) {
      throw new NotFoundException({
        error_code: 'basket.product_not_found',
      })
    }
    return {
      message: this.i18n.t('basket.removed', { lang: I18nContext.current()?.lang }),
    }
  }
}
