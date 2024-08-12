import { Module } from '@nestjs/common'
import { CommentController } from './comment.controller'
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { CommentServiceConfig } from '../../config/config.interface'

@Module({
  controllers: [CommentController],
  providers: [
    {
      provide: 'COMMENT_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<CommentServiceConfig>('commentService')
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: config.host,
            port: config.port,
          },
        })
      },
    },
  ],
})
export class CommentModule {}
