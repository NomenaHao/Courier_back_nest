import { Order } from './order.entity';
import { User } from './user.entity';
export declare class DeliveryAssignment {
    id: number;
    status: string;
    assignedAt: Date;
    acceptedAt: Date | null;
    pickedUpAt: Date | null;
    completedAt: Date | null;
    notes: string;
    order: Order;
    orderId: number;
    deliverer: User | null;
    delivererId: number | null;
}
