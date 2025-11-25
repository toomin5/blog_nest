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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CommentsService = class CommentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createCommentDto) {
        const { content, postId, parentId } = createCommentDto;
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('게시글을 찾을 수 없습니다.');
        }
        if (parentId) {
            const parentComment = await this.prisma.comment.findUnique({
                where: { id: parentId },
            });
            if (!parentComment) {
                throw new common_1.NotFoundException('부모 댓글을 찾을 수 없습니다.');
            }
            if (parentComment.postId !== postId) {
                throw new common_1.ForbiddenException('부모 댓글과 같은 게시글에만 대댓글을 작성할 수 있습니다.');
            }
        }
        return this.prisma.comment.create({
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map