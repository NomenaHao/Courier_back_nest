import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';
export declare function isAdminUser(user: User): boolean;
export declare class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
