import { IsNotEmpty, MaxLength } from 'class-validator'

export class UpdateUserDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string
}
