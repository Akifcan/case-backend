import { IsNotEmpty, Matches, MaxLength } from 'class-validator'
import { AUTH_PASSWORD_REGEX } from '../../../shared/shared.regex'

export class RegisterDto {
  @IsNotEmpty()
  @MaxLength(50)
  name: string

  @IsNotEmpty()
  @MaxLength(50)
  email: string

  @IsNotEmpty()
  @MaxLength(70)
  @Matches(AUTH_PASSWORD_REGEX)
  password: string
}
