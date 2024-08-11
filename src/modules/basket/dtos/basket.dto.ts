import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { CurrencyDto } from '../../../shared/currency.dto'

export class BasketDto extends CurrencyDto {
  @IsNotEmpty()
  @IsNumber()
  visitorId: number

  @IsOptional()
  @IsNumber()
  quantity?: number
}
