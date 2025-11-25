"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Start seeding...');
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.postCategory.deleteMany();
    await prisma.post.deleteMany();
    await prisma.category.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.tokenBlacklist.deleteMany();
    await prisma.user.deleteMany();
    console.log('Deleted existing data');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            name: '관리자',
            phone: '010-0000-0000',
            password: hashedPassword,
            provider: client_1.Provider.LOCAL,
            role: client_1.Role.ADMIN,
            position: client_1.Position.PM,
            status: 'APPROVED',
        },
    });
    const users = await Promise.all([
        prisma.user.create({
            data: {
                email: 'john@example.com',
                name: '김철수',
                phone: '010-1111-1111',
                password: hashedPassword,
                provider: client_1.Provider.LOCAL,
                role: client_1.Role.EMPLOYEE,
                position: client_1.Position.FRONTEND,
                status: 'APPROVED',
            },
        }),
        prisma.user.create({
            data: {
                email: 'jane@example.com',
                name: '이영희',
                phone: '010-2222-2222',
                password: hashedPassword,
                provider: client_1.Provider.LOCAL,
                role: client_1.Role.EMPLOYEE,
                position: client_1.Position.BACKEND,
                status: 'APPROVED',
            },
        }),
        prisma.user.create({
            data: {
                email: 'bob@example.com',
                name: '박민수',
                phone: '010-3333-3333',
                password: hashedPassword,
                provider: client_1.Provider.LOCAL,
                role: client_1.Role.EMPLOYEE,
                position: client_1.Position.DESIGNER,
                status: 'APPROVED',
            },
        }),
        prisma.user.create({
            data: {
                email: 'alice@example.com',
                name: '최지은',
                phone: '010-4444-4444',
                password: hashedPassword,
                provider: client_1.Provider.LOCAL,
                role: client_1.Role.EMPLOYEE,
                position: client_1.Position.AI_ENGINEER,
                status: 'APPROVED',
            },
        }),
    ]);
    console.log(`Created ${users.length + 1} users`);
    const categories = await Promise.all([
        prisma.category.create({ data: { name: 'JavaScript' } }),
        prisma.category.create({ data: { name: 'TypeScript' } }),
        prisma.category.create({ data: { name: 'React' } }),
        prisma.category.create({ data: { name: 'NestJS' } }),
        prisma.category.create({ data: { name: 'Database' } }),
        prisma.category.create({ data: { name: 'DevOps' } }),
        prisma.category.create({ data: { name: 'Algorithm' } }),
        prisma.category.create({ data: { name: 'Design' } }),
    ]);
    console.log(`Created ${categories.length} categories`);
    const allUsers = [admin, ...users];
    const posts = [];
    const postTemplates = [
        {
            title: 'NestJS 시작하기',
            subtitle: '백엔드 프레임워크의 새로운 선택',
            content: `# NestJS란?

NestJS는 효율적이고 확장 가능한 Node.js 서버 애플리케이션을 구축하기 위한 프레임워크입니다.

## 주요 특징
- TypeScript 완벽 지원
- 모듈 기반 아키텍처
- Dependency Injection
- 데코레이터 기반 라우팅

## 시작하기
\`\`\`bash
npm i -g @nestjs/cli
nest new project-name
\`\`\`

프로젝트 생성 후 바로 개발을 시작할 수 있습니다.`,
            categoryIds: [categories[3].id],
        },
        {
            title: 'React Hooks 완벽 가이드',
            subtitle: '함수형 컴포넌트의 모든 것',
            content: `# React Hooks

Hooks는 React 16.8에서 추가된 새로운 기능입니다.

## useState
상태 관리를 위한 가장 기본적인 Hook입니다.

\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

## useEffect
사이드 이펙트를 처리하기 위한 Hook입니다.

\`\`\`jsx
useEffect(() => {
  // 실행할 코드
}, [dependencies]);
\`\`\``,
            categoryIds: [categories[2].id],
        },
        {
            title: 'TypeScript 고급 타입',
            subtitle: '타입 시스템 마스터하기',
            content: `# TypeScript 고급 타입

TypeScript의 강력한 타입 시스템을 활용해봅시다.

## Utility Types
- Partial<T>
- Required<T>
- Pick<T, K>
- Omit<T, K>

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
\`\`\``,
            categoryIds: [categories[1].id],
        },
        {
            title: 'PostgreSQL 성능 최적화',
            subtitle: '쿼리 최적화와 인덱싱 전략',
            content: `# PostgreSQL 성능 최적화

데이터베이스 성능을 향상시키는 방법을 알아봅시다.

## 인덱스 활용
적절한 인덱스는 쿼리 성능을 크게 향상시킵니다.

\`\`\`sql
CREATE INDEX idx_user_email ON users(email);
\`\`\`

## EXPLAIN ANALYZE
쿼리 실행 계획을 분석하여 병목 지점을 찾습니다.`,
            categoryIds: [categories[4].id],
        },
        {
            title: 'Docker로 개발 환경 구축하기',
            subtitle: '컨테이너 기반 개발 환경',
            content: `# Docker 개발 환경

Docker를 사용하여 일관된 개발 환경을 구축해봅시다.

## Dockerfile 작성
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
\`\`\`

## docker-compose.yml
여러 컨테이너를 함께 관리합니다.`,
            categoryIds: [categories[5].id],
        },
        {
            title: 'JavaScript 비동기 처리',
            subtitle: 'Promise와 async/await 완벽 이해',
            content: `# JavaScript 비동기 처리

비동기 프로그래밍의 핵심 개념을 알아봅시다.

## Promise
\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  // 비동기 작업
});
\`\`\`

## async/await
더 읽기 쉬운 비동기 코드를 작성할 수 있습니다.

\`\`\`javascript
async function fetchData() {
  const data = await fetch('/api/data');
  return data.json();
}
\`\`\``,
            categoryIds: [categories[0].id],
        },
        {
            title: '알고리즘: 동적 프로그래밍',
            subtitle: 'DP 문제 해결 전략',
            content: `# 동적 프로그래밍

복잡한 문제를 작은 문제로 나누어 해결하는 기법입니다.

## 피보나치 수열
\`\`\`javascript
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 2) return 1;

  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}
\`\`\``,
            categoryIds: [categories[6].id],
        },
        {
            title: 'UI/UX 디자인 원칙',
            subtitle: '사용자 중심 디자인',
            content: `# UI/UX 디자인 원칙

좋은 사용자 경험을 만드는 핵심 원칙들입니다.

## 일관성
디자인 요소들이 일관되게 사용되어야 합니다.

## 피드백
사용자의 행동에 즉각적인 피드백을 제공합니다.

## 단순성
불필요한 요소를 제거하고 핵심에 집중합니다.`,
            categoryIds: [categories[7].id],
        },
    ];
    for (let i = 0; i < 30; i++) {
        const template = postTemplates[i % postTemplates.length];
        const user = allUsers[i % allUsers.length];
        const post = await prisma.post.create({
            data: {
                title: `${template.title} ${i > 7 ? `(Part ${Math.floor(i / 8) + 1})` : ''}`,
                subtitle: template.subtitle,
                content: template.content,
                thumbnail: `https://picsum.photos/seed/${i}/800/400`,
                userId: user.id,
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                views: Math.floor(Math.random() * 1000),
                categories: {
                    create: template.categoryIds.map((categoryId) => ({
                        category: { connect: { id: categoryId } },
                    })),
                },
            },
        });
        posts.push(post);
    }
    console.log(`Created ${posts.length} posts`);
    const comments = [];
    const commentTexts = [
        '좋은 글 감사합니다!',
        '많은 도움이 되었습니다.',
        '이 부분이 이해가 안 되는데 설명 부탁드립니다.',
        '저도 같은 문제를 겪었는데 해결했습니다.',
        '다음 편이 기대됩니다!',
        '실무에 바로 적용할 수 있을 것 같아요.',
        '코드 예시가 정말 유용하네요.',
        '이 방법은 성능 이슈가 있지 않을까요?',
    ];
    for (const post of posts) {
        const commentCount = Math.floor(Math.random() * 8) + 2;
        for (let i = 0; i < commentCount; i++) {
            const user = allUsers[Math.floor(Math.random() * allUsers.length)];
            const comment = await prisma.comment.create({
                data: {
                    content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
                    postId: post.id,
                    userId: user.id,
                },
            });
            comments.push(comment);
            if (Math.random() > 0.7) {
                const replyUser = allUsers[Math.floor(Math.random() * allUsers.length)];
                await prisma.comment.create({
                    data: {
                        content: '답변 감사합니다!',
                        postId: post.id,
                        userId: replyUser.id,
                        parentId: comment.id,
                    },
                });
            }
        }
    }
    console.log(`Created ${comments.length} comments`);
    let likesCount = 0;
    for (const post of posts) {
        const likeCount = Math.floor(Math.random() * allUsers.length);
        const shuffledUsers = [...allUsers].sort(() => Math.random() - 0.5);
        for (let i = 0; i < likeCount; i++) {
            await prisma.like.create({
                data: {
                    postId: post.id,
                    userId: shuffledUsers[i].id,
                },
            });
            likesCount++;
        }
    }
    console.log(`Created ${likesCount} likes`);
    console.log('Seeding completed!');
    console.log('---');
    console.log('Login credentials:');
    console.log('Admin - email: admin@example.com, password: password123');
    console.log('User 1 - email: john@example.com, password: password123');
    console.log('User 2 - email: jane@example.com, password: password123');
    console.log('User 3 - email: bob@example.com, password: password123');
    console.log('User 4 - email: alice@example.com, password: password123');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map