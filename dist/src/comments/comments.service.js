"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let CommentsService = class CommentsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(userId, createCommentDto) {
        const { content, postId, parentId } = createCommentDto;
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!post) {
            throw new common_1.NotFoundException('게시글을 찾을 수 없습니다.');
        }
        let parentComment = null;
        if (parentId) {
            const foundParentComment = await this.prisma.comment.findUnique({
                where: { id: parentId },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            if (!foundParentComment) {
                throw new common_1.NotFoundException('부모 댓글을 찾을 수 없습니다.');
            }
            if (foundParentComment.postId !== postId) {
                throw new common_1.ForbiddenException('부모 댓글과 같은 게시글에만 대댓글을 작성할 수 있습니다.');
            }
            parentComment = foundParentComment;
        }
        const comment = await this.prisma.comment.create({
            data: {
                content,
                userId,
                postId,
                parentId,
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
            },
        });
        if (parentId && parentComment) {
            await this.notificationsService.createNotification(client_1.NotificationType.REPLY_ON_COMMENT, `${comment.user.name}님이 회원님의 댓글에 답글을 달았습니다.`, parentComment.userId, userId, postId, comment.id);
        }
        else {
            await this.notificationsService.createNotification(client_1.NotificationType.COMMENT_ON_POST, `${comment.user.name}님이 회원님의 게시글에 댓글을 달았습니다.`, post.userId, userId, postId, comment.id);
        }
        return comment;
    }
    async findByPostId(postId) {
        return this.prisma.comment.findMany({
            where: {
                postId,
                parentId: null,
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
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                position: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const comment = await this.prisma.comment.findUnique({
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
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                position: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });
        if (!comment) {
            throw new common_1.NotFoundException('댓글을 찾을 수 없습니다.');
        }
        return comment;
    }
    async update(id, userId, updateCommentDto) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
        });
        if (!comment) {
            throw new common_1.NotFoundException('댓글을 찾을 수 없습니다.');
        }
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException('본인의 댓글만 수정할 수 있습니다.');
        }
        return this.prisma.comment.update({
            where: { id },
            data: updateCommentDto,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        position: true,
                    },
                },
            },
        });
    }
    async remove(id, userId, isAdmin) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
        });
        if (!comment) {
            throw new common_1.NotFoundException('댓글을 찾을 수 없습니다.');
        }
        if (!isAdmin && comment.userId !== userId) {
            throw new common_1.ForbiddenException('본인의 댓글만 삭제할 수 있습니다.');
        }
        await this.prisma.comment.delete({
            where: { id },
        });
        return { message: '댓글이 삭제되었습니다.' };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => notifications_service_1.NotificationsService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map