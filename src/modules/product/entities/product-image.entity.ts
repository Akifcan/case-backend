import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Category } from '../../category/category.entity'
import { Product } from './product.entity'

@Entity({ name: 'product_image' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'alt_tag' })
  altTag: string

  @Column()
  src: string

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
