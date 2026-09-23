import { OrdersService } from './orders.service';
import { User } from '../entities/user.entity';
import { AssignDelivererDto, CreateOrderDto } from './orders.dto';
export declare class OrdersController {
    private orders;
    constructor(orders: OrdersService);
    create(req: {
        user: User;
    }, dto: CreateOrderDto): Promise<{
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
    }>;
    myOrders(req: {
        user: User;
    }): Promise<{
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
    }[]>;
    myDeliveries(req: {
        user: User;
    }): Promise<{
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
    }[]>;
    adminList(query: Record<string, string | undefined>): Promise<{
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
    }[]>;
    assign(id: number, dto: AssignDelivererDto): Promise<{
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
    }>;
    assignmentAction(id: number, action: string, req: {
        user: User;
    }): Promise<{
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
    }>;
}
