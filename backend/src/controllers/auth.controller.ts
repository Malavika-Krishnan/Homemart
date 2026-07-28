import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/apiResponse';
import { asyncWrapper } from '../utils/asyncWrapper';

export const registerController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await AuthService.register(req.body);
    sendResponse({
      res,
      statusCode: 201,
      message: 'User registered successfully',
      data: result,
    });
  }
);

export const loginController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await AuthService.login(req.body);
    sendResponse({
      res,
      statusCode: 200,
      message: 'User logged in successfully',
      data: result,
    });
  }
);

export const logoutController = asyncWrapper(
  async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Client invalidates token locally
    sendResponse({
      res,
      statusCode: 200,
      message: 'User logged out successfully',
    });
  }
);
