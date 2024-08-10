import { IsIn, IsNotEmpty, IsNumber, IsNumberString, IsOptional } from 'class-validator'
import { CurrencyValue } from '../../../shared/shared.types'

export class ProductListDto {
  @IsNotEmpty()
  @IsIn(['tl', 'dollar', 'euro'])
  currency: CurrencyValue

  @IsOptional()
  @IsNumber()
  category?: number
}
