import { IsOptional, MaxLength } from 'class-validator'
import { CurrencyDto } from '../../../shared/currency.dto'

export class ProductListDto extends CurrencyDto {
  @IsOptional()
  category?: string

  @IsOptional()
  @MaxLength(100)
  keyword?: string
}
