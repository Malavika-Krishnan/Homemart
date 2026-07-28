import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { UserService } from '../services/user.service';
import { sendResponse } from '../utils/apiResponse';
import { asyncWrapper } from '../utils/asyncWrapper';

export const getProfileController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = await UserService.getProfile(req.user!._id.toString());
    sendResponse({
      res,
      statusCode: 200,
      message: 'Profile details retrieved successfully',
      data: user,
    });
  }
);

export const updateProfileController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const updatedUser = await UserService.updateProfile(req.user!._id.toString(), req.body);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  }
);

export const updateAvatarController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const updatedUser = await UserService.updateAvatar(req.user!._id.toString(), req.body);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Profile picture updated successfully',
      data: updatedUser,
    });
  }
);

export const changePasswordController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await UserService.changePassword(req.user!._id.toString(), req.body);
    sendResponse({
      res,
      statusCode: 200,
      message: 'Password changed successfully',
    });
  }
);
