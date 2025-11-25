import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto } from './dto/create-auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
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
    refresh(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, token: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private saveRefreshToken;
    validateKakaoUser(kakaoUser: {
        providerId: string;
        email: string;
        name: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        password: string | null;
        provider: import(".prisma/client").$Enums.Provider;
        providerId: string | null;
        position: import(".prisma/client").$Enums.Position | null;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
    }>;
    kakaoLogin(user: any): Promise<{
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
