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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCategoryDto) {
        const existingCategory = await this.prisma.category.findUnique({
            where: { name: createCategoryDto.name },
        });
        if (existingCategory) {
            throw new common_1.ConflictException('Category name already exists');
        }
        const category = await this.prisma.category.create({
            data: createCategoryDto,
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        return category;
    }
    async findAll() {
        const categories = await this.prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        return categories;
    }
    async findOne(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (updateCategoryDto.name) {
            const existingCategory = await this.prisma.category.findUnique({
                where: { name: updateCategoryDto.name },
            });
            if (existingCategory && existingCategory.id !== id) {
                throw new common_1.ConflictException('Category name already exists');
            }
        }
        const updatedCategory = await this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        return updatedCategory;
    }
    async remove(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (category._count.posts > 0) {
            throw new common_1.ConflictException('Cannot delete category with associated posts');
        }
        await this.prisma.category.delete({
            where: { id },
        });
        return { message: 'Category deleted successfully' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map