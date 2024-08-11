import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, ILike, Repository } from 'typeorm'
import { ProductI18n } from './entities/product-i18n.entity'
import { I18nContext } from 'nestjs-i18n'
import { Locale } from '../../shared/shared.types'
import { ProductTransformer } from './product.transformer'
import { ProductListDto } from './dtos/product-list.dto'
import { ProductQueryDto } from './dtos/product-query.dto'
import { CategoryI18n } from '../category/category-i18n.entity'

@Injectable()
export class ProductService {
  @InjectRepository(ProductI18n) productI18nRepository: Repository<ProductI18n>
  @InjectRepository(CategoryI18n) categoryI18nRepository: Repository<CategoryI18n>

  @Inject() productTransformer: ProductTransformer

  async products(productListDto: ProductListDto, productQueryDto: ProductQueryDto) {
    let categoryId: number | undefined = undefined

    if (productListDto.category) {
      categoryId = await this.getCategoryId(productListDto.category)
    }

    const whereQuery: FindOptionsWhere<ProductI18n> = {
      language: I18nContext.current()?.lang as Locale,
      name: productListDto.keyword ? ILike(`%${productListDto.keyword}%`) : undefined,
      product: { category: { id: categoryId ?? undefined } },
    }
    const skip: number = (productQueryDto.page - 1) * productQueryDto.limit

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
      where: { slug, language: I18nContext.current()?.lang as Locale },
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

  private async getCategoryId(categorySlug: string): Promise<number | undefined> {
    const category = await this.categoryI18nRepository.findOne({
      select: { category: { id: true } },
      where: { slug: categorySlug },
      relations: ['category'],
    })
    return category?.category?.id
  }
}
