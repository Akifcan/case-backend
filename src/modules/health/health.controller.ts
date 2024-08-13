import { Controller, Get, Inject } from '@nestjs/common'
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus'
import { Public } from '../../decorators/is-public.decorator'
import { ConfigService } from '@nestjs/config'
import { AppConfig } from '../../config/config.interface'

@Public()
@Controller('health')
export class HealthController {
  @Inject() health: HealthCheckService
  @Inject() http: HttpHealthIndicator
  @Inject() configService: ConfigService

  @Get()
  service() {
    return { status: 'up' }
  }

  @Get('check')
  @HealthCheck()
  check() {
    const appConfig = this.configService.get<AppConfig>('app')
    return this.health.check([() => this.http.pingCheck('case', appConfig.healthcheckUri)])
  }
}
