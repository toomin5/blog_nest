import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';
import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const clientID = configService.get<string>('KAKAO_CLIENT_ID');
    const callbackURL = configService.get<string>('KAKAO_CALLBACK_URL');

    if (!clientID || !callbackURL) {
      throw new Error('Kakao OAuth configuration is missing');
    }

    super({
      clientID,
      callbackURL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    const { id, username, _json } = profile;
    const email = _json.kakao_account?.email;

    const user = await this.authService.validateKakaoUser({
      providerId: String(id),
      email: email || `${id}@kakao.user`,
      name: username || _json.properties?.nickname || 'KakaoUser',
    });

    done(null, user);
  }
}
