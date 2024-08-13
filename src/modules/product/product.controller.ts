import {
  Body,
  Controller,
  Delete,
  Headers,
  Inject,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductListDto } from './dtos/product-list.dto'
import { Public } from '../../decorators/is-public.decorator'
import { ProductQueryDto } from './dtos/product-query.dto'
import { RoleGuard } from '../auth/role.guard'

@Controller('product')
export class ProductController {
  @Inject() productService: ProductService

  @Public()
  @Post()
  products(
    @Body() productListDto: ProductListDto,
    @Query() productQueryDto: ProductQueryDto,
    @Req() req: Request,
  ) {
    const cacheKey = req.url + JSON.stringify(productListDto) + JSON.stringify(productQueryDto).toString()
    Logger.log(cacheKey, 'cache key')
    return this.productService.products(productListDto, productQueryDto, cacheKey)
  }

  @Public()
  @Post(':slug')
  product(@Body() productListDto: ProductListDto, @Param('slug') slug: string, @Req() req: Request) {
    const cacheKey = req.url + JSON.stringify(productListDto) + slug.toString()

    return this.productService.product(slug, productListDto, cacheKey)
  }

  @Public()
  @Post(':slug/meta')
  productMeta(@Param('slug') slug: string) {
    return this.productService.productMeta(slug)
  }

  @UseGuards(RoleGuard)
  @Delete(':productId')
  deleteProduct(@Param('productId') productId: number) {
    console.log('ok')
    return this.productService.toggleRemoveProduct(productId)
  }
}
