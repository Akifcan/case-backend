import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { ProductI18n } from './entities/product-i18n.entity'
import { ProductImage } from './entities/product-image.entity'
import { ProductPricing } from './entities/product-pricing.entity'
import { ProductTransformer } from './product.transformer'

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductI18n, ProductImage, ProductPricing])],
  providers: [ProductService, ProductTransformer],
  controllers: [ProductController],
})
export class ProductModule {}
