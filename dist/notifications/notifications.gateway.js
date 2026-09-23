"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const admin_guard_1 = require("../common/admin.guard");
const notifications_service_1 = require("./notifications.service");
let NotificationsGateway = NotificationsGateway_1 = class NotificationsGateway {
    jwtService;
    notifications;
    users;
    logger = new common_1.Logger(NotificationsGateway_1.name);
    constructor(jwtService, notifications, users) {
        this.jwtService = jwtService;
        this.notifications = notifications;
        this.users = users;
    }
    async handleConnection(client, request) {
        try {
            const host = request.headers.host ?? 'localhost';
            const url = new URL(request.url ?? '', `http://${host}`);
            const token = url.searchParams.get('token');
            if (!token) {
                client.close(4401);
                return;
            }
            let userId;
            try {
                const payload = this.jwtService.verify(token);
                userId = payload.user_id ?? payload.sub;
            }
            catch {
                client.close(4401);
                return;
            }
            const user = await this.users.findOne({ where: { id: userId } });
            if (!user || !user.isActive) {
                client.close(4401);
                return;
            }
            this.notifications.register(client, user.id, (0, admin_guard_1.isAdminUser)(user));
            this.logger.log(`WebSocket connected user ${user.id}`);
        }
        catch (e) {
            this.logger.error(e);
            client.close(4500);
        }
    }
};
exports.NotificationsGateway = NotificationsGateway;
exports.NotificationsGateway = NotificationsGateway = NotificationsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ path: '/ws/notifications' }),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        notifications_service_1.NotificationsService,
        typeorm_2.Repository])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map