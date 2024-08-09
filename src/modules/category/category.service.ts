import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from './category.entity'
import { Repository } from 'typeorm'
import { CategoryI18n } from './category-i18n.entity'
import { Locale } from 'src/shared/shared.types'
import { I18nTranslations } from '../../generated/i18n.generated'
import { I18nContext, I18nService } from 'nestjs-i18n'

@Injectable()
export class CategoryService {
  @InjectRepository(Category) categoryRepository: Repository<Category>
  @InjectRepository(CategoryI18n) categoryI18nRepository: Repository<CategoryI18n>
  @Inject() i18n: I18nService<I18nTranslations>

  categories() {
    return this.categoryI18nRepository.find({
      select: { name: true, slug: true, category: { id: true } },
      relations: ['category'],
      where: { language: I18nContext.current().lang as Locale },
    })
  }
}
