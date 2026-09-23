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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const location_entity_1 = require("./location.entity");
const delivery_assignment_entity_1 = require("./delivery-assignment.entity");
let Order = class Order {
    id;
    orderType;
    description;
    status;
    createdAt;
    updatedAt;
    estimatedPickupTime;
    estimatedDeliveryTime;
    client;
    clientId;
    pickupLocation;
    pickupLocationId;
    deliveryLocation;
    deliveryLocationId;
    assignment;
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_type', length: 20, default: 'livraison' }),
    __metadata("design:type", String)
], Order.prototype, "orderType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Order.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'created' }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_pickup_time', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "estimatedPickupTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_delivery_time', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "estimatedDeliveryTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'client_id' }),
    __metadata("design:type", Number)
], Order.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_entity_1.Location, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'pickup_location_id' }),
    __metadata("design:type", Object)
], Order.prototype, "pickupLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pickup_location_id', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "pickupLocationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_entity_1.Location, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'delivery_location_id' }),
    __metadata("design:type", Object)
], Order.prototype, "deliveryLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_location_id', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "deliveryLocationId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => delivery_assignment_entity_1.DeliveryAssignment, (a) => a.order),
    __metadata("design:type", Object)
], Order.prototype, "assignment", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders_order')
], Order);
//# sourceMappingURL=order.entity.js.map