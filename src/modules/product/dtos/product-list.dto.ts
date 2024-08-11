import { IsIn, IsNotEmpty, IsOptional, Max, MaxLength } from 'class-validator'
import { CurrencyValue } from '../../../shared/shared.types'

export class ProductListDto {
  @IsNotEmpty()
  @IsIn(['tl', 'dollar', 'euro'])
  currency: CurrencyValue

  @IsOptional()
  category?: string

  @IsOptional()
  @MaxLength(100)
  keyword?: string
}
