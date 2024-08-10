import { Module } from '@nestjs/common'
import { SeedController } from './seed.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../modules/user/user.entity'
import { Category } from '../modules/category/category.entity'
import { CategoryI18n } from '../modules/category/category-i18n.entity'
import { Product } from '../modules/product/entities/product.entity'
import { ProductI18n } from '../modules/product/entities/product-i18n.entity'
import { ProductImage } from '../modules/product/entities/product-image.entity'
import { ProductPricing } from '../modules/product/entities/product-pricing.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Category,
      CategoryI18n,
      Product,
      ProductI18n,
      ProductImage,
      ProductPricing,
    ]),
  ],
  controllers: [SeedController],
})
export class SeedModule {}
