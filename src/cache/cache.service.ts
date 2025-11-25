import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    // cache-manager v5에서는 reset이 없으므로 구현하지 않음
    // 필요시 store에 직접 접근하여 구현
  }

  // 패턴으로 여러 키 삭제 (예: 'posts:*')
  async delPattern(pattern: string): Promise<void> {
    // cache-manager v5에서는 store API가 변경됨
    // 간단한 구현: 나중에 필요시 Redis SCAN 사용
    // 현재는 기능 생략
  }
}
