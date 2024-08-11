import { InjectRepository } from '@nestjs/typeorm'
import { ProductListDto } from './dtos/product-list.dto'
import { ProductI18n } from './entities/product-i18n.entity'
import { ProductPricing } from './entities/product-pricing.entity'
import { Repository } from 'typeorm'
import { Currency, currencySymbols } from '../../shared/shared.types'
import { ProductImage } from './entities/product-image.entity'
import { priceLabel } from '../../shared/shared.function'

export class ProductTransformer {
  @InjectRepository(ProductPricing) productPricingRepository: Repository<ProductPricing>
  @InjectRepository(ProductImage) productImageRepository: Repository<ProductImage>

  async productToPublicEntity(product: ProductI18n, productListDto: ProductListDto) {
    const pricing = await this.productPricingRepository.findOne({
      select: { id: true, price: true, discountPrice: true, currency: true },
      where: { product: { id: product.product.id }, currency: productListDto.currency as Currency },
    })
    const images = await this.productImageRepository.find({
      relations: ['product'],
      select: { altTag: true, src: true },
      where: { product: { id: product.product.id } },
    })
    return {
      ...product,
      ...pricing,
      pricingLabels: {
        discountPrice: pricing.discountPrice
          ? priceLabel(pricing.discountPrice, productListDto.currency)
          : undefined,
        price: priceLabel(pricing.price, productListDto.currency),
      },
      images,
    }
  }

  async productsToPublicEntity(products: ProductI18n[], productListDto: ProductListDto) {
    return await Promise.all(
      products.map(async (product) => await this.productToPublicEntity(product, productListDto)),
    )
  }
}
