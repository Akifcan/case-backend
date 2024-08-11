import { Module } from '@nestjs/common'
import { BasketService } from './basket.service'
import { BasketController } from './basket.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Basket } from './basket.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Basket])],
  providers: [BasketService],
  controllers: [BasketController],
})
export class BasketModule {}
