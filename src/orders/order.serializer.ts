import { DeliveryAssignment } from '../entities/delivery-assignment.entity';
import { Location } from '../entities/location.entity';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';

function serializeLocation(loc: Location | null | undefined) {
  if (!loc) return null;
  return {
    address: loc.address ?? '',
    latitude: loc.latitude != null ? Number(loc.latitude) : null,
    longitude: loc.longitude != null ? Number(loc.longitude) : null,
    notes: loc.notes ?? '',
  };
}

function serializeUserBasic(user: User | null | undefined) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    phone: user.phone ?? '',
  };
}

function serializeAssignment(assignment: DeliveryAssignment | null | undefined) {
  if (!assignment) return null;
  return {
    id: assignment.id,
    status: assignment.status,
    deliverer: serializeUserBasic(assignment.deliverer),
    assigned_at: assignment.assignedAt?.toISOString?.() ?? assignment.assignedAt,
    accepted_at: assignment.acceptedAt?.toISOString?.() ?? assignment.acceptedAt,
    picked_up_at: assignment.pickedUpAt?.toISOString?.() ?? assignment.pickedUpAt,
    completed_at: assignment.completedAt?.toISOString?.() ?? assignment.completedAt,
    notes: assignment.notes ?? '',
  };
}

export function serializeOrder(order: Order) {
  return {
    id: order.id,
    order_type: order.orderType,
    pickup_location: serializeLocation(order.pickupLocation),
    delivery_location: serializeLocation(order.deliveryLocation),
    description: order.description ?? '',
    status: order.status,
    client: serializeUserBasic(order.client),
    assignment: serializeAssignment(order.assignment),
    created_at: order.createdAt?.toISOString?.() ?? order.createdAt,
    updated_at: order.updatedAt?.toISOString?.() ?? order.updatedAt,
  };
}

export function serializeUser(user: User) {
  return {
    id: user.id,
    username: user.username,
    phone: user.phone ?? '',
    email: user.email ?? '',
    role: user.role,
  };
}
