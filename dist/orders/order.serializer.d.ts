import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
export declare function serializeOrder(order: Order): {
    id: number;
    order_type: string;
    pickup_location: {
        address: string;
        latitude: number | null;
        longitude: number | null;
        notes: string;
    } | null;
    delivery_location: {
        address: string;
        latitude: number | null;
        longitude: number | null;
        notes: string;
    } | null;
    description: string;
    status: string;
    client: {
        id: number;
        username: string;
        phone: string;
    } | null;
    assignment: {
        id: number;
        status: string;
        deliverer: {
            id: number;
            username: string;
            phone: string;
        } | null;
        assigned_at: string;
        accepted_at: string | Date | null;
        picked_up_at: string | Date | null;
        completed_at: string | Date | null;
        notes: string;
    } | null;
    created_at: string;
    updated_at: string;
};
export declare function serializeUser(user: User): {
    id: number;
    username: string;
    phone: string;
    email: string;
    role: string;
};
