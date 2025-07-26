import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus, NotificationType } from './entities/notification.entity';
import { NotificationTemplate } from './entities/notification-template.entity';
import { CreateNotificationDto } from './dtos/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationTemplate)
    private templateRepository: Repository<NotificationTemplate>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(createNotificationDto);
    
    if (createNotificationDto.scheduledAt) {
      notification.scheduledAt = new Date(createNotificationDto.scheduledAt);
    }
    
    return await this.notificationRepository.save(notification);
  }

  async createFromTemplate(
    userId: string,
    templateCode: string,
    variables: Record<string, any>,
    recipientInfo?: { email?: string; phone?: string; deviceToken?: string }
  ): Promise<Notification> {
    const template = await this.templateRepository.findOne({
      where: { code: templateCode, isActive: true },
    });

    if (!template) {
      throw new NotFoundException(`Template with code ${templateCode} not found`);
    }

    // Replace variables in content
    let content = template.content;
    let title = template.subject;
    let smsContent = template.smsContent;
    let pushContent = template.pushContent;
    let inAppContent = template.inAppContent;

    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, variables[key]);
      title = title.replace(regex, variables[key]);
      if (smsContent) smsContent = smsContent.replace(regex, variables[key]);
      if (pushContent) pushContent = pushContent.replace(regex, variables[key]);
      if (inAppContent) inAppContent = inAppContent.replace(regex, variables[key]);
    });

    const notification = this.notificationRepository.create({
      userId,
      type: template.type,
      category: template.category,
      title,
      message: content,
      templateId: template.id,
      recipientEmail: recipientInfo?.email,
      recipientPhone: recipientInfo?.phone,
      deviceToken: recipientInfo?.deviceToken,
      data: variables,
    });

    return await this.notificationRepository.save(notification);
  }

  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findUnreadByUser(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { userId, status: NotificationStatus.SENT },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.status = NotificationStatus.READ;
    notification.readAt = new Date();
    return await this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, status: NotificationStatus.SENT },
      { status: NotificationStatus.READ, readAt: new Date() }
    );
  }

  async sendNotification(id: string): Promise<Notification> {
    const notification = await this.findOne(id);
    
    try {
      // Simulate sending notification based on type
      switch (notification.type) {
        case NotificationType.EMAIL:
          await this.sendEmail(notification);
          break;
        case NotificationType.SMS:
          await this.sendSMS(notification);
          break;
        case NotificationType.PUSH:
          await this.sendPushNotification(notification);
          break;
        case NotificationType.IN_APP:
          await this.sendInAppNotification(notification);
          break;
      }

      notification.status = NotificationStatus.SENT;
      notification.sentAt = new Date();
    } catch (error) {
      notification.status = NotificationStatus.FAILED;
      notification.errorMessage = error.message;
      notification.retryCount += 1;
    }

    return await this.notificationRepository.save(notification);
  }

  async getPendingNotifications(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { status: NotificationStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }

  async getNotificationStats(userId?: string): Promise<any> {
    const query = this.notificationRepository.createQueryBuilder('notification');
    
    if (userId) {
      query.where('notification.userId = :userId', { userId });
    }

    const stats = await query
      .select('notification.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('notification.status')
      .getRawMany();

    return stats.reduce((acc, stat) => {
      acc[stat.status] = parseInt(stat.count);
      return acc;
    }, {});
  }

  async deleteOldNotifications(daysOld: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await this.notificationRepository.delete({
      createdAt: cutoffDate,
      status: NotificationStatus.READ,
    });
  }

  // Private methods for sending different types of notifications
  private async sendEmail(notification: Notification): Promise<void> {
    // Implement email sending logic (e.g., using Nodemailer)
    console.log(`Sending email to ${notification.recipientEmail}: ${notification.title}`);
  }

  private async sendSMS(notification: Notification): Promise<void> {
    // Implement SMS sending logic (e.g., using Twilio)
    console.log(`Sending SMS to ${notification.recipientPhone}: ${notification.message}`);
  }

  private async sendPushNotification(notification: Notification): Promise<void> {
    // Implement push notification logic (e.g., using Firebase)
    console.log(`Sending push notification to ${notification.deviceToken}: ${notification.title}`);
  }

  private async sendInAppNotification(notification: Notification): Promise<void> {
    // Implement in-app notification logic
    console.log(`Sending in-app notification to user ${notification.userId}: ${notification.title}`);
  }
} 