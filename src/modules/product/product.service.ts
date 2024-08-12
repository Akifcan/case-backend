import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, ILike, Repository } from 'typeorm'
import { ProductI18n } from './entities/product-i18n.entity'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { Locale } from '../../shared/shared.types'
import { ProductTransformer } from './product.transformer'
import { ProductListDto } from './dtos/product-list.dto'
import { ProductQueryDto } from './dtos/product-query.dto'
import { CategoryI18n } from '../category/category-i18n.entity'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { Product } from './entities/product.entity'
import { I18nTranslations } from '../../generated/i18n.generated'
@Injectable()
export class ProductService {
  @InjectRepository(Product) productRepository: Repository<Product>
  @InjectRepository(ProductI18n) productI18nRepository: Repository<ProductI18n>
  @InjectRepository(CategoryI18n) categoryI18nRepository: Repository<CategoryI18n>

  @Inject() i18n: I18nService<I18nTranslations>
  @Inject() productTransformer: ProductTransformer
  @Inject(CACHE_MANAGER) cacheManager: Cache

  private async useCache<T>(cacheKey: string) {
    const cache = await this.cacheManager.get<any>(cacheKey)

    if (cache) {
      Logger.log('from redis', 'REDIS')
      return JSON.parse(cache) as T
    }
  }

  async products(productListDto: ProductListDto, productQueryDto: ProductQueryDto, cacheKey: string) {
    await this.useCache(cacheKey)

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
      select: { id: true, name: true, description: true, slug: true, product: { id: true }, createdAt: true },
      relations: ['product'],
      where: whereQuery,
      skip,
      take: productQueryDto.limit,
      order: { createdAt: 'DESC' },
    })

    const productCount = await this.productI18nRepository.count({
      where: whereQuery,
    })

    const response = {
      products: await this.productTransformer.productsToPublicEntity(products, productListDto),
      totalPage: Math.ceil(productCount / productQueryDto.limit),
    }
    this.cacheManager.set(cacheKey, JSON.stringify(response), 10)
    return response
  }

  async product(slug: string, productListDto: ProductListDto, cacheKey: string) {
    await this.useCache(cacheKey)

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
    const response = {
      product: await this.productTransformer.productToPublicEntity(product, productListDto),
    }
    this.cacheManager.set(cacheKey, JSON.stringify(response), 10)
    return response
  }

  private async getCategoryId(categorySlug: string): Promise<number | undefined> {
    const category = await this.categoryI18nRepository.findOne({
      select: { category: { id: true } },
      where: { slug: categorySlug },
      relations: ['category'],
    })
    return category?.category?.id
  }

  async toggleRemoveProduct(productId: number) {
    const product = await this.productI18nRepository.findOne({
      withDeleted: true,
      where: { product: { id: productId } },
    })
    if (product?.deletedAt) {
      await this.productI18nRepository.update({ product: { id: productId } }, { deletedAt: null })
      return {
        message: this.i18n.t('product.admin.activated', { lang: I18nContext.current()?.lang }),
      }
    }
    await this.productI18nRepository.softDelete({ product: { id: productId } })
    return {
      message: this.i18n.t('product.admin.removed', { lang: I18nContext.current()?.lang }),
    }
  }
}
