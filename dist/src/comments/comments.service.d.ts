import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createCommentDto: CreateCommentDto): Promise<{
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
    update(id: string, userId: string, updateCommentDto: UpdateCommentDto): Promise<{
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
    remove(id: string, userId: string, isAdmin: boolean): Promise<{
        message: string;
    }>;
}
