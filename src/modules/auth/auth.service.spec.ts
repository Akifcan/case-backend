import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { AppModule } from '../../app.module'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should be get access token if user credentials correct', async () => {
    const userObj: RegisterDto = {
      email: 'usertest@case.com',
      name: 'test user',
      password: 'testuserpassword',
    }

    const user = await service.userRepository.save(service.userRepository.create(userObj))

    const result = await service.login({ email: user.email, password: userObj.password })
    expect(result).toHaveProperty('user')
    expect(result).toHaveProperty('accessToken')

    const userResult = result.user

    expect(userResult).toHaveProperty('id')
    expect(userResult).toHaveProperty('name')
    expect(userResult).toHaveProperty('email')
    expect(userResult).toHaveProperty('role')

    await service.userRepository.delete({ id: user.id })
  })

  it('should throw an error if user credientials are wrong', async () => {
    const userObj: LoginDto = {
      email: 'usertestnotexists@case.com',
      password: 'testuserpassword',
    }

    try {
      await service.login(userObj)
      expect(true).toBe(false)
    } catch (e) {
      expect(e.response.error_code).toBe('auth.not_found')
    }
  })

  it('should register successfully if given email is unique', async () => {
    const userObj: RegisterDto = {
      email: 'usertest@case.com',
      name: 'test user',
      password: 'testuserpassword',
    }

    const result = await service.register(userObj)
    expect(result).toHaveProperty('user')
    expect(result).toHaveProperty('accessToken')

    const userResult = result.user

    expect(userResult).toHaveProperty('id')
    expect(userResult).toHaveProperty('name')
    expect(userResult).toHaveProperty('email')
    expect(userResult).toHaveProperty('role')
    await service.userRepository.delete({ id: result.user.id })
  })

  it('should throw an error if given email is already registered', async () => {
    const existingUserEmail: RegisterDto = {
      email: 'existing@case.com',
      name: 'test user',
      password: 'testuserpassword',
    }

    const newUserObj: RegisterDto = {
      email: 'existing@case.com',
      name: 'test user',
      password: 'testuserpassword',
    }

    const existsUser = await service.userRepository.save(service.userRepository.create(existingUserEmail))

    try {
      await service.register(newUserObj)
      expect(true).toBe(false)
    } catch (e) {
      expect(e.response.error_code).toBe('auth.already_exists')
    } finally {
      await Promise.all([service.userRepository.delete({ id: existsUser.id })])
    }
  })
})
