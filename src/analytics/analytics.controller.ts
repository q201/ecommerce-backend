import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { ReportPeriod } from './entities/sales-report.entity';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Sales Analytics
  @Post('sales/report')
  @ApiOperation({ summary: 'Generate sales report' })
  @ApiResponse({ status: 201, description: 'Sales report generated successfully' })
  generateSalesReport(
    @Body() body: { startDate: string; endDate: string; period?: ReportPeriod }
  ) {
    return this.analyticsService.generateSalesReport(
      new Date(body.startDate),
      new Date(body.endDate),
      body.period
    );
  }

  @Get('sales/reports')
  @ApiOperation({ summary: 'Get sales reports' })
  @ApiResponse({ status: 200, description: 'List of sales reports' })
  getSalesReports(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('period') period?: ReportPeriod
  ) {
    return this.analyticsService.getSalesReports(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      period
    );
  }

  @Get('sales/summary')
  @ApiOperation({ summary: 'Get sales summary' })
  @ApiResponse({ status: 200, description: 'Sales summary' })
  getSalesSummary(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.analyticsService.getSalesSummary(
      new Date(startDate),
      new Date(endDate)
    );
  }

  // User Analytics
  @Post('user/:userId/activity')
  @ApiOperation({ summary: 'Track user activity' })
  @ApiResponse({ status: 201, description: 'User activity tracked successfully' })
  trackUserActivity(
    @Param('userId') userId: string,
    @Body() activityData: any
  ) {
    return this.analyticsService.trackUserActivity(userId, activityData);
  }

  @Get('user/:userId/analytics')
  @ApiOperation({ summary: 'Get user analytics' })
  @ApiResponse({ status: 200, description: 'User analytics data' })
  getUserAnalytics(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.analyticsService.getUserAnalytics(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }

  @Get('users/top')
  @ApiOperation({ summary: 'Get top users' })
  @ApiResponse({ status: 200, description: 'Top users by spending' })
  getTopUsers(@Query('limit') limit?: number) {
    return this.analyticsService.getTopUsers(limit);
  }

  // Product Analytics
  @Post('product/:productId/activity')
  @ApiOperation({ summary: 'Track product activity' })
  @ApiResponse({ status: 201, description: 'Product activity tracked successfully' })
  trackProductActivity(
    @Param('productId') productId: string,
    @Body() activityData: any
  ) {
    return this.analyticsService.trackProductActivity(productId, activityData);
  }

  @Get('product/:productId/analytics')
  @ApiOperation({ summary: 'Get product analytics' })
  @ApiResponse({ status: 200, description: 'Product analytics data' })
  getProductAnalytics(
    @Param('productId') productId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.analyticsService.getProductAnalytics(
      productId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }

  @Get('products/top')
  @ApiOperation({ summary: 'Get top products' })
  @ApiResponse({ status: 200, description: 'Top products by metric' })
  getTopProducts(
    @Query('limit') limit?: number,
    @Query('metric') metric?: 'revenue' | 'views' | 'conversionRate'
  ) {
    return this.analyticsService.getTopProducts(limit, metric);
  }

  // Dashboard Analytics
  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics' })
  getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('realtime')
  @ApiOperation({ summary: 'Get real-time statistics' })
  @ApiResponse({ status: 200, description: 'Real-time statistics' })
  getRealTimeStats() {
    return this.analyticsService.getRealTimeStats();
  }

  // Custom Analytics
  @Get('custom')
  @ApiOperation({ summary: 'Get custom analytics query' })
  @ApiResponse({ status: 200, description: 'Custom analytics data' })
  getCustomAnalytics(@Query() query: any) {
    // This would handle custom analytics queries
    return {
      message: 'Custom analytics endpoint - implement based on query parameters',
      query,
    };
  }
} 