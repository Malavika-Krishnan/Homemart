import { Types } from 'mongoose';
import { Notification, INotification, NotificationType } from '../models/notification.model';
import { NotFoundError } from '../utils/customError';

export class NotificationService {
  public static async createNotification(
    userId: Types.ObjectId | string,
    type: NotificationType,
    title: string,
    message: string,
    familyId?: Types.ObjectId | string,
    data?: Record<string, any>
  ): Promise<INotification> {
    return Notification.create({
      userId: new Types.ObjectId(userId),
      familyId: familyId ? new Types.ObjectId(familyId) : undefined,
      type,
      title,
      message,
      data,
    });
  }

  public static async notifyFamilyMembers(
    familyId: Types.ObjectId | string,
    senderId: Types.ObjectId | string,
    type: NotificationType,
    title: string,
    message: string,
    memberUserIds: Array<Types.ObjectId | string>,
    data?: Record<string, any>
  ): Promise<void> {
    const notificationsToCreate = memberUserIds
      .filter((id) => id.toString() !== senderId.toString())
      .map((userId) => ({
        userId: new Types.ObjectId(userId),
        familyId: new Types.ObjectId(familyId),
        type,
        title,
        message,
        data,
      }));

    if (notificationsToCreate.length > 0) {
      await Notification.insertMany(notificationsToCreate);
    }
  }

  public static async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ notifications: INotification[]; total: number; unreadCount: number }> {
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ userId: new Types.ObjectId(userId) }),
      Notification.countDocuments({ userId: new Types.ObjectId(userId), isRead: false }),
    ]);

    return { notifications, total, unreadCount };
  }

  public static async markAsRead(notificationId: string, userId: string): Promise<INotification> {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: new Types.ObjectId(userId) },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    return notification;
  }

  public static async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    const result = await Notification.updateMany(
      { userId: new Types.ObjectId(userId), isRead: false },
      { isRead: true }
    );

    return { modifiedCount: result.modifiedCount };
  }
}
