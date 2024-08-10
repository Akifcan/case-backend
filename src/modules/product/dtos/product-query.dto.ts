import { IsNotEmpty, IsNumber, IsNumberString, Min } from 'class-validator'

export class ProductQueryDto {
  @IsNotEmpty()
  @IsNumberString()
  page: number

  @IsNotEmpty()
  @IsNumberString()
  limit: number
}
