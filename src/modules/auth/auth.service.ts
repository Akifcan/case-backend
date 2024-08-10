import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../user/user.entity'
import { Repository } from 'typeorm'
import { RegisterDto } from './dtos/register.dto'
import { LoginDto } from './dtos/login.dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { I18nTranslations } from '../../generated/i18n.generated'

@Injectable()
export class AuthService {
  @InjectRepository(User) userRepository: Repository<User>
  @Inject() jwtService: JwtService
  @Inject() i18n: I18nService<I18nTranslations>

  private async isEmailExists(email: string) {
    const count = await this.userRepository.count({ where: { email } })
    return count
  }

  async register(registerDto: RegisterDto) {
    const isEmailExists = await this.isEmailExists(registerDto.email)

    if (isEmailExists) {
      throw new UnauthorizedException({
        message: this.i18n.t('auth.userExists', { lang: I18nContext.current()?.lang }),
        error_code: 'auth.already_exists',
      })
    }

    const user = await this.userRepository.save(
      this.userRepository.create({
        email: registerDto.email,
        name: registerDto.name,
        password: registerDto.password,
      }),
    )

    delete user.password
    delete user.createdAt
    delete user.deletedAt
    delete user.updatedAt

    const accessToken = this.jwtService.sign({ user })

    return { user, accessToken }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      select: { id: true, email: true, password: true, name: true, role: true },
      where: { email: loginDto.email },
    })

    if (!user) {
      throw new UnauthorizedException({
        message: this.i18n.t('auth.userNotFound', { lang: I18nContext.current()?.lang }),
        error_code: 'auth.not_found',
      })
    }

    const compare = bcrypt.compareSync(loginDto.password, user.password)

    if (!compare) {
      throw new UnauthorizedException({
        message: this.i18n.t('auth.userNotFound', { lang: I18nContext.current()?.lang }),
        error_code: 'auth.not_found',
      })
    }

    delete user.password

    const accessToken = this.jwtService.sign({ user })

    return { user, accessToken }
  }
}
