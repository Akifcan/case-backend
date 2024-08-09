import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Category } from './category.entity'
import { Locale } from '../../shared/shared.types'

@Entity({ name: 'category_i18n' })
export class CategoryI18n {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({ unique: true })
  slug: string

  @Column({ enum: Locale, type: 'enum' })
  language: Locale

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date

  //   Relations

  @ManyToOne(() => Category, (category) => category.id, { onDelete: 'CASCADE' })
  category: Category
}
