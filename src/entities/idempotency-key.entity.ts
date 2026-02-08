import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('idempotency_keys')
export class IdempotencyKey {
  @PrimaryColumn()
  key: string;

  @Column({ type: 'jsonb' })
  response: object;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
