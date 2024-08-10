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
import { Currency } from '../../../shared/shared.types'

@Entity({ name: 'product_pricing' })
export class ProductPricing {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'decimal' })
  price: number

  @Column({ type: 'decimal', nullable: true })
  discountPrice: number

  @Column({ type: 'enum', enum: Currency })
  currency: Currency

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date

  // Relations

  @ManyToOne(() => Product, (product) => product.id, { onDelete: 'CASCADE', nullable: false })
  product: Product
}
