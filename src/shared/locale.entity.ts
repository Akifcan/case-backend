import { Column } from 'typeorm'
import { Locale } from './shared.types'

export class LocaleEntity {
  @Column({ enum: Locale, type: 'enum' })
  language: Locale
}
