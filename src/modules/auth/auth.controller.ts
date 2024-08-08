import { Body, Controller, Inject, Post } from '@nestjs/common'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { AuthService } from './auth.service'
import { Public } from '../../decorators/is-public.decorator'

@Controller('auth')
@Public()
export class AuthController {
  @Inject() authService: AuthService

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }
}
