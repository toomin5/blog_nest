import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
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
        userId: string;
    }>;
    findAll(page?: number, limit?: number, categoryId?: string): Promise<{
        data: ({
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
            userId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, incrementView?: boolean): Promise<{
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
        userId: string;
    }>;
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
        userId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
