import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, phone, password, name, position } = signupDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
            provider: 'LOCAL',
          },
          { phone },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or phone already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        phone,
        name,
        password: hashedPassword,
        position,
        provider: 'LOCAL',
        status: 'APPROVED',
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        position: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      message: 'User registered successfully.',
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email_provider: {
          email,
          provider: 'LOCAL',
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'APPROVED') {
      throw new UnauthorizedException('Account is not approved yet');
    }

    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.provider,
    );

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        position: user.position,
        provider: user.provider,
      },
      ...tokens,
    };
  }

  async refresh(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.provider,
    );
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string, token: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    const decoded = this.jwtService.decode(token) as any;
    if (decoded && decoded.exp) {
      await this.prisma.tokenBlacklist.create({
        data: {
          token,
          expiresAt: new Date(decoded.exp * 1000),
        },
      });
    }

    return { message: 'Logged out successfully' };
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    provider: string,
  ) {
    const payload = { sub: userId, email, role, provider };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const expiresIn = this.configService.get('JWT_REFRESH_EXPIRATION');
    const expiresAt = new Date();

    const match = expiresIn.match(/(\d+)([dhms])/);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];

      switch (unit) {
        case 'd':
          expiresAt.setDate(expiresAt.getDate() + value);
          break;
        case 'h':
          expiresAt.setHours(expiresAt.getHours() + value);
          break;
        case 'm':
          expiresAt.setMinutes(expiresAt.getMinutes() + value);
          break;
        case 's':
          expiresAt.setSeconds(expiresAt.getSeconds() + value);
          break;
      }
    }

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async validateKakaoUser(kakaoUser: {
    providerId: string;
    email: string;
    name: string;
  }) {
    let user = await this.prisma.user.findUnique({
      where: {
        provider_providerId: {
          provider: 'KAKAO',
          providerId: kakaoUser.providerId,
        },
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: kakaoUser.email,
          name: kakaoUser.name,
          provider: 'KAKAO',
          providerId: kakaoUser.providerId,
          status: 'APPROVED',
        },
      });
    }

    return user;
  }

  async kakaoLogin(user: any) {
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.provider,
    );
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        provider: user.provider,
      },
      ...tokens,
    };
  }
}
