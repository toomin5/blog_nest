import { LikesService } from './likes.service';
import type { UserFromJwt } from '../auth/interfaces/user-from-jwt.interface';
export declare class LikesController {
    private readonly likesService;
    constructor(likesService: LikesService);
    toggle(postId: string, user: UserFromJwt): Promise<{
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
            postId: string;
            userId: string;
        })[];
    }>;
    checkUserLike(postId: string, user: UserFromJwt): Promise<{
        liked: boolean;
    }>;
}
