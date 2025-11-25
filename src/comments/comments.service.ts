import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createCommentDto: CreateCommentDto) {
    const { content, postId, parentId } = createCommentDto;

    // 게시글 존재 확인
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 부모 댓글 존재 확인 (대댓글인 경우)
    if (parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        throw new NotFoundException('부모 댓글을 찾을 수 없습니다.');
      }

      if (parentComment.postId !== postId) {
        throw new ForbiddenException(
          '부모 댓글과 같은 게시글에만 대댓글을 작성할 수 있습니다.',
        );
      }
    }

    return this.prisma.comment.create({
      data: {
        content,
        userId,
        postId,
        parentId,
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
      },
    });
  }

  async findByPostId(postId: string) {
    // 게시글의 모든 댓글 조회 (대댓글 포함)
    return this.prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // 최상위 댓글만 조회
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
        replies: {
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
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
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
        replies: {
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
            createdAt: 'asc',
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    return comment;
  }

  async update(
    id: string,
    userId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('본인의 댓글만 수정할 수 있습니다.');
    }

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
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
    });
  }

  async remove(id: string, userId: string, isAdmin: boolean) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    // 관리자가 아니면서 본인의 댓글이 아닌 경우
    if (!isAdmin && comment.userId !== userId) {
      throw new ForbiddenException('본인의 댓글만 삭제할 수 있습니다.');
    }

    await this.prisma.comment.delete({
      where: { id },
    });

    return { message: '댓글이 삭제되었습니다.' };
  }
}
