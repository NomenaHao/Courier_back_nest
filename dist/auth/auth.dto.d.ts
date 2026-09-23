export declare class RegisterDto {
    username: string;
    password: string;
    role: string;
    phone?: string;
}
export declare class LoginDto {
    username: string;
    password: string;
}
export declare class RefreshDto {
    refresh: string;
}
export declare class ProfileUpdateDto {
    username?: string;
    phone?: string;
    email?: string;
}
