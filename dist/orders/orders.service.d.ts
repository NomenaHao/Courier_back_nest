import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Location } from '../entities/location.entity';
import { DeliveryAssignment } from '../entities/delivery-assignment.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto } from './orders.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class OrdersService {
    private orders;
    private locations;
    private assignments;
    private users;
    private notifications;
    constructor(orders: Repository<Order>, locations: Repository<Location>, assignments: Repository<DeliveryAssignment>, users: Repository<User>, notifications: NotificationsService);
    private orderRelations;
    private loadOrder;
    private notify;
    private createLocation;
    createOrder(client: User, dto: CreateOrderDto): Promise<{
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
    myOrders(client: User): Promise<{
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
    myDeliveries(livreur: User): Promise<{
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
    assignDeliverer(orderId: number, delivererId: number): Promise<{
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
    assignmentAction(orderId: number, action: string, livreur: User): Promise<{
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
