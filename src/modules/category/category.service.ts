import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from './category.entity'
import { Repository } from 'typeorm'
import { CategoryI18n } from './category-i18n.entity'
import { Locale } from 'src/shared/shared.types'

@Injectable()
export class CategoryService {
  @InjectRepository(Category) categoryRepository: Repository<Category>
  @InjectRepository(CategoryI18n) categoryI18nRepository: Repository<CategoryI18n>

  categories() {
    return this.categoryI18nRepository.find({
      select: { name: true, slug: true, category: { id: true } },
      relations: ['category'],
      where: { language: Locale.en },
    })
  }
}
