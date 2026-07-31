import { randomUUID } from 'crypto';
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity('TranslationCache')
@Unique(['locale', 'sourceHash'])
export class TranslationCache {
  @PrimaryColumn('text')
  id: string;

  @Column()
  locale: string;

  @Column()
  sourceHash: string;

  @Column('text')
  sourceText: string;

  @Column('text')
  translatedText: string;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @BeforeInsert()
  generateId(): void {
    if (!this.id) this.id = randomUUID();
  }
}
