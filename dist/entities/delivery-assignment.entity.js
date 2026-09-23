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
exports.DeliveryAssignment = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
const user_entity_1 = require("./user.entity");
let DeliveryAssignment = class DeliveryAssignment {
    id;
    status;
    assignedAt;
    acceptedAt;
    pickedUpAt;
    completedAt;
    notes;
    order;
    orderId;
    deliverer;
    delivererId;
};
exports.DeliveryAssignment = DeliveryAssignment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DeliveryAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'assigned' }),
    __metadata("design:type", String)
], DeliveryAssignment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], DeliveryAssignment.prototype, "assignedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'accepted_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], DeliveryAssignment.prototype, "acceptedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'picked_up_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], DeliveryAssignment.prototype, "pickedUpAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], DeliveryAssignment.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], DeliveryAssignment.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => order_entity_1.Order, (order) => order.assignment, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_1.Order)
], DeliveryAssignment.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id' }),
    __metadata("design:type", Number)
], DeliveryAssignment.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'deliverer_id' }),
    __metadata("design:type", Object)
], DeliveryAssignment.prototype, "deliverer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deliverer_id', nullable: true }),
    __metadata("design:type", Object)
], DeliveryAssignment.prototype, "delivererId", void 0);
exports.DeliveryAssignment = DeliveryAssignment = __decorate([
    (0, typeorm_1.Entity)('orders_deliveryassignment')
], DeliveryAssignment);
//# sourceMappingURL=delivery-assignment.entity.js.map