import { PrismaService } from '../prisma/prisma.service';
export declare class StatisticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPopularPostsByViews(limit?: number): Promise<({
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
    })[]>;
    getPopularPostsByLikes(limit?: number): Promise<({
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
    })[]>;
    getUserStatistics(userId: string): Promise<{
        postsCount: number;
        commentsCount: number;
        likesReceived: number;
        totalViews: number;
    }>;
    getCategoryStatistics(): Promise<{
        id: string;
        name: string;
        postsCount: number;
    }[]>;
    getOverallStatistics(): Promise<{
        totalPosts: number;
        totalUsers: number;
        totalComments: number;
        totalLikes: number;
        totalViews: number;
    }>;
}
