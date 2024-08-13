import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Basket } from './basket.entity'
import { FindOptionsWhere, Repository } from 'typeorm'
import { BasketDto } from './dtos/basket.dto'
import { User } from '../user/user.entity'
import { I18nTranslations } from '../../generated/i18n.generated'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { BasketTransformer } from './basket.transformer'
import { Locale } from '../../shared/shared.types'
import { Product } from '../product/entities/product.entity'
import { EmptyBasketDto } from './dtos/empty-basket.dto'

@Injectable()
export class BasketService {
  @InjectRepository(Basket) basketRepository: Repository<Basket>
  @InjectRepository(Product) productRepository: Repository<Product>

  @Inject() i18n: I18nService<I18nTranslations>
  @Inject() basketTransformer: BasketTransformer

  private getQueryForUpdateBasket(
    productId: number,
    basketDto: BasketDto,
    user?: User,
  ): FindOptionsWhere<Basket> {
    return !user
      ? { product: { id: productId }, visitorId: basketDto.visitorId }
      : { product: { id: productId }, user: { id: user.id } }
  }

  private getQueryForListBasket(
    basketDto: BasketDto,
    user?: User,
  ): FindOptionsWhere<Basket> | FindOptionsWhere<Basket>[] {
    return [{ user: { id: user?.id } }, { visitorId: basketDto.visitorId }]
  }

  async updateBasket(productId: number, basketDto: BasketDto, user?: User) {
    const product = await this.productRepository.findOne({ where: { id: productId } })

    if (!product) {
      throw new NotFoundException({
        error_code: 'basket.product_not_found',
      })
    }

    const where = this.getQueryForUpdateBasket(product.id, basketDto, user)

    const basket = await this.basketRepository.findOne({
      where,
    })
    if (!basket) {
      await this.basketRepository.save(
        this.basketRepository.create({
          product: { id: product.id },
          visitorId: !user ? basketDto.visitorId : undefined,
          user: user ? { id: user.id } : undefined,
          quantity: 1,
        }),
      )

      return {
        message: this.i18n.t('basket.added', { lang: I18nContext.current()?.lang }),
      }
    } else {
      const quantity = basketDto?.quantity ?? 1
      await this.basketRepository.update(where, { quantity: (basket.quantity += quantity) })
      return {
        message: this.i18n.t('basket.updated', { lang: I18nContext.current()?.lang }),
      }
    }
  }

  async removeFromBasket(productId: number, basketDto: BasketDto, user?: User) {
    const where = this.getQueryForUpdateBasket(productId, basketDto, user)
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

  async basketCount(basketDto: BasketDto, user?: User) {
    const where = this.getQueryForListBasket(basketDto, user)
    const count = await this.basketRepository.count({ where })
    return {
      totalItem: count,
    }
  }

  async basket(basketDto: BasketDto, user?: User) {
    const where = this.getQueryForListBasket(basketDto, user)

    const list = await this.basketRepository.find({
      select: { id: true, visitorId: true, quantity: true, product: { id: true } },
      where,
      relations: ['product'],
    })

    return this.basketTransformer.basketsToPublicEntity(
      basketDto,
      list,
      I18nContext.current()?.lang as Locale,
    )
  }

  async emptyBasket(emptyBasketDto: EmptyBasketDto, user?: User) {
    const where = user ? { user: { id: user.id } } : { visitorId: emptyBasketDto.visitorId }
    const result = await this.basketRepository.delete(where)
    if (result.affected) {
      return { empty: true, message: this.i18n.t('basket.empty', { lang: I18nContext.current()?.lang }) }
    } else {
      return { empty: false, message: this.i18n.t('basket.error', { lang: I18nContext.current()?.lang }) }
    }
  }
}
