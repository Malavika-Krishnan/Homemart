import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { SyncService } from '../services/sync.service';
import { sendResponse } from '../utils/apiResponse';
import { asyncWrapper } from '../utils/asyncWrapper';

export const syncOfflineDataController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await SyncService.processOfflineBatch(
      req.user!._id.toString(),
      req.user!.familyId!.toString(),
      req.body
    );

    sendResponse({
      res,
      statusCode: 200,
      message: 'Offline synchronization completed',
      data: result,
    });
  }
);
