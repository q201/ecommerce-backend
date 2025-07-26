import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsObject, IsDateString } from 'class-validator';
import { NotificationType, NotificationCategory } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Notification type', enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'Notification category', enum: NotificationCategory })
  @IsEnum(NotificationCategory)
  category: NotificationCategory;

  @ApiProperty({ description: 'Notification title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Additional data', required: false })
  @IsOptional()
  @IsObject()
  data?: any;

  @ApiProperty({ description: 'Recipient email', required: false })
  @IsOptional()
  @IsString()
  recipientEmail?: string;

  @ApiProperty({ description: 'Recipient phone', required: false })
  @IsOptional()
  @IsString()
  recipientPhone?: string;

  @ApiProperty({ description: 'Device token for push notifications', required: false })
  @IsOptional()
  @IsString()
  deviceToken?: string;

  @ApiProperty({ description: 'Template ID', required: false })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiProperty({ description: 'Scheduled date', required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
} 