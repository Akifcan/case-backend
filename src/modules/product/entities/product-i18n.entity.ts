import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Product } from './product.entity'
import { LocaleEntity } from '../../../shared/locale.entity'

@Entity({ name: 'product_i18n' })
export class ProductI18n extends LocaleEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  slug: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date

  //   Relations

  @ManyToOne(() => Product, (product) => product.id, { onDelete: 'CASCADE', nullable: false })
  product: Product
}
