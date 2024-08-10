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
import { LocaleEntity } from '../../shared/locale.entity'

@Entity({ name: 'category_i18n' })
export class CategoryI18n extends LocaleEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({ unique: true })
  slug: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date

  //   Relations

  @ManyToOne(() => Category, (category) => category.id, { onDelete: 'CASCADE', nullable: false })
  category: Category
}
