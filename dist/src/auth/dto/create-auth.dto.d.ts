import { Position } from '@prisma/client';
export declare class SignupDto {
    name: string;
    email: string;
    phone: string;
    password: string;
    position?: Position;
}
export declare class LoginDto {
    email: string;
    password: string;
}
