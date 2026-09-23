import { User } from './user.entity';
import { Location } from './location.entity';
import { DeliveryAssignment } from './delivery-assignment.entity';
export declare class Order {
    id: number;
    orderType: string;
    description: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    estimatedPickupTime: Date | null;
    estimatedDeliveryTime: Date | null;
    client: User;
    clientId: number;
    pickupLocation: Location | null;
    pickupLocationId: number | null;
    deliveryLocation: Location | null;
    deliveryLocationId: number | null;
    assignment: DeliveryAssignment | null;
}
