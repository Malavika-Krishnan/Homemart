import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ListService } from '../services/list.service';
import { sendResponse } from '../utils/apiResponse';
import { asyncWrapper } from '../utils/asyncWrapper';

export const createListController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const list = await ListService.createList(
      req.user!.familyId!.toString(),
      req.user!._id.toString(),
      req.body
    );
    sendResponse({
      res,
      statusCode: 201,
      message: 'Shopping list created successfully',
      data: list,
    });
  }
);

export const getFamilyListsController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const lists = await ListService.getFamilyLists(req.user!.familyId!.toString());
    sendResponse({
      res,
      statusCode: 200,
      message: 'Shopping lists retrieved successfully',
      data: lists,
    });
  }
);

export const getListByIdController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const list = await ListService.getListById(
      req.params.id as string,
      req.user!.familyId!.toString()
    );
    sendResponse({
      res,
      statusCode: 200,
      message: 'Shopping list details retrieved successfully',
      data: list,
    });
  }
);

export const updateListController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const list = await ListService.updateList(
      req.params.id as string,
      req.user!.familyId!.toString(),
      req.body
    );
    sendResponse({
      res,
      statusCode: 200,
      message: 'Shopping list updated successfully',
      data: list,
    });
  }
);

export const deleteListController = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await ListService.deleteList(
      req.params.id as string,
      req.user!.familyId!.toString()
    );
    sendResponse({
      res,
      statusCode: 200,
      message: 'Shopping list deleted successfully',
    });
  }
);
