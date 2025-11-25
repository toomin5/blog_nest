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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PostsService = class PostsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createPostDto) {
        const { categoryIds, date, ...postData } = createPostDto;
        const post = await this.prisma.post.create({
            data: {
                ...postData,
                date: date ? new Date(date) : new Date(),
                userId,
                categories: categoryIds
                    ? {
                        create: categoryIds.map((categoryId) => ({
                            category: { connect: { id: categoryId } },
                        })),
                    }
                    : undefined,
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
        return post;
    }
    async findAll(page = 1, limit = 10, categoryId) {
        const skip = (page - 1) * limit;
        const where = categoryId
            ? {
                categories: {
                    some: {
                        categoryId,
                    },
                },
            }
            : {};
        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
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
            }),
            this.prisma.post.count({ where }),
        ]);
        return {
            data: posts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, incrementView = false) {
        const post = await this.prisma.post.findUnique({
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
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (incrementView) {
            await this.prisma.post.update({
                where: { id },
                data: { views: { increment: 1 } },
            });
        }
        return post;
    }
    async update(id, userId, updatePostDto) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own posts');
        }
        const { categoryIds, date, ...postData } = updatePostDto;
        const updatedPost = await this.prisma.post.update({
            where: { id },
            data: {
                ...postData,
                date: date ? new Date(date) : undefined,
                categories: categoryIds
                    ? {
                        deleteMany: {},
                        create: categoryIds.map((categoryId) => ({
                            category: { connect: { id: categoryId } },
                        })),
                    }
                    : undefined,
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
        return updatedPost;
    }
    async remove(id, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own posts');
        }
        await this.prisma.post.delete({
            where: { id },
        });
        return { message: 'Post deleted successfully' };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map