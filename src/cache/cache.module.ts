import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');

        // Redis가 설정되어 있으면 Redis 사용, 아니면 메모리 캐시 사용
        if (redisUrl) {
          return {
            store: redisStore,
            url: redisUrl,
            ttl: 60 * 5,
          };
        }
        return {
          ttl: 60 * 5,
          max: 100,
        };
      },
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
