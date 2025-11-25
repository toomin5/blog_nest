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
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StatisticsService = class StatisticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPopularPostsByViews(limit = 10) {
        return this.prisma.post.findMany({
            take: limit,
            orderBy: { views: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        position: true,
                    },
                },
                categories: {
                    include: {
                        category: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });
    }
    async getPopularPostsByLikes(limit = 10) {
        return this.prisma.post.findMany({
            take: limit,
            orderBy: { likesCount: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        position: true,
                    },
                },
                categories: {
                    include: {
                        category: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });
    }
    async getUserStatistics(userId) {
        const [postsCount, commentsCount, likesReceived] = await Promise.all([
            this.prisma.post.count({
                where: { userId },
            }),
            this.prisma.comment.count({
                where: { userId },
            }),
            this.prisma.like.count({
                where: {
                    post: {
                        userId,
                    },
                },
            }),
        ]);
        const totalViews = await this.prisma.post.aggregate({
            where: { userId },
            _sum: {
                views: true,
            },
        });
        return {
            postsCount,
            commentsCount,
            likesReceived,
            totalViews: totalViews._sum.views || 0,
        };
    }
    async getCategoryStatistics() {
        const categories = await this.prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
            orderBy: {
                posts: {
                    _count: 'desc',
                },
            },
        });
        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            postsCount: category._count.posts,
        }));
    }
    async getOverallStatistics() {
        const [totalPosts, totalUsers, totalComments, totalLikes] = await Promise.all([
            this.prisma.post.count(),
            this.prisma.user.count(),
            this.prisma.comment.count(),
            this.prisma.like.count(),
        ]);
        const totalViews = await this.prisma.post.aggregate({
            _sum: {
                views: true,
            },
        });
        return {
            totalPosts,
            totalUsers,
            totalComments,
            totalLikes,
            totalViews: totalViews._sum.views || 0,
        };
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map