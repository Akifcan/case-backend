import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import { UpdateUserDto } from './dtos/update-user.dto'
import { I18nService } from 'nestjs-i18n'
import { I18nTranslations } from '../../generated/i18n.generated'

@Injectable()
export class UserService {
  @InjectRepository(User) userRepsitory: Repository<User>
  @Inject() i18n: I18nService<I18nTranslations>

  async user(userId: number) {
    const user = await this.userRepsitory.findOneOrFail({
      select: { role: true, name: true, email: true },
      where: { id: userId },
    })
    return { user }
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto) {
    const currentUser = await this.userRepsitory.findOneOrFail({
      select: { name: true },
      where: { id: user.id },
    })

    if (currentUser.name === updateUserDto.name) {
      return { message: this.i18n.t('user.sameRecord') }
    }

    const result = await this.userRepsitory.update({ id: user.id }, { name: updateUserDto.name })
    if (!result.affected) {
      throw new NotFoundException({
        error_code: 'user.not_found',
      })
    }
    return {
      message: this.i18n.t('user.updated'),
    }
  }
}
