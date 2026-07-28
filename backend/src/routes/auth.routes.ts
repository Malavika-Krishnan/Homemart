import { Router } from 'express';
import { registerController, loginController, logoutController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { authRateLimiter } from '../middlewares/rateLimiter.middleware';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', authRateLimiter, validateRequest(registerSchema), registerController);
router.post('/login', authRateLimiter, validateRequest(loginSchema), loginController);
router.post('/logout', authenticateJWT, logoutController);

export default router;
