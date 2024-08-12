import { Module } from '@nestjs/common'
import { CommentController } from './comment.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      { name: 'COMMENT_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3002 } },
    ]),
  ],
  controllers: [CommentController],
})
export class CommentModule {}
