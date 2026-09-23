import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class LivreurGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest<{ user: User }>();
    if (user?.role === 'livreur') return true;
    throw new ForbiddenException();
  }
}
