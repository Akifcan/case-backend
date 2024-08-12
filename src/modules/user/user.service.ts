import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'

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
}
