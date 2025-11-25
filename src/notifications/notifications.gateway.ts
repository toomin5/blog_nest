import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // 프로덕션에서는 특정 도메인만 허용
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // 사용자 ID와 소켓 ID 매핑 (메모리에 저장)
  private userSockets: Map<string, string[]> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    // 클라이언트가 userId를 쿼리로 전달
    const userId = client.handshake.query.userId as string;

    if (userId) {
      const sockets = this.userSockets.get(userId) || [];
      sockets.push(client.id);
      this.userSockets.set(userId, sockets);
      console.log(`User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    // 연결 해제 시 매핑에서 제거
    for (const [userId, sockets] of this.userSockets.entries()) {
      const filtered = sockets.filter((socketId) => socketId !== client.id);
      if (filtered.length === 0) {
        this.userSockets.delete(userId);
      } else {
        this.userSockets.set(userId, filtered);
      }
    }
  }

  // 특정 사용자에게 알림 전송
  sendNotificationToUser(userId: string, notification: any) {
    const sockets = this.userSockets.get(userId);

    if (sockets && sockets.length > 0) {
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit('notification', notification);
      });
      console.log(`Sent notification to user ${userId}`);
    }
  }
}
