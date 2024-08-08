import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../user/user.entity'
import { Repository } from 'typeorm'
import { RegisterDto } from './dtos/register.dto'
import { LoginDto } from './dtos/login.dto'

@Injectable()
export class AuthService {
  @InjectRepository(User) userRepository: Repository<User>

  register(registerDto: RegisterDto) {}

  login(loginDto: LoginDto) {}
}
