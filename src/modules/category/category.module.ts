import { Module } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from './category.entity'
import { CategoryI18n } from './category-i18n.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryI18n])],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
