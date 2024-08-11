import { IsNotEmpty, IsNumber } from 'class-validator'

export class BasketDto {
  @IsNotEmpty()
  @IsNumber()
  visitorId: number
}
