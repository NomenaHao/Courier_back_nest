import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';

export type NotificationPayload = {
  title: string;
  body: string;
  order_id: number;
  order_type: string;
};

type ClientEntry = { socket: WebSocket; userId: number; isAdmin: boolean };

@Injectable()
export class NotificationsService {
  private clients = new Set<ClientEntry>();

  register(socket: WebSocket, userId: number, isAdmin: boolean) {
    const entry: ClientEntry = { socket, userId, isAdmin };
    this.clients.add(entry);
    socket.on('close', () => this.clients.delete(entry));
  }

  private send(socket: WebSocket, message: NotificationPayload) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }

  notifyUser(userId: number, message: NotificationPayload) {
    for (const c of this.clients) {
      if (c.userId === userId) this.send(c.socket, message);
    }
  }

  notifyAdmins(message: NotificationPayload) {
    for (const c of this.clients) {
      if (c.isAdmin) this.send(c.socket, message);
    }
  }

  push(group: 'user' | 'admin', idOrAll: number | 'all', message: NotificationPayload) {
    if (group === 'admin') {
      this.notifyAdmins(message);
      return;
    }
    this.notifyUser(idOrAll as number, message);
  }
}
