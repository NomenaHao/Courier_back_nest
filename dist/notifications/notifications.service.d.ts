import { WebSocket } from 'ws';
export type NotificationPayload = {
    title: string;
    body: string;
    order_id: number;
    order_type: string;
};
export declare class NotificationsService {
    private clients;
    register(socket: WebSocket, userId: number, isAdmin: boolean): void;
    private send;
    notifyUser(userId: number, message: NotificationPayload): void;
    notifyAdmins(message: NotificationPayload): void;
    push(group: 'user' | 'admin', idOrAll: number | 'all', message: NotificationPayload): void;
}
