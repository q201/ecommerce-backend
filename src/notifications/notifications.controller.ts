import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dtos/create-notification.dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Post('template/:templateCode')
  @ApiOperation({ summary: 'Create notification from template' })
  @ApiResponse({ status: 201, description: 'Notification created from template' })
  createFromTemplate(
    @Param('templateCode') templateCode: string,
    @Body() body: { userId: string; variables: Record<string, any>; recipientInfo?: any }
  ) {
    return this.notificationsService.createFromTemplate(
      body.userId,
      templateCode,
      body.variables,
      body.recipientInfo
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ status: 200, description: 'List of all notifications' })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get notifications by user ID' })
  @ApiResponse({ status: 200, description: 'User notifications' })
  findByUser(@Param('userId') userId: string) {
    return this.notificationsService.findByUser(userId);
  }

  @Get('user/:userId/unread')
  @ApiOperation({ summary: 'Get unread notifications by user ID' })
  @ApiResponse({ status: 200, description: 'Unread user notifications' })
  findUnreadByUser(@Param('userId') userId: string) {
    return this.notificationsService.findUnreadByUser(userId);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending notifications' })
  @ApiResponse({ status: 200, description: 'Pending notifications' })
  getPendingNotifications() {
    return this.notificationsService.getPendingNotifications();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get notification statistics' })
  @ApiResponse({ status: 200, description: 'Notification statistics' })
  getNotificationStats(@Query('userId') userId?: string) {
    return this.notificationsService.getNotificationStats(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({ status: 200, description: 'Notification found' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Put('user/:userId/read-all')
  @ApiOperation({ summary: 'Mark all user notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  markAllAsRead(@Param('userId') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Send notification' })
  @ApiResponse({ status: 200, description: 'Notification sent successfully' })
  sendNotification(@Param('id') id: string) {
    return this.notificationsService.sendNotification(id);
  }

  @Delete('cleanup')
  @ApiOperation({ summary: 'Delete old notifications' })
  @ApiResponse({ status: 200, description: 'Old notifications deleted' })
  deleteOldNotifications(@Query('daysOld') daysOld: number = 30) {
    return this.notificationsService.deleteOldNotifications(daysOld);
  }
} 