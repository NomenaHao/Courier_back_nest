import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginDto, ProfileUpdateDto, RegisterDto } from './auth.dto';
export declare class AuthService {
    private users;
    private jwt;
    constructor(users: Repository<User>, jwt: JwtService);
    private tokens;
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
    refresh(refreshToken: string): Promise<{
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
    updateProfile(user: User, dto: ProfileUpdateDto): Promise<{
        id: number;
        username: string;
        phone: string;
        email: string;
        role: string;
    }>;
}
