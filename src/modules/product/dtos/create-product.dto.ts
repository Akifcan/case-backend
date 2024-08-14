import { IsArray, IsNotEmpty } from 'class-validator'
import { Currency, Locale } from '../../../shared/shared.types'

export class CreateProductDto {
  @IsNotEmpty()
  categoryId: number

  @IsNotEmpty()
  @IsArray()
  images: { altTag: string; src: string }[]

  @IsNotEmpty()
  @IsArray()
  pricing: { currency: Currency; price: number; discountPrice?: number }[]

  @IsNotEmpty()
  @IsArray()
  info: { name: string; description: string; slug: string; language: Locale }[]
}
