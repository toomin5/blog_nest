import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { Cache } from 'cache-manager';
export declare class PostsService {
    private prisma;
    private cacheManager;
    constructor(prisma: PrismaService, cacheManager: Cache);
    create(userId: string, createPostDto: CreatePostDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            position: import(".prisma/client").$Enums.Position | null;
        };
        categories: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            categoryId: string;
            postId: string;
        })[];
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        title: string;
        subtitle: string | null;
        content: string;
        thumbnail: string | null;
        views: number;
        likesCount: number;
        userId: string;
    }>;
    findAll(page?: number, limit?: number, categoryId?: string, search?: string, sortBy?: 'createdAt' | 'views' | 'likes'): Promise<{}>;
    findOne(id: string, incrementView?: boolean): Promise<{}>;
    update(id: string, userId: string, updatePostDto: UpdatePostDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            position: import(".prisma/client").$Enums.Position | null;
        };
        categories: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            categoryId: string;
            postId: string;
        })[];
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        title: string;
        subtitle: string | null;
        content: string;
        thumbnail: string | null;
        views: number;
        likesCount: number;
        userId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    private invalidatePostListCache;
}
