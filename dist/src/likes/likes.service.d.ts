import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class LikesService {
    private readonly prisma;
    private readonly notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    toggle(userId: string, postId: string): Promise<{
        message: string;
        liked: boolean;
    }>;
    getPostLikes(postId: string): Promise<{
        count: number;
        likes: ({
            user: {
                id: string;
                name: string;
                email: string;
                position: import(".prisma/client").$Enums.Position | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            postId: string;
        })[];
    }>;
    checkUserLike(userId: string, postId: string): Promise<{
        liked: boolean;
    }>;
}
