import { IsNotEmpty, IsNumber } from 'class-validator'

export class EmptyBasketDto {
  @IsNotEmpty()
  @IsNumber()
  visitorId: number
}
