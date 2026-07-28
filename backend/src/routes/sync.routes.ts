import { Router } from 'express';
import { syncOfflineDataController } from '../controllers/sync.controller';
import { authenticateJWT, requireFamily } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { syncBatchSchema } from '../validators/sync.validator';

const router = Router();

router.use(authenticateJWT);
router.use(requireFamily);

router.post('/', validateRequest(syncBatchSchema), syncOfflineDataController);

export default router;
