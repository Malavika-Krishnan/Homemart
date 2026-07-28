import { Router } from 'express';
import {
  getUserNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
} from '../controllers/notification.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getUserNotificationsController);
router.patch('/:id/read', markNotificationAsReadController);
router.patch('/read-all', markAllNotificationsAsReadController);

export default router;
