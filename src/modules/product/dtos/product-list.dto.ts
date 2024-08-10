import { IsIn, IsNotEmpty } from 'class-validator'
import { CurrencyValue } from '../../../shared/shared.types'

export class ProductListDto {
  @IsNotEmpty()
  @IsIn(['tl', 'dollar', 'euro'])
  currency: CurrencyValue
}
