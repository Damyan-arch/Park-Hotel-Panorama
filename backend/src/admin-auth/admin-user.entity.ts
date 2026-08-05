import { randomUUID } from 'crypto';
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('AdminUser')
export class AdminUser {
  @PrimaryColumn('text')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @BeforeInsert()
  generateId(): void {
    if (!this.id) this.id = randomUUID();
  }
}
