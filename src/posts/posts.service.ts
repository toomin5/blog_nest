import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

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

    return post;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
    search?: string,
    sortBy: 'createdAt' | 'views' | 'likes' = 'createdAt',
  ) {
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

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, incrementView: boolean = false) {
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
      await this.prisma.post.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
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

    return { message: 'Post deleted successfully' };
  }
}
