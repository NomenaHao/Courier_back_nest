import { AuthService } from './auth.service';
import { AdminUserUpdateDto, LoginDto, ProfileUpdateDto, RefreshDto, RegisterDto } from './auth.dto';
import { User } from '../entities/user.entity';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: number;
            username: string;
            phone: string;
            email: string;
            role: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: number;
            username: string;
            phone: string;
            email: string;
            role: string;
        };
        access: string;
        refresh: string;
    }>;
    refresh(dto: RefreshDto): Promise<{
        access: string;
    }>;
    listLivreurs(): Promise<{
        id: number;
        username: string;
        phone: string;
        email: string;
        role: string;
    }[]>;
    listClients(): Promise<{
        id: number;
        username: string;
        phone: string;
        email: string;
        role: string;
    }[]>;
    listUsers(): Promise<{
        id: number;
        username: string;
        phone: string;
        email: string;
        role: string;
    }[]>;
    updateUser(id: number, dto: AdminUserUpdateDto): Promise<{
        id: number;
        username: string;
        phone: string;
        email: string;
        role: string;
    }>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
    profile(req: {
        user: User;
    }): {
        id: number;
        username: string;
        phone: string;
        email: string;
        role: string;
    };
    updateProfile(req: {
        user: User;
    }, dto: ProfileUpdateDto): Promise<{
        id: number;
        username: string;
        phone: string;
        email: string;
        role: string;
    }>;
}
