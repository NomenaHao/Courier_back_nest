import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection } from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { WebSocket } from 'ws';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { NotificationsService } from './notifications.service';
export declare class NotificationsGateway implements OnGatewayConnection {
    private jwtService;
    private notifications;
    private users;
    private readonly logger;
    constructor(jwtService: JwtService, notifications: NotificationsService, users: Repository<User>);
    handleConnection(client: WebSocket, request: IncomingMessage): Promise<void>;
}
