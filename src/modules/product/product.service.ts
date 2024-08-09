import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { Repository } from 'typeorm'
import { ProductI18n } from './entities/product-i18n.entity'
import { I18nContext } from 'nestjs-i18n'
import { Locale } from '../../shared/shared.types'
import { ProductTransformer } from './product.transformer'

@Injectable()
export class ProductService {
  @InjectRepository(Product) productRepository: Repository<Product>
  @InjectRepository(ProductI18n) productI18nRepository: Repository<ProductI18n>

  @Inject() productTransformer: ProductTransformer

  async products() {
    const products = await this.productI18nRepository.find({
      relations: ['product'],
      where: { language: I18nContext.current().lang as Locale },
    })
    return this.productTransformer.productsToPublicEntity(products)
  }
}
