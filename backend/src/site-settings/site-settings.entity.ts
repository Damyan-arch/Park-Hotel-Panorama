import { randomUUID } from 'crypto';
import { BeforeInsert, Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('SiteSettings')
export class SiteSettings {
  @PrimaryColumn('text')
  id: string;

  @Column()
  phoneNumber: string;

  @Column()
  address: string;

  @Column()
  restaurantHoursDays: string;

  @Column()
  restaurantHoursText: string;

  @UpdateDateColumn({ type: 'timestamp', precision: 3 })
  updatedAt: Date;

  @BeforeInsert()
  generateId(): void {
    if (!this.id) this.id = randomUUID();
  }
}
