import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ItemService } from '../services/item.service';
import { sendResponse } from '../utils/apiResponse';
import { asyncWrapper } from '../utils/asyncWrapper';

export const addItemController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const item = await ItemService.addItem(
      req.user!.familyId!.toString(),
      req.user!._id.toString(),
      req.body
    );
    sendResponse({
      res,
      statusCode: 201,
      message: 'Item added to shopping list successfully',
      data: item,
    });
  }
);

export const getListItemsController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const items = await ItemService.getListItems(
      req.params.listId as string,
      req.user!.familyId!.toString(),
      req.query.category as string,
      req.query.search as string
    );
    sendResponse({
      res,
      statusCode: 200,
      message: 'Shopping list items retrieved successfully',
      data: items,
    });
  }
);

export const editItemController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const item = await ItemService.editItem(
      req.params.id as string,
      req.user!.familyId!.toString(),
      req.user!._id.toString(),
      req.body
    );
    sendResponse({
      res,
      statusCode: 200,
      message: 'Shopping item updated successfully',
      data: item,
    });
  }
);

export const updateQuantityController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const item = await ItemService.updateQuantity(
      req.params.id as string,
      req.user!.familyId!.toString(),
      req.body
    );
    sendResponse({
      res,
      statusCode: 200,
      message: 'Item quantity updated successfully',
      data: item,
    });
  }
);

export const updatePriorityController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const item = await ItemService.updatePriority(
      req.params.id as string,
      req.user!.familyId!.toString(),
      req.body
    );
    sendResponse({
      res,
      statusCode: 200,
      message: 'Item priority updated successfully',
      data: item,
    });
  }
);

export const togglePurchaseStatusController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const item = await ItemService.togglePurchaseStatus(
      req.params.id as string,
      req.user!.familyId!.toString(),
      req.user!._id.toString()
    );
    sendResponse({
      res,
      statusCode: 200,
      message: `Item status toggled to ${item.isPurchased ? 'purchased' : 'unpurchased'}`,
      data: item,
    });
  }
);

export const deleteItemController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await ItemService.deleteItem(
      req.params.id as string,
      req.user!.familyId!.toString()
    );
    sendResponse({
      res,
      statusCode: 200,
      message: 'Shopping item deleted successfully',
    });
  }
);
