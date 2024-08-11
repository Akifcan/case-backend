import { Controller, Get } from '@nestjs/common'
import { Public } from '../../decorators/is-public.decorator'

@Controller('basket')
export class BasketController {
  @Public()
  @Get()
  basket() {
    return 'ok'
  }
}
