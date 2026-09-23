import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export function isAdminUser(user: User): boolean {
  return (
    user.role === 'admin' || user.isStaff || user.isSuperuser
  );
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest<{ user: User }>();
    if (user && isAdminUser(user)) return true;
    throw new ForbiddenException();
  }
}
