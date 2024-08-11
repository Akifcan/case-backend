import { IsIn, IsNotEmpty } from 'class-validator'
import { CurrencyValue } from './shared.types'

export class CurrencyDto {
  @IsNotEmpty()
  @IsIn(['tl', 'dollar', 'euro'])
  currency: CurrencyValue
}
