import { Router } from 'express';
import {
  createFamilyController,
  joinFamilyController,
  getFamilyDetailsController,
  generateInviteCodeController,
  inviteMemberController,
  removeMemberController,
  manageMemberRoleController,
  leaveFamilyController,
} from '../controllers/family.controller';
import { authenticateJWT, requireFamily } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import {
  createFamilySchema,
  joinFamilySchema,
  inviteMemberSchema,
  manageRoleSchema,
} from '../validators/family.validator';

const router = Router();

router.use(authenticateJWT);

router.post('/create', validateRequest(createFamilySchema), createFamilyController);
router.post('/join', validateRequest(joinFamilySchema), joinFamilyController);

router.use(requireFamily);

router.get('/', getFamilyDetailsController);
router.post('/invite-code', generateInviteCodeController);
router.post('/invite', validateRequest(inviteMemberSchema), inviteMemberController);
router.delete('/members/:memberId', removeMemberController);
router.patch('/members/:memberId/role', validateRequest(manageRoleSchema), manageMemberRoleController);
router.post('/leave', leaveFamilyController);

export default router;
