import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { AppModule } from '../../app.module'

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should list the current user information from user id', async () => {
    const user = await service.userRepsitory.findOne({
      where: { email: 'akifcannnn@icloud.com' },
    })

    const currentUser = await service.user(user.id)
    expect(currentUser).toHaveProperty('user')
    const x = currentUser.user
    expect(x).toHaveProperty('name')
    expect(x).toHaveProperty('email')
    expect(x).toHaveProperty('role')
  })

  it('should update the current user information', async () => {
    const user = await service.userRepsitory.findOne({
      where: { email: 'akifcannnn@icloud.com' },
    })

    const update = await service.updateUser(user, { name: 'test-update' })
    expect(update).toHaveProperty('message')
    await service.userRepsitory.update({ id: user.id }, { name: 'akifcan' })
  })

  it('should throw the error if user not exists', async () => {
    try {
      await service.updateUser({ id: 999 } as any, { name: 'test-update' })
      expect(true).toBe(false)
    } catch (e) {
      expect(e.response).toHaveProperty('error_code')
    }
  })
})
