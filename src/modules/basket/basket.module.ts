import { Module } from '@nestjs/common'
import { BasketService } from './basket.service'
import { BasketController } from './basket.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Basket } from './basket.entity'
import { BasketTransformer } from './basket.transformer'
import { ProductI18n } from '../product/entities/product-i18n.entity'
import { ProductImage } from '../product/entities/product-image.entity'
import { ProductPricing } from '../product/entities/product-pricing.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Basket, ProductI18n, ProductImage, ProductPricing])],
  providers: [BasketService, BasketTransformer],
  controllers: [BasketController],
})
export class BasketModule {}
