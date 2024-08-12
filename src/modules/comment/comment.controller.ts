import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Public } from '../../decorators/is-public.decorator'
import { CurrentUser } from '../../decorators/current-user.decorator'
import { User } from '../user/user.entity'
import { CreateCommentDto } from './dtos/create-comment.dto'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { I18nTranslations } from '../../generated/i18n.generated'

@Controller('comment')
export class CommentController {
  @Inject('COMMENT_SERVICE') private client: ClientProxy
  @Inject() i18n: I18nService<I18nTranslations>

  @Public()
  @Get(':productId')
  comments(@Param('productId') productId: number) {
    return this.client.send({ cmd: 'list-comment' }, { productId, locale: I18nContext.current()?.lang })
  }

  @Post(':productId')
  createComment(
    @Param('productId') productId: number,
    @CurrentUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.client.send(
      { cmd: 'create-comment' },
      { productId, userId: user.id, comment: createCommentDto.comment, locale: I18nContext.current()?.lang },
    )
  }
}
