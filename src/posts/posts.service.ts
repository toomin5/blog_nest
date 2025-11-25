import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    const { categoryIds, date, ...postData } = createPostDto;

    const post = await this.prisma.post.create({
      data: {
        ...postData,
        date: date ? new Date(date) : new Date(),
        userId,
        categories: categoryIds
          ? {
              create: categoryIds.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    // 캐시 무효화: 게시글 목록 관련 캐시 삭제
    await this.invalidatePostListCache();

    return post;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
    search?: string,
    sortBy: 'createdAt' | 'views' | 'likes' = 'createdAt',
  ) {
    // 캐시 키 생성
    const cacheKey = `posts:list:${page}:${limit}:${categoryId || 'all'}:${search || 'none'}:${sortBy}`;

    // 캐시에서 먼저 확인
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const skip = (page - 1) * limit;

    // where 조건 구성
    const where: any = {};

    if (categoryId) {
      where.categories = {
        some: {
          categoryId,
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
      ];
    }

    // orderBy 조건 구성
    let orderBy: any = { createdAt: 'desc' };

    if (sortBy === 'views') {
      orderBy = { views: 'desc' };
    } else if (sortBy === 'likes') {
      orderBy = { likesCount: 'desc' };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              position: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    const result = {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // 캐시에 저장
    await this.cacheManager.set(cacheKey, result, 180);

    return result;
  }

  async findOne(id: string, incrementView: boolean = false) {
    // 조회수 증가가 필요 없는 경우 캐시 사용
    if (!incrementView) {
      const cacheKey = `post:${id}`;
      const cachedPost = await this.cacheManager.get(cacheKey);
      if (cachedPost) {
        return cachedPost;
      }
    }

    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (incrementView) {
      // 조회수는 비동기로 업데이트 (응답 속도 개선)
      this.prisma.post
        .update({
          where: { id },
          data: { views: { increment: 1 } },
        })
        .then(() => {
          // 조회수 업데이트 후 캐시 무효화
          this.cacheManager.del(`post:${id}`);
        })
        .catch((error) => {
          console.error('Failed to increment views:', error);
        });
    } else {
      // 조회수 증가 없이 조회하는 경우 캐시에 저장
      await this.cacheManager.set(`post:${id}`, post, 300);
    }

    return post;
  }

  async update(id: string, userId: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const { categoryIds, date, ...postData } = updatePostDto;

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
        date: date ? new Date(date) : undefined,
        categories: categoryIds
          ? {
              deleteMany: {},
              create: categoryIds.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    // 캐시 무효화
    await this.cacheManager.del(`post:${id}`);
    await this.invalidatePostListCache();

    return updatedPost;
  }

  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({
      where: { id },
    });

    // 캐시 무효화
    await this.cacheManager.del(`post:${id}`);
    await this.invalidatePostListCache();

    return { message: 'Post deleted successfully' };
  }

  // 헬퍼 메서드: 게시글 목록 캐시 무효화
  private async invalidatePostListCache() {
    // cache-manager v5에서는 패턴 삭제가 직접 지원되지 않음
    // 프로덕션 환경에서는 Redis SCAN 명령어 사용 권장
    // 간단한 해결책: 주요 페이지의 캐시만 삭제
    const pagesToClear = [1, 2, 3]; // 주요 페이지
    const limits = [10, 20];
    const sortOptions = ['createdAt', 'views', 'likes'];

    for (const page of pagesToClear) {
      for (const limit of limits) {
        for (const sortBy of sortOptions) {
          const key = `posts:list:${page}:${limit}:all:none:${sortBy}`;
          await this.cacheManager.del(key);
        }
      }
    }
  }
}
