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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const location_entity_1 = require("../entities/location.entity");
const delivery_assignment_entity_1 = require("../entities/delivery-assignment.entity");
const user_entity_1 = require("../entities/user.entity");
const order_serializer_1 = require("./order.serializer");
const notifications_service_1 = require("../notifications/notifications.service");
const ASSIGNMENT_TRANSITIONS = {
    accept: {
        from: new Set(['assigned']),
        assignmentStatus: 'accepted',
        orderStatus: 'in_transit',
        setAcceptedAt: true,
    },
    en_route: {
        from: new Set(['accepted']),
        assignmentStatus: 'en_route',
        orderStatus: 'in_transit',
        setPickedUpAt: true,
    },
    complete: {
        from: new Set(['accepted', 'en_route']),
        assignmentStatus: 'completed',
        orderStatus: 'delivered',
        setCompletedAt: true,
    },
    cancel: {
        from: new Set(['assigned', 'accepted', 'en_route']),
        assignmentStatus: 'cancelled',
        orderStatus: 'cancelled',
    },
};
const STATUS_LABELS = {
    accepted: 'acceptée',
    en_route: 'en route',
    completed: 'terminée',
    cancelled: 'annulée',
};
let OrdersService = class OrdersService {
    orders;
    locations;
    assignments;
    users;
    notifications;
    constructor(orders, locations, assignments, users, notifications) {
        this.orders = orders;
        this.locations = locations;
        this.assignments = assignments;
        this.users = users;
        this.notifications = notifications;
    }
    orderRelations = {
        client: true,
        pickupLocation: true,
        deliveryLocation: true,
        assignment: { deliverer: true },
    };
    async loadOrder(id) {
        const order = await this.orders.findOne({
            where: { id },
            relations: this.orderRelations,
        });
        if (!order)
            throw new common_1.NotFoundException({ detail: 'Commande introuvable.' });
        return order;
    }
    notify(userId, title, body, order) {
        const message = {
            title,
            body,
            order_id: order.id,
            order_type: order.orderType,
        };
        if (userId === 'admin') {
            this.notifications.notifyAdmins(message);
        }
        else {
            this.notifications.notifyUser(userId, message);
        }
    }
    async createLocation(data) {
        if (!data)
            return null;
        const loc = this.locations.create({
            address: data.address ?? '',
            latitude: data.latitude != null ? String(data.latitude) : null,
            longitude: data.longitude != null ? String(data.longitude) : null,
            notes: data.notes ?? '',
            createdAt: new Date(),
        });
        return this.locations.save(loc);
    }
    async createOrder(client, dto) {
        let deliverer = null;
        if (dto.deliverer_id) {
            deliverer = await this.users.findOne({
                where: { id: dto.deliverer_id, role: 'livreur' },
            });
        }
        if (dto.order_type === 'livraison') {
            if (!dto.delivery_location) {
                throw new common_1.BadRequestException({
                    delivery_location: ['Delivery location is required for livraison.'],
                });
            }
            if (!deliverer) {
                throw new common_1.BadRequestException({
                    deliverer_id: ['A deliverer is required for livraison.'],
                });
            }
        }
        if (dto.order_type === 'recuperation' && !dto.pickup_location) {
            throw new common_1.BadRequestException({
                pickup_location: ['Pickup location is required for recuperation.'],
            });
        }
        const pickup = await this.createLocation(dto.pickup_location ?? undefined);
        const delivery = await this.createLocation(dto.delivery_location ?? undefined);
        const now = new Date();
        const order = this.orders.create({
            clientId: client.id,
            orderType: dto.order_type,
            description: dto.description ?? '',
            status: dto.order_type === 'livraison' ? 'assigned' : 'pending',
            pickupLocationId: pickup?.id ?? null,
            deliveryLocationId: delivery?.id ?? null,
            createdAt: now,
            updatedAt: now,
        });
        await this.orders.save(order);
        if (dto.order_type === 'livraison' && deliverer) {
            const assignment = this.assignments.create({
                orderId: order.id,
                delivererId: deliverer.id,
                status: 'assigned',
                assignedAt: now,
                notes: '',
                acceptedAt: null,
                pickedUpAt: null,
                completedAt: null,
            });
            await this.assignments.save(assignment);
        }
        const full = await this.loadOrder(order.id);
        if (full.orderType === 'recuperation') {
            this.notify('admin', 'Nouvelle recuperation', `Commande #${full.id} en attente de traitement.`, full);
        }
        else {
            this.notify('admin', 'Nouvelle livraison', `Commande #${full.id} assignée à un livreur.`, full);
            if (full.assignment?.delivererId) {
                this.notify(full.assignment.delivererId, 'Nouvelle livraison assignee', `Commande #${full.id} vous a ete assignee.`, full);
                this.notify(full.clientId, 'Livreur assigné', `Un livreur a été assigné à votre commande #${full.id}.`, full);
            }
        }
        return (0, order_serializer_1.serializeOrder)(full);
    }
    async myOrders(client) {
        const list = await this.orders.find({
            where: { clientId: client.id },
            relations: this.orderRelations,
            order: { createdAt: 'DESC' },
        });
        return list.map(order_serializer_1.serializeOrder);
    }
    async myDeliveries(livreur) {
        const list = await this.orders.find({
            where: { assignment: { delivererId: livreur.id } },
            relations: this.orderRelations,
            order: { createdAt: 'DESC' },
        });
        return list.map(order_serializer_1.serializeOrder);
    }
    async adminList(query) {
        const qb = this.orders
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.client', 'client')
            .leftJoinAndSelect('order.pickupLocation', 'pickupLocation')
            .leftJoinAndSelect('order.deliveryLocation', 'deliveryLocation')
            .leftJoinAndSelect('order.assignment', 'assignment')
            .leftJoinAndSelect('assignment.deliverer', 'deliverer')
            .orderBy('order.created_at', 'DESC');
        if (query.status)
            qb.andWhere('order.status = :status', { status: query.status });
        if (query.order_type) {
            qb.andWhere('order.order_type = :orderType', { orderType: query.order_type });
        }
        if (query.client_id) {
            qb.andWhere('order.client_id = :clientId', { clientId: query.client_id });
        }
        if (query.deliverer_id) {
            qb.andWhere('assignment.deliverer_id = :delivererId', {
                delivererId: query.deliverer_id,
            });
        }
        const list = await qb.getMany();
        return list.map(order_serializer_1.serializeOrder);
    }
    async assignDeliverer(orderId, delivererId) {
        const deliverer = await this.users.findOne({
            where: { id: delivererId, role: 'livreur' },
        });
        if (!deliverer) {
            throw new common_1.BadRequestException({ deliverer_id: ['Livreur invalide.'] });
        }
        const order = await this.orders.findOne({
            where: { id: orderId },
            relations: { assignment: true },
        });
        if (!order)
            throw new common_1.NotFoundException({ detail: 'Commande introuvable.' });
        let assignment = order.assignment;
        if (assignment) {
            if (!['cancelled', 'completed'].includes(assignment.status)) {
                throw new common_1.BadRequestException({
                    detail: 'Cette commande a déjà une assignation active.',
                });
            }
            assignment.delivererId = deliverer.id;
            assignment.status = 'assigned';
            assignment.acceptedAt = null;
            assignment.pickedUpAt = null;
            assignment.completedAt = null;
            await this.assignments.save(assignment);
        }
        else {
            assignment = this.assignments.create({
                orderId: order.id,
                delivererId: deliverer.id,
                status: 'assigned',
                assignedAt: new Date(),
                notes: '',
                acceptedAt: null,
                pickedUpAt: null,
                completedAt: null,
            });
            await this.assignments.save(assignment);
        }
        order.status = 'assigned';
        await this.orders.save(order);
        const full = await this.loadOrder(orderId);
        const label = deliverer.username;
        this.notify('admin', 'Livraison assignee', `Commande #${full.id} assignee a ${label}.`, full);
        this.notify(deliverer.id, 'Nouvelle livraison assignee', `Commande #${full.id} vous a ete assignee.`, full);
        this.notify(full.clientId, 'Livreur assigné', `Un livreur a été assigné à votre commande #${full.id}.`, full);
        return (0, order_serializer_1.serializeOrder)(full);
    }
    async assignmentAction(orderId, action, livreur) {
        const transition = ASSIGNMENT_TRANSITIONS[action];
        if (!transition) {
            throw new common_1.BadRequestException({ detail: 'Action invalide.' });
        }
        const order = await this.orders.findOne({
            where: { id: orderId },
            relations: { assignment: true, client: true },
        });
        if (!order)
            throw new common_1.NotFoundException({ detail: 'Commande introuvable.' });
        const assignment = order.assignment;
        if (!assignment) {
            throw new common_1.NotFoundException({ detail: 'Aucune assignation pour cette commande.' });
        }
        if (assignment.delivererId !== livreur.id) {
            throw new common_1.ForbiddenException({ detail: 'Non autorisé.' });
        }
        if (!transition.from.has(assignment.status)) {
            throw new common_1.BadRequestException({
                detail: `Transition '${action}' impossible depuis le statut '${assignment.status}'.`,
            });
        }
        const now = new Date();
        assignment.status = transition.assignmentStatus;
        if (transition.setAcceptedAt)
            assignment.acceptedAt = now;
        if (transition.setCompletedAt)
            assignment.completedAt = now;
        if (transition.setPickedUpAt)
            assignment.pickedUpAt = now;
        await this.assignments.save(assignment);
        const previousOrderStatus = order.status;
        order.status = transition.orderStatus;
        await this.orders.save(order);
        const full = await this.loadOrder(orderId);
        const label = STATUS_LABELS[assignment.status] ?? assignment.status;
        this.notify(full.clientId, `Commande #${full.id} — ${label}`, '', full);
        this.notify(livreur.id, `Commande #${full.id} — ${label}`, '', full);
        if (previousOrderStatus !== order.status) {
            const orderStatusLabels = {
                assigned: 'assignée',
                in_transit: 'en cours',
                delivered: 'livrée',
                cancelled: 'annulée',
                picked_up: 'récupérée',
            };
            const orderLabel = orderStatusLabels[order.status] ?? order.status;
            this.notify('admin', `Commande #${full.id} — ${orderLabel}`, '', full);
        }
        return (0, order_serializer_1.serializeOrder)(full);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __param(2, (0, typeorm_1.InjectRepository)(delivery_assignment_entity_1.DeliveryAssignment)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map