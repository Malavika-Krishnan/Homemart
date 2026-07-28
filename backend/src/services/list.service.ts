import { Types } from 'mongoose';
import { ShoppingList, IShoppingList } from '../models/list.model';
import { ShoppingItem } from '../models/item.model';
import { NotFoundError, ForbiddenError } from '../utils/customError';
import { CreateListInput, UpdateListInput } from '../validators/list.validator';

export class ListService {
  public static async createList(
    familyId: string,
    userId: string,
    data: CreateListInput
  ): Promise<IShoppingList> {
    return ShoppingList.create({
      name: data.name,
      description: data.description || '',
      color: data.color || '#3B82F6',
      familyId: new Types.ObjectId(familyId),
      createdBy: new Types.ObjectId(userId),
    });
  }

  public static async getFamilyLists(familyId: string): Promise<IShoppingList[]> {
    return ShoppingList.find({
      familyId: new Types.ObjectId(familyId),
      isArchived: false,
    }).sort({ updatedAt: -1 });
  }

  public static async getListById(listId: string, familyId: string): Promise<IShoppingList> {
    const list = await ShoppingList.findOne({
      _id: listId,
      familyId: new Types.ObjectId(familyId),
    });

    if (!list) {
      throw new NotFoundError('Shopping list not found');
    }
    return list;
  }

  public static async updateList(
    listId: string,
    familyId: string,
    data: UpdateListInput
  ): Promise<IShoppingList> {
    const list = await ShoppingList.findOneAndUpdate(
      { _id: listId, familyId: new Types.ObjectId(familyId) },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!list) {
      throw new NotFoundError('Shopping list not found');
    }
    return list;
  }

  public static async deleteList(listId: string, familyId: string): Promise<void> {
    const list = await ShoppingList.findOneAndDelete({
      _id: listId,
      familyId: new Types.ObjectId(familyId),
    });

    if (!list) {
      throw new NotFoundError('Shopping list not found');
    }

    // Delete associated items
    await ShoppingItem.deleteMany({ listId: new Types.ObjectId(listId) });
  }
}
