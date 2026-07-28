import { Router } from 'express';
import {
  getProfileController,
  updateProfileController,
  updateAvatarController,
  changePasswordController,
} from '../controllers/user.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import {
  updateProfileSchema,
  updateAvatarSchema,
  changePasswordSchema,
} from '../validators/user.validator';

const router = Router();

router.use(authenticateJWT);

router.get('/profile', getProfileController);
router.put('/profile', validateRequest(updateProfileSchema), updateProfileController);
router.patch('/avatar', validateRequest(updateAvatarSchema), updateAvatarController);
router.post('/change-password', validateRequest(changePasswordSchema), changePasswordController);

export default router;
