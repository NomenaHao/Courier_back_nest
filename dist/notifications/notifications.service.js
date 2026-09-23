"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const ws_1 = require("ws");
let NotificationsService = class NotificationsService {
    clients = new Set();
    register(socket, userId, isAdmin) {
        const entry = { socket, userId, isAdmin };
        this.clients.add(entry);
        socket.on('close', () => this.clients.delete(entry));
    }
    send(socket, message) {
        if (socket.readyState === ws_1.WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    }
    notifyUser(userId, message) {
        for (const c of this.clients) {
            if (c.userId === userId)
                this.send(c.socket, message);
        }
    }
    notifyAdmins(message) {
        for (const c of this.clients) {
            if (c.isAdmin)
                this.send(c.socket, message);
        }
    }
    push(group, idOrAll, message) {
        if (group === 'admin') {
            this.notifyAdmins(message);
            return;
        }
        this.notifyUser(idOrAll, message);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)()
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map