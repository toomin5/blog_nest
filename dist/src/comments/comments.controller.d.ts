import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { UserFromJwt } from '../auth/interfaces/user-from-jwt.interface';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(user: UserFromJwt, createCommentDto: CreateCommentDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            position: import(".prisma/client").$Enums.Position | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        postId: string;
        parentId: string | null;
    }>;
    findByPostId(postId: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            position: import(".prisma/client").$Enums.Position | null;
        };
        replies: ({
            user: {
                id: string;
                name: string;
                email: string;
                position: import(".prisma/client").$Enums.Position | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            userId: string;
            postId: string;
            parentId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        postId: string;
        parentId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            position: import(".prisma/client").$Enums.Position | null;
        };
        replies: ({
            user: {
                id: string;
                name: string;
                email: string;
                position: import(".prisma/client").$Enums.Position | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            userId: string;
            postId: string;
            parentId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        postId: string;
        parentId: string | null;
    }>;
    update(id: string, user: UserFromJwt, updateCommentDto: UpdateCommentDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            position: import(".prisma/client").$Enums.Position | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        postId: string;
        parentId: string | null;
    }>;
    remove(id: string, user: UserFromJwt): Promise<{
        message: string;
    }>;
}
