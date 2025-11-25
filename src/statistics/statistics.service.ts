import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  // 인기 게시글 (조회수 기준)
  async getPopularPostsByViews(limit: number = 10) {
    return this.prisma.post.findMany({
      take: limit,
      orderBy: { views: 'desc' },
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
  }

  // 인기 게시글 (좋아요 기준)
  async getPopularPostsByLikes(limit: number = 10) {
    return this.prisma.post.findMany({
      take: limit,
      orderBy: { likesCount: 'desc' },
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
  }

  // 사용자별 통계
  async getUserStatistics(userId: string) {
    const [postsCount, commentsCount, likesReceived] = await Promise.all([
      // 작성한 게시글 수
      this.prisma.post.count({
        where: { userId },
      }),
      // 작성한 댓글 수
      this.prisma.comment.count({
        where: { userId },
      }),
      // 받은 좋아요 수 (본인이 작성한 게시글에 받은 좋아요)
      this.prisma.like.count({
        where: {
          post: {
            userId,
          },
        },
      }),
    ]);

    // 총 조회수 (본인이 작성한 게시글의 조회수 합계)
    const totalViews = await this.prisma.post.aggregate({
      where: { userId },
      _sum: {
        views: true,
      },
    });

    return {
      postsCount,
      commentsCount,
      likesReceived,
      totalViews: totalViews._sum.views || 0,
    };
  }

  // 카테고리별 게시글 수
  async getCategoryStatistics() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        posts: {
          _count: 'desc',
        },
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      postsCount: category._count.posts,
    }));
  }

  // 전체 통계 요약
  async getOverallStatistics() {
    const [totalPosts, totalUsers, totalComments, totalLikes] =
      await Promise.all([
        this.prisma.post.count(),
        this.prisma.user.count(),
        this.prisma.comment.count(),
        this.prisma.like.count(),
      ]);

    // 총 조회수
    const totalViews = await this.prisma.post.aggregate({
      _sum: {
        views: true,
      },
    });

    return {
      totalPosts,
      totalUsers,
      totalComments,
      totalLikes,
      totalViews: totalViews._sum.views || 0,
    };
  }
}
