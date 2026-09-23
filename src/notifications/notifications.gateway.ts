import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  WebSocketGateway,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { WebSocket } from 'ws';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { isAdminUser } from '../common/admin.guard';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({ path: '/ws/notifications' })
export class NotificationsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    private jwtService: JwtService,
    private notifications: NotificationsService,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async handleConnection(client: WebSocket, request: IncomingMessage) {
    try {
      const host = request.headers.host ?? 'localhost';
      const url = new URL(request.url ?? '', `http://${host}`);
      const token = url.searchParams.get('token');
      if (!token) {
        client.close(4401);
        return;
      }

      let userId: number;
      try {
        const payload = this.jwtService.verify<{ sub?: number; user_id?: number }>(
          token,
        );
        userId = payload.user_id ?? payload.sub!;
      } catch {
        client.close(4401);
        return;
      }

      const user = await this.users.findOne({ where: { id: userId } });
      if (!user || !user.isActive) {
        client.close(4401);
        return;
      }

      this.notifications.register(client, user.id, isAdminUser(user));
      this.logger.log(`WebSocket connected user ${user.id}`);
    } catch (e) {
      this.logger.error(e);
      client.close(4500);
    }
  }
}
