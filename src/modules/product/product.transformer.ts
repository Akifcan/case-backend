import { ProductI18n } from './entities/product-i18n.entity'
import { Product } from './product.entity'

export class ProductTransformer {
  productToPublicEntity(product: ProductI18n) {
    return product
  }

  productsToPublicEntity(products: ProductI18n[]) {
    return products.map((product) => this.productToPublicEntity(product))
  }
}
