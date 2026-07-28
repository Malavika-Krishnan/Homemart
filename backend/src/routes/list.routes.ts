import { Router } from 'express';
import {
  createListController,
  getFamilyListsController,
  getListByIdController,
  updateListController,
  deleteListController,
} from '../controllers/list.controller';
import { authenticateJWT, requireFamily } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createListSchema, updateListSchema } from '../validators/list.validator';

const router = Router();

router.use(authenticateJWT);
router.use(requireFamily);

router.post('/', validateRequest(createListSchema), createListController);
router.get('/', getFamilyListsController);
router.get('/:id', getListByIdController);
router.put('/:id', validateRequest(updateListSchema), updateListController);
router.delete('/:id', deleteListController);

export default router;
