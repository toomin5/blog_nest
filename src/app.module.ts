import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { StatisticsModule } from './statistics/statistics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CacheModule } from './cache/cache.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    StatisticsModule,
    NotificationsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
