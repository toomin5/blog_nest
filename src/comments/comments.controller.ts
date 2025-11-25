import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserFromJwt } from '../auth/interfaces/user-from-jwt.interface';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: UserFromJwt,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(user.id, createCommentDto);
  }

  @Get('post/:postId')
  findByPostId(@Param('postId') postId: string) {
    return this.commentsService.findByPostId(postId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: UserFromJwt,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, user.id, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserFromJwt) {
    const isAdmin = user.role === 'ADMIN';
    return this.commentsService.remove(id, user.id, isAdmin);
  }
}
