import { IsNotEmpty, IsNumber, IsObject, IsOptional } from 'class-validator'

export class BasketDto {
  @IsNotEmpty()
  @IsNumber()
  visitorId: number

  @IsOptional()
  @IsNumber()
  quantity?: number
}
