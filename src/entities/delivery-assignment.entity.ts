import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';

@Entity('orders_deliveryassignment')
export class DeliveryAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, default: 'assigned' })
  status: string;

  @Column({ name: 'assigned_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;

  @Column({ name: 'accepted_at', type: 'datetime', nullable: true })
  acceptedAt: Date | null;

  @Column({ name: 'picked_up_at', type: 'datetime', nullable: true })
  pickedUpAt: Date | null;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt: Date | null;

  @Column({ type: 'text', default: '' })
  notes: string;

  @OneToOne(() => Order, (order) => order.assignment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  orderId: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'deliverer_id' })
  deliverer: User | null;

  @Column({ name: 'deliverer_id', nullable: true })
  delivererId: number | null;
}
