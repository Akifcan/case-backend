import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { ProductI18n } from './product-i18n.entity'
import { ProductImage } from './product-image.entity'
import { ProductPricing } from './product-pricing.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductI18n, ProductImage, ProductPricing])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
