import { StatisticsService } from './statistics.service';
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
    getPopularPostsByViews(limit: number): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            position: import(".prisma/client").$Enums.Position | null;
        };
        categories: ({
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            postId: string;
            categoryId: string;
        })[];
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        id: string;
        date: Date;
        title: string;
        subtitle: string | null;
        content: string;
        thumbnail: string | null;
        views: number;
        likesCount: number;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getPopularPostsByLikes(limit: number): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            position: import(".prisma/client").$Enums.Position | null;
        };
        categories: ({
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            postId: string;
            categoryId: string;
        })[];
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        id: string;
        date: Date;
        title: string;
        subtitle: string | null;
        content: string;
        thumbnail: string | null;
        views: number;
        likesCount: number;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
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
