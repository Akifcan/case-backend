import { Controller, Get, Inject } from '@nestjs/common'
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus'
import { Public } from '../../decorators/is-public.decorator'

@Public()
@Controller('health')
export class HealthController {
  @Inject() health: HealthCheckService
  @Inject() http: HttpHealthIndicator

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com')])
  }
}
