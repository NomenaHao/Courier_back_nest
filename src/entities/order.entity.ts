import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Location } from './location.entity';
import { DeliveryAssignment } from './delivery-assignment.entity';

@Entity('orders_order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_type', length: 20, default: 'livraison' })
  orderType: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ length: 20, default: 'created' })
  status: string;

  @Column({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ name: 'estimated_pickup_time', type: 'datetime', nullable: true })
  estimatedPickupTime: Date | null;

  @Column({ name: 'estimated_delivery_time', type: 'datetime', nullable: true })
  estimatedDeliveryTime: Date | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ name: 'client_id' })
  clientId: number;

  @ManyToOne(() => Location, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'pickup_location_id' })
  pickupLocation: Location | null;

  @Column({ name: 'pickup_location_id', nullable: true })
  pickupLocationId: number | null;

  @ManyToOne(() => Location, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'delivery_location_id' })
  deliveryLocation: Location | null;

  @Column({ name: 'delivery_location_id', nullable: true })
  deliveryLocationId: number | null;

  @OneToOne(() => DeliveryAssignment, (a) => a.order)
  assignment: DeliveryAssignment | null;
}
