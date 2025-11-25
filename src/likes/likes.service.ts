import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async toggle(userId: string, postId: string) {
    // 게시글 존재 확인
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 기존 좋아요 확인
    const existingLike = await this.prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    // 좋아요가 이미 있으면 삭제 (토글)
    if (existingLike) {
      await this.prisma.$transaction([
        this.prisma.like.delete({
          where: { id: existingLike.id },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);

      return {
        message: '좋아요가 취소되었습니다.',
        liked: false,
      };
    }

    // 좋아요가 없으면 생성
    await this.prisma.$transaction([
      this.prisma.like.create({
        data: {
          postId,
          userId,
        },
      }),
      this.prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);

    return {
      message: '좋아요를 눌렀습니다.',
      liked: true,
    };
  }

  async getPostLikes(postId: string) {
    // 게시글의 좋아요 목록 조회
    const likes = await this.prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      count: likes.length,
      likes,
    };
  }

  async checkUserLike(userId: string, postId: string) {
    // 사용자가 해당 게시글에 좋아요를 눌렀는지 확인
    const like = await this.prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    return {
      liked: !!like,
    };
  }
}
