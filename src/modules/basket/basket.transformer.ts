import { Injectable } from '@nestjs/common'
import { Basket } from './basket.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductI18n } from '../product/entities/product-i18n.entity'
import { Repository } from 'typeorm'
import { Currency, Locale, currencySymbols } from '../../shared/shared.types'
import { ProductImage } from '../product/entities/product-image.entity'
import { ProductPricing } from '../product/entities/product-pricing.entity'
import { BasketDto } from './dtos/basket.dto'
import { priceLabel } from '../../shared/shared.function'

@Injectable()
export class BasketTransformer {
  @InjectRepository(ProductI18n) productI18nRepository: Repository<ProductI18n>
  @InjectRepository(ProductImage) productImageRepository: Repository<ProductImage>
  @InjectRepository(ProductPricing) productPriceRepository: Repository<ProductPricing>

  async basketToPublicEntity(basketDto: BasketDto, basket: Basket, locale: Locale) {
    const currency = basketDto.currency as Currency

    const product = await this.productI18nRepository.findOne({
      select: { id: true, name: true, slug: true },
      where: { language: locale, product: { id: basket.product.id } },
    })

    const image = await this.productImageRepository.findOne({
      select: { id: true, altTag: true, src: true },
      where: { product: { id: basket.product.id } },
    })

    const pricing = await this.productPriceRepository.findOne({
      select: { id: true, price: true, discountPrice: true },
      where: { currency, product: { id: basket.product.id } },
    })

    const unitPrice = pricing?.discountPrice ?? pricing.price
    const totalPrice = Number(unitPrice) * Number(basket.quantity)
    return {
      product,
      basket,
      image,
      pricing: {
        unitPrice,
        totalPrice,
        price: pricing.price,
        discountPrice: pricing?.discountPrice,
        labels: {
          totalPrice: priceLabel(totalPrice, currency),
          unitPrice: priceLabel(unitPrice, currency),
        },
      },
    }
  }

  async basketsToPublicEntity(basketDto: BasketDto, baskets: Basket[], locale: Locale) {
    const basket = await Promise.all(
      baskets.map(async (basket) => await this.basketToPublicEntity(basketDto, basket, locale)),
    )
    const totalPrice = basket.reduce((total, current) => (total += current.pricing.totalPrice), 0)
    return {
      basket,
      pricing: {
        totalPrice,
        label: priceLabel(totalPrice, basketDto.currency),
      },
    }
  }
}
