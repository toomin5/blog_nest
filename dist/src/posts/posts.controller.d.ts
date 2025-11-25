import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import type { UserFromJwt } from '../auth/interfaces/user-from-jwt.interface';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(user: UserFromJwt, createPostDto: CreatePostDto): Promise<{
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
    findAll(page: number, limit: number, categoryId?: string, search?: string, sortBy?: 'createdAt' | 'views' | 'likes'): Promise<{
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
            likesCount: number;
            userId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
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
    update(id: string, user: UserFromJwt, updatePostDto: UpdatePostDto): Promise<{
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
    remove(id: string, user: UserFromJwt): Promise<{
        message: string;
    }>;
}
