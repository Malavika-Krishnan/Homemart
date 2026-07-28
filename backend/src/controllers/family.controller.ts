import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { FamilyService } from '../services/family.service';
import { sendResponse } from '../utils/apiResponse';
import { asyncWrapper } from '../utils/asyncWrapper';

export const createFamilyController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const family = await FamilyService.createFamily(req.user!._id.toString(), req.body.name);
    sendResponse({
      res,
      statusCode: 201,
      message: 'Family created successfully',
      data: family,
    });
  }
);

export const joinFamilyController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const family = await FamilyService.joinFamily(req.user!._id.toString(), req.body.inviteCode);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Joined family successfully',
      data: family,
    });
  }
);

export const getFamilyDetailsController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const family = await FamilyService.getFamilyDetails(req.user!.familyId!.toString());
    sendResponse({
      res,
      statusCode: 200,
      message: 'Family details retrieved successfully',
      data: family,
    });
  }
);

export const generateInviteCodeController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await FamilyService.generateInviteCode(
      req.user!.familyId!.toString(),
      req.user!._id.toString()
    );
    sendResponse({
      res,
      statusCode: 200,
      message: 'Invite code generated successfully',
      data: result,
    });
  }
);

export const inviteMemberController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await FamilyService.inviteMember(
      req.user!.familyId!.toString(),
      req.user!._id.toString(),
      req.body.email
    );
    sendResponse({
      res,
      statusCode: 200,
      message: 'Invitation sent to user successfully',
    });
  }
);

export const removeMemberController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const family = await FamilyService.removeMember(
      req.user!.familyId!.toString(),
      req.user!._id.toString(),
      req.params.memberId as string
    );
    sendResponse({
      res,
      statusCode: 200,
      message: 'Member removed from family successfully',
      data: family,
    });
  }
);

export const manageMemberRoleController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const family = await FamilyService.manageMemberRole(
      req.user!.familyId!.toString(),
      req.user!._id.toString(),
      req.params.memberId as string,
      req.body.role
    );
    sendResponse({
      res,
      statusCode: 200,
      message: 'Member role updated successfully',
      data: family,
    });
  }
);

export const leaveFamilyController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await FamilyService.leaveFamily(
      req.user!._id.toString(),
      req.user!.familyId!.toString()
    );
    sendResponse({
      res,
      statusCode: 200,
      message: 'Left family successfully',
    });
  }
);
