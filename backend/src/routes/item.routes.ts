import { Router } from 'express';
import {
  addItemController,
  getListItemsController,
  editItemController,
  updateQuantityController,
  updatePriorityController,
  togglePurchaseStatusController,
  deleteItemController,
} from '../controllers/item.controller';
import { authenticateJWT, requireFamily } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import {
  addItemSchema,
  editItemSchema,
  updateQuantitySchema,
  updatePrioritySchema,
} from '../validators/item.validator';

const router = Router();

router.use(authenticateJWT);
router.use(requireFamily);

router.post('/', validateRequest(addItemSchema), addItemController);
router.get('/list/:listId', getListItemsController);
router.put('/:id', validateRequest(editItemSchema), editItemController);
router.patch('/:id/quantity', validateRequest(updateQuantitySchema), updateQuantityController);
router.patch('/:id/priority', validateRequest(updatePrioritySchema), updatePriorityController);
router.patch('/:id/toggle-purchase', togglePurchaseStatusController);
router.delete('/:id', deleteItemController);

export default router;
