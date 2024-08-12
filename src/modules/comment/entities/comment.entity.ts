import { Product } from '../../../modules/product/entities/product.entity'
import { User } from '../../../modules/user/user.entity'
import { Locale } from '../../../shared/shared.types'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Product, (product) => product.id, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ type: 'enum', enum: Locale })
  locale: Locale

  @Column()
  content: string

  @CreateDateColumn()
  createdAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
