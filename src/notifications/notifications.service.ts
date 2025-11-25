import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  // 알림 생성
  async createNotification(
    type: NotificationType,
    content: string,
    userId: string,
    actorId: string,
    postId?: string,
    commentId?: string,
  ) {
    // 자기 자신에게는 알림 안 보냄
    if (userId === actorId) {
      return null;
    }

    const notification = await this.prisma.notification.create({
      data: {
        type,
        content,
        userId,
        actorId,
        postId,
        commentId,
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // WebSocket으로 실시간 알림 전송
    this.notificationsGateway.sendNotificationToUser(userId, notification);

    return notification;
  }

  // 사용자의 알림 목록 조회
  async getUserNotifications(userId: string, limit: number = 20) {
    return this.prisma.notification.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  // 읽지 않은 알림 개수
  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  // 알림 읽음 처리
  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error('알림을 찾을 수 없습니다.');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  // 모든 알림 읽음 처리
  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  // 알림 삭제
  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error('알림을 찾을 수 없습니다.');
    }

    return this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }
}
