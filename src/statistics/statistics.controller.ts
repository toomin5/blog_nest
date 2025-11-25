import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('popular/views')
  getPopularPostsByViews(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.statisticsService.getPopularPostsByViews(limit);
  }

  @Get('popular/likes')
  getPopularPostsByLikes(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.statisticsService.getPopularPostsByLikes(limit);
  }

  @Get('user/:userId')
  getUserStatistics(@Param('userId') userId: string) {
    return this.statisticsService.getUserStatistics(userId);
  }

  @Get('categories')
  getCategoryStatistics() {
    return this.statisticsService.getCategoryStatistics();
  }

  @Get('overall')
  getOverallStatistics() {
    return this.statisticsService.getOverallStatistics();
  }
}
