import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders_location')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  address: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  latitude: string | null;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitude: string | null;

  @Column({ type: 'text', default: '' })
  notes: string;

  @Column({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
