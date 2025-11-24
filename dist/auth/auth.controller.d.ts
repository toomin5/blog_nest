import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/create-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            position: import(".prisma/client").$Enums.Position | null;
            role: import(".prisma/client").$Enums.Role;
            status: import(".prisma/client").$Enums.Status;
            createdAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            position: import(".prisma/client").$Enums.Position | null;
            provider: import(".prisma/client").$Enums.Provider;
        };
    }>;
    refresh(user: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: any, req: any): Promise<{
        message: string;
    }>;
    getProfile(user: any): any;
    kakaoLogin(): void;
    kakaoCallback(user: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            provider: any;
        };
    }>;
}
