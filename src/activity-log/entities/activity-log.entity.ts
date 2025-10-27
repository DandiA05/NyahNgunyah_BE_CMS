// project.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/user/entities/user.entity';

@Entity('activity_log')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: null,
  })
  user_id: number;
  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column()
  activity: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', select: false })
  deleted_at?: Date;
}
