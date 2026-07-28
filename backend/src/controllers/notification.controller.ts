import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { NotificationService } from '../services/notification.service';
import { sendResponse } from '../utils/apiResponse';
import { asyncWrapper } from '../utils/asyncWrapper';

export const getUserNotificationsController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const result = await NotificationService.getUserNotifications(
      req.user!._id.toString(),
      page,
      limit
    );

    sendResponse({
      res,
      statusCode: 200,
      message: 'Notifications retrieved successfully',
      data: result.notifications,
      meta: {
        total: result.total,
        page,
        limit,
        unreadCount: result.unreadCount,
      },
    });
  }
);

export const markNotificationAsReadController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const notification = await NotificationService.markAsRead(
      req.params.id as string,
      req.user!._id.toString()
    );

    sendResponse({
      res,
      statusCode: 200,
      message: 'Notification marked as read',
      data: notification,
    });
  }
);

export const markAllNotificationsAsReadController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await NotificationService.markAllAsRead(req.user!._id.toString());

    sendResponse({
      res,
      statusCode: 200,
      message: 'All notifications marked as read',
      data: result,
    });
  }
);
