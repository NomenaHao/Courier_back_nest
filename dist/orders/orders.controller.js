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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const livreur_guard_1 = require("../common/livreur.guard");
const admin_guard_1 = require("../common/admin.guard");
const orders_dto_1 = require("./orders.dto");
let OrdersController = class OrdersController {
    orders;
    constructor(orders) {
        this.orders = orders;
    }
    create(req, dto) {
        return this.orders.createOrder(req.user, dto);
    }
    myOrders(req) {
        return this.orders.myOrders(req.user);
    }
    myDeliveries(req) {
        return this.orders.myDeliveries(req.user);
    }
    adminList(query) {
        return this.orders.adminList(query);
    }
    assign(id, dto) {
        return this.orders.assignDeliverer(id, dto.deliverer_id);
    }
    assignmentAction(id, action, req) {
        return this.orders.assignmentAction(id, action, req.user);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)('create/'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, orders_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my-orders/'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "myOrders", null);
__decorate([
    (0, common_1.Get)('my-deliveries/'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, livreur_guard_1.LivreurGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "myDeliveries", null);
__decorate([
    (0, common_1.Get)('admin/'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "adminList", null);
__decorate([
    (0, common_1.Post)(':id/assign/'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, orders_dto_1.AssignDelivererDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "assign", null);
__decorate([
    (0, common_1.Post)(':id/assignment/:action/'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, livreur_guard_1.LivreurGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('action')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "assignmentAction", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map