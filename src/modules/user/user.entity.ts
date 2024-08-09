import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserRole } from './user.types'
import * as bcrypt from 'bcrypt'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.user })
  role: UserRole

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date

  // Hooks

  @BeforeInsert()
  async beforeInsert() {
    const saltRounds = 10
    const hash = await bcrypt.hash(this.password, saltRounds)
    this.password = hash
  }
}
