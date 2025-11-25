import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserFromJwt } from '../auth/interfaces/user-from-jwt.interface';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  toggle(@Param('postId') postId: string, @CurrentUser() user: UserFromJwt) {
    return this.likesService.toggle(user.id, postId);
  }

  @Get('post/:postId')
  getPostLikes(@Param('postId') postId: string) {
    return this.likesService.getPostLikes(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check/:postId')
  checkUserLike(
    @Param('postId') postId: string,
    @CurrentUser() user: UserFromJwt,
  ) {
    return this.likesService.checkUserLike(user.id, postId);
  }
}
