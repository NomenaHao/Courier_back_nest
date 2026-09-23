import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Location } from '../entities/location.entity';
import { DeliveryAssignment } from '../entities/delivery-assignment.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto } from './orders.dto';
import { serializeOrder } from './order.serializer';
import { NotificationsService } from '../notifications/notifications.service';

const ASSIGNMENT_TRANSITIONS: Record<
  string,
  {
    from: Set<string>;
    assignmentStatus: string;
    orderStatus: string;
    setAcceptedAt?: boolean;
    setCompletedAt?: boolean;
    setPickedUpAt?: boolean;
  }
> = {
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

const STATUS_LABELS: Record<string, string> = {
  accepted: 'acceptée',
  en_route: 'en route',
  completed: 'terminée',
  cancelled: 'annulée',
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orders: Repository<Order>,
    @InjectRepository(Location) private locations: Repository<Location>,
    @InjectRepository(DeliveryAssignment)
    private assignments: Repository<DeliveryAssignment>,
    @InjectRepository(User) private users: Repository<User>,
    private notifications: NotificationsService,
  ) {}

  private orderRelations = {
    client: true,
    pickupLocation: true,
    deliveryLocation: true,
    assignment: { deliverer: true },
  } as const;

  private async loadOrder(id: number) {
    const order = await this.orders.findOne({
      where: { id },
      relations: this.orderRelations,
    });
    if (!order) throw new NotFoundException({ detail: 'Commande introuvable.' });
    return order;
  }

  private notify(
    userId: number | 'admin',
    title: string,
    body: string,
    order: Order,
  ) {
    const message = {
      title,
      body,
      order_id: order.id,
      order_type: order.orderType,
    };
    if (userId === 'admin') {
      this.notifications.notifyAdmins(message);
    } else {
      this.notifications.notifyUser(userId, message);
    }
  }

  private async createLocation(data?: CreateOrderDto['pickup_location']) {
    if (!data) return null;
    const loc = this.locations.create({
      address: data.address ?? '',
      latitude: data.latitude != null ? String(data.latitude) : null,
      longitude: data.longitude != null ? String(data.longitude) : null,
      notes: data.notes ?? '',
      createdAt: new Date(),
    });
    return this.locations.save(loc);
  }

  async createOrder(client: User, dto: CreateOrderDto) {
    let deliverer: User | null = null;
    if (dto.deliverer_id) {
      deliverer = await this.users.findOne({
        where: { id: dto.deliverer_id, role: 'livreur' },
      });
    }

    if (dto.order_type === 'livraison') {
      if (!dto.delivery_location) {
        throw new BadRequestException({
          delivery_location: ['Delivery location is required for livraison.'],
        });
      }
      if (!deliverer) {
        throw new BadRequestException({
          deliverer_id: ['A deliverer is required for livraison.'],
        });
      }
    }

    if (dto.order_type === 'recuperation' && !dto.pickup_location) {
      throw new BadRequestException({
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
      this.notify(
        'admin',
        'Nouvelle recuperation',
        `Commande #${full.id} en attente de traitement.`,
        full,
      );
    } else {
      this.notify(
        'admin',
        'Nouvelle livraison',
        `Commande #${full.id} assignée à un livreur.`,
        full,
      );
      if (full.assignment?.delivererId) {
        this.notify(
          full.assignment.delivererId,
          'Nouvelle livraison assignee',
          `Commande #${full.id} vous a ete assignee.`,
          full,
        );
        this.notify(
          full.clientId,
          'Livreur assigné',
          `Un livreur a été assigné à votre commande #${full.id}.`,
          full,
        );
      }
    }

    return serializeOrder(full);
  }

  async myOrders(client: User) {
    const list = await this.orders.find({
      where: { clientId: client.id },
      relations: this.orderRelations,
      order: { createdAt: 'DESC' },
    });
    return list.map(serializeOrder);
  }

  async myDeliveries(livreur: User) {
    const list = await this.orders.find({
      where: { assignment: { delivererId: livreur.id } },
      relations: this.orderRelations,
      order: { createdAt: 'DESC' },
    });
    return list.map(serializeOrder);
  }

  async adminList(query: Record<string, string | undefined>) {
    const qb = this.orders
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.pickupLocation', 'pickupLocation')
      .leftJoinAndSelect('order.deliveryLocation', 'deliveryLocation')
      .leftJoinAndSelect('order.assignment', 'assignment')
      .leftJoinAndSelect('assignment.deliverer', 'deliverer')
      .orderBy('order.created_at', 'DESC');

    if (query.status) qb.andWhere('order.status = :status', { status: query.status });
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
    return list.map(serializeOrder);
  }

  async assignDeliverer(orderId: number, delivererId: number) {
    const deliverer = await this.users.findOne({
      where: { id: delivererId, role: 'livreur' },
    });
    if (!deliverer) {
      throw new BadRequestException({ deliverer_id: ['Livreur invalide.'] });
    }

    const order = await this.orders.findOne({
      where: { id: orderId },
      relations: { assignment: true },
    });
    if (!order) throw new NotFoundException({ detail: 'Commande introuvable.' });

    let assignment = order.assignment;
    if (assignment) {
      if (!['cancelled', 'completed'].includes(assignment.status)) {
        throw new BadRequestException({
          detail: 'Cette commande a déjà une assignation active.',
        });
      }
      assignment.delivererId = deliverer.id;
      assignment.status = 'assigned';
      assignment.acceptedAt = null;
      assignment.pickedUpAt = null;
      assignment.completedAt = null;
      await this.assignments.save(assignment);
    } else {
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
    this.notify(
      'admin',
      'Livraison assignee',
      `Commande #${full.id} assignee a ${label}.`,
      full,
    );
    this.notify(
      deliverer.id,
      'Nouvelle livraison assignee',
      `Commande #${full.id} vous a ete assignee.`,
      full,
    );
    this.notify(
      full.clientId,
      'Livreur assigné',
      `Un livreur a été assigné à votre commande #${full.id}.`,
      full,
    );

    return serializeOrder(full);
  }

  async assignmentAction(orderId: number, action: string, livreur: User) {
    const transition = ASSIGNMENT_TRANSITIONS[action];
    if (!transition) {
      throw new BadRequestException({ detail: 'Action invalide.' });
    }

    const order = await this.orders.findOne({
      where: { id: orderId },
      relations: { assignment: true, client: true },
    });
    if (!order) throw new NotFoundException({ detail: 'Commande introuvable.' });

    const assignment = order.assignment;
    if (!assignment) {
      throw new NotFoundException({ detail: 'Aucune assignation pour cette commande.' });
    }

    if (assignment.delivererId !== livreur.id) {
      throw new ForbiddenException({ detail: 'Non autorisé.' });
    }

    if (!transition.from.has(assignment.status)) {
      throw new BadRequestException({
        detail: `Transition '${action}' impossible depuis le statut '${assignment.status}'.`,
      });
    }

    const now = new Date();
    assignment.status = transition.assignmentStatus;
    if (transition.setAcceptedAt) assignment.acceptedAt = now;
    if (transition.setCompletedAt) assignment.completedAt = now;
    if (transition.setPickedUpAt) assignment.pickedUpAt = now;
    await this.assignments.save(assignment);

    const previousOrderStatus = order.status;
    order.status = transition.orderStatus;
    await this.orders.save(order);

    const full = await this.loadOrder(orderId);
    const label = STATUS_LABELS[assignment.status] ?? assignment.status;

    this.notify(
      full.clientId,
      `Commande #${full.id} — ${label}`,
      '',
      full,
    );
    this.notify(
      livreur.id,
      `Commande #${full.id} — ${label}`,
      '',
      full,
    );

    if (previousOrderStatus !== order.status) {
      const orderStatusLabels: Record<string, string> = {
        assigned: 'assignée',
        in_transit: 'en cours',
        delivered: 'livrée',
        cancelled: 'annulée',
        picked_up: 'récupérée',
      };
      const orderLabel =
        orderStatusLabels[order.status] ?? order.status;
      this.notify(
        'admin',
        `Commande #${full.id} — ${orderLabel}`,
        '',
        full,
      );
    }

    return serializeOrder(full);
  }
}
