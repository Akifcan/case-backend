import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './entities/product.entity'
import { ProductI18n } from './entities/product-i18n.entity'
import { ProductImage } from './entities/product-image.entity'
import { ProductPricing } from './entities/product-pricing.entity'
import { ProductTransformer } from './product.transformer'
import { CategoryI18n } from '../category/category-i18n.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtProps } from '../../config/config.interface'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwt = configService.getOrThrow<JwtProps>('jwt')
        return {
          secret: jwt.secret,
          signOptions: { expiresIn: jwt.expires },
        }
      },
    }),
    TypeOrmModule.forFeature([Product, ProductI18n, ProductImage, ProductPricing, CategoryI18n]),
  ],
  providers: [ProductService, ProductTransformer],
  controllers: [ProductController],
})
export class ProductModule {}
