import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { User } from '../user/user.entity'
import { UserRole } from '../user/user.types'

@Injectable()
export class RoleGuard implements CanActivate {
  @Inject() reflector: Reflector
  @Inject() jwtService: JwtService

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user as User
    if (user.role === UserRole.user) {
      return false
    }
    return true
  }
}
