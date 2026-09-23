declare class LocationDto {
    address?: string;
    latitude?: number | null;
    longitude?: number | null;
    notes?: string;
}
export declare class CreateOrderDto {
    order_type: string;
    pickup_location?: LocationDto | null;
    delivery_location?: LocationDto | null;
    description?: string;
    deliverer_id?: number;
}
export declare class AssignDelivererDto {
    deliverer_id: number;
}
export {};
