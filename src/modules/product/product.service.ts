import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProductI18n } from './entities/product-i18n.entity'
import { I18nContext } from 'nestjs-i18n'
import { Locale } from '../../shared/shared.types'
import { ProductTransformer } from './product.transformer'
import { ProductListDto } from './dtos/product-list.dto'
import { ProductQueryDto } from './dtos/product-query.dto'

@Injectable()
export class ProductService {
  @InjectRepository(ProductI18n) productI18nRepository: Repository<ProductI18n>

  @Inject() productTransformer: ProductTransformer

  async products(productListDto: ProductListDto, productQueryDto: ProductQueryDto) {
    const whereQuery = { language: I18nContext.current().lang as Locale }
    const skip = (productQueryDto.page - 1) * productQueryDto.limit

    const products = await this.productI18nRepository.find({
      select: { id: true, name: true, description: true, slug: true, product: { id: true } },
      relations: ['product'],
      where: whereQuery,
      skip,
      take: productQueryDto.limit,
    })

    const productCount = await this.productI18nRepository.count({
      where: whereQuery,
    })

    return {
      products: await this.productTransformer.productsToPublicEntity(products, productListDto),
      totalPage: Math.ceil(productCount / productQueryDto.limit),
    }
  }

  async product(slug: string, productListDto: ProductListDto) {
    const product = await this.productI18nRepository.findOne({
      select: { id: true, name: true, description: true, slug: true, product: { id: true } },
      relations: ['product'],
      where: { slug, language: I18nContext.current().lang as Locale },
    })

    if (!product) {
      throw new NotFoundException({
        error_code: 'product.not_found',
      })
    }

    return {
      product: await this.productTransformer.productToPublicEntity(product, productListDto),
    }
  }
}
