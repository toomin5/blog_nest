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
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LikesService = class LikesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async toggle(userId, postId) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('게시글을 찾을 수 없습니다.');
        }
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LikesService);
//# sourceMappingURL=likes.service.js.map