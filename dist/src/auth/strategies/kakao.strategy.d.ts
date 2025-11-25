import { ConfigService } from '@nestjs/config';
import { Strategy, Profile } from 'passport-kakao';
import { AuthService } from '../auth.service';
declare const KakaoStrategy_base: new (...args: [options: import("passport-kakao").StrategyOptionWithRequest] | [options: import("passport-kakao").StrategyOption]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class KakaoStrategy extends KakaoStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: Profile, done: any): Promise<void>;
}
export {};
