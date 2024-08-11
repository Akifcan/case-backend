import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject() reflector: Reflector
  @Inject() jwtService: JwtService

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ])

    // if (isPublic) {
    //   return true
    // }

    const request = context.switchToHttp().getRequest()

    try {
      const headers = request.headers
      const authorization = headers.authorization
      if (!authorization && !isPublic) {
        return false
      }
      if (authorization) {
        const accessToken = authorization.split(' ')[1]
        const user = this.jwtService.verify(accessToken)
        request.user = user.user
        return true
      }
      if (isPublic) {
        return true
      }
    } catch (e) {
      if (isPublic) {
        return true
      }
      throw new UnauthorizedException({
        message: e.message,
        errorCode: e.name,
      })
    }
  }
}
