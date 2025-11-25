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
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserFromJwt } from '../auth/interfaces/user-from-jwt.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: UserFromJwt,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(user.id, createPostDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.postsService.findAll(page, limit, categoryId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('incrementView', new DefaultValuePipe(false)) incrementView: boolean,
  ) {
    return this.postsService.findOne(id, incrementView);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @CurrentUser() user: UserFromJwt,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, user.id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: UserFromJwt) {
    return this.postsService.remove(id, user.id);
  }
}
