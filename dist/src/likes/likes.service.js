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
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let LikesService = class LikesService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async toggle(userId, postId) {
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
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
            },
        });
        const existingLike = await this.prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        });
        if (existingLike) {
            await this.prisma.$transaction([
                this.prisma.like.delete({
                    where: { id: existingLike.id },
                }),
                this.prisma.post.update({
                    where: { id: postId },
                    data: { likesCount: { decrement: 1 } },
                }),
            ]);
            return {
                message: '좋아요가 취소되었습니다.',
                liked: false,
            };
        }
        await this.prisma.$transaction([
            this.prisma.like.create({
                data: {
                    postId,
                    userId,
                },
            }),
            this.prisma.post.update({
                where: { id: postId },
                data: { likesCount: { increment: 1 } },
            }),
        ]);
        if (user) {
            await this.notificationsService.createNotification(client_1.NotificationType.LIKE_ON_POST, `${user.name}님이 회원님의 게시글을 좋아합니다.`, post.userId, userId, postId);
        }
        return {
            message: '좋아요를 눌렀습니다.',
            liked: true,
        };
    }
    async getPostLikes(postId) {
        const likes = await this.prisma.like.findMany({
            where: { postId },
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
                createdAt: 'desc',
            },
        });
        return {
            count: likes.length,
            likes,
        };
    }
    async checkUserLike(userId, postId) {
        const like = await this.prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        });
        return {
            liked: !!like,
        };
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => notifications_service_1.NotificationsService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], LikesService);
//# sourceMappingURL=likes.service.js.map