import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import { UpdateUserDto } from './dtos/update-user.dto'

@Injectable()
export class UserService {
  @InjectRepository(User) userRepsitory: Repository<User>

  async user(userId: number) {
    const user = await this.userRepsitory.findOneOrFail({
      select: { role: true, name: true, email: true },
      where: { id: userId },
    })
    return { user }
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    return await this.userRepsitory.update({ id: userId }, { name: updateUserDto.name })
  }
}
