import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import familyRoutes from './family.routes';
import listRoutes from './list.routes';
import itemRoutes from './item.routes';
import notificationRoutes from './notification.routes';
import syncRoutes from './sync.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/families', familyRoutes);
router.use('/lists', listRoutes);
router.use('/items', itemRoutes);
router.use('/notifications', notificationRoutes);
router.use('/sync', syncRoutes);

export default router;
