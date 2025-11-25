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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_manager_1 = require("@nestjs/cache-manager");
let PostsService = class PostsService {
    prisma;
    cacheManager;
    constructor(prisma, cacheManager) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
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
        await this.invalidatePostListCache();
        return post;
    }
    async findAll(page = 1, limit = 10, categoryId, search, sortBy = 'createdAt') {
        const cacheKey = `posts:list:${page}:${limit}:${categoryId || 'all'}:${search || 'none'}:${sortBy}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        const skip = (page - 1) * limit;
        const where = {};
        if (categoryId) {
            where.categories = {
                some: {
                    categoryId,
                },
            };
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { subtitle: { contains: search, mode: 'insensitive' } },
            ];
        }
        let orderBy = { createdAt: 'desc' };
        if (sortBy === 'views') {
            orderBy = { views: 'desc' };
        }
        else if (sortBy === 'likes') {
            orderBy = { likesCount: 'desc' };
        }
        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                skip,
                take: limit,
                orderBy,
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
        const result = {
            data: posts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
        await this.cacheManager.set(cacheKey, result, 180);
        return result;
    }
    async findOne(id, incrementView = false) {
        if (!incrementView) {
            const cacheKey = `post:${id}`;
            const cachedPost = await this.cacheManager.get(cacheKey);
            if (cachedPost) {
                return cachedPost;
            }
        }
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
            this.prisma.post
                .update({
                where: { id },
                data: { views: { increment: 1 } },
            })
                .then(() => {
                this.cacheManager.del(`post:${id}`);
            })
                .catch((error) => {
                console.error('Failed to increment views:', error);
            });
        }
        else {
            await this.cacheManager.set(`post:${id}`, post, 300);
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
        await this.cacheManager.del(`post:${id}`);
        await this.invalidatePostListCache();
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
        await this.cacheManager.del(`post:${id}`);
        await this.invalidatePostListCache();
        return { message: 'Post deleted successfully' };
    }
    async invalidatePostListCache() {
        const pagesToClear = [1, 2, 3];
        const limits = [10, 20];
        const sortOptions = ['createdAt', 'views', 'likes'];
        for (const page of pagesToClear) {
            for (const limit of limits) {
                for (const sortBy of sortOptions) {
                    const key = `posts:list:${page}:${limit}:all:none:${sortBy}`;
                    await this.cacheManager.del(key);
                }
            }
        }
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], PostsService);
//# sourceMappingURL=posts.service.js.map