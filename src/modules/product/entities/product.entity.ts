import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Category } from '../../category/category.entity'
import { ProductPricing } from './product-pricing.entity'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Category, (category) => category.id, { onDelete: 'CASCADE' })
  category: Category

  @OneToMany(() => ProductPricing, (productPricing) => productPricing.product)
  productPricing: ProductPricing[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date
}
