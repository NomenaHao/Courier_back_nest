export declare class User {
    id: number;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    phone: string;
    email: string;
    isVerified: boolean;
    isStaff: boolean;
    isSuperuser: boolean;
    isActive: boolean;
    dateJoined: Date;
    lastLogin: Date | null;
}
