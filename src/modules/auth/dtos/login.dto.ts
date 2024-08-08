import { IsNotEmpty, Matches, MaxLength } from 'class-validator'
import { AUTH_PASSWORD_REGEX } from '../auth.common'

export class LoginDto {
  @IsNotEmpty()
  @MaxLength(50)
  email: string

  @IsNotEmpty()
  @MaxLength(70)
  @Matches(AUTH_PASSWORD_REGEX)
  password: string
}
