import { Body, Controller, Headers, Inject, Param, Post, Query } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductListDto } from './dtos/product-list.dto'
import { Public } from '../../decorators/is-public.decorator'
import { ProductQueryDto } from './dtos/product-query.dto'

@Controller('product')
export class ProductController {
  @Inject() productService: ProductService

  @Public()
  @Post()
  products(@Body() productListDto: ProductListDto, @Query() productQueryDto: ProductQueryDto) {
    return this.productService.products(productListDto, productQueryDto)
  }

  @Public()
  @Post(':slug')
  product(@Body() productListDto: ProductListDto, @Param('slug') slug: string) {
    return this.productService.product(slug, productListDto)
  }
}
