import { Types } from 'mongoose';
import { ShoppingItem, IShoppingItem } from '../models/item.model';
import { ShoppingList } from '../models/list.model';
import { Family } from '../models/family.model';
import { NotificationService } from './notification.service';
import { NotFoundError, BadRequestError } from '../utils/customError';
import { AddItemInput, EditItemInput, UpdateQuantityInput, UpdatePriorityInput } from '../validators/item.validator';

export class ItemService {
  public static async addItem(
    familyId: string,
    userId: string,
    data: AddItemInput
  ): Promise<IShoppingItem> {
    const list = await ShoppingList.findOne({
      _id: data.listId,
      familyId: new Types.ObjectId(familyId),
    });

    if (!list) {
      throw new NotFoundError('Target shopping list not found');
    }

    const item = await ShoppingItem.create({
      listId: new Types.ObjectId(data.listId),
      familyId: new Types.ObjectId(familyId),
      name: data.name,
      category: data.category || 'Other',
      quantity: data.quantity || 1,
      unit: data.unit || 'pcs',
      priority: data.priority || 'MEDIUM',
      notes: data.notes || '',
      clientItemId: data.clientItemId || undefined,
      addedBy: new Types.ObjectId(userId),
    });

    return item;
  }

  public static async getListItems(
    listId: string,
    familyId: string,
    category?: string,
    search?: string
  ): Promise<IShoppingItem[]> {
    const filter: any = {
      listId: new Types.ObjectId(listId),
      familyId: new Types.ObjectId(familyId),
    };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    return ShoppingItem.find(filter).sort({ isPurchased: 1, createdAt: -1 });
  }

  public static async getItemById(itemId: string, familyId: string): Promise<IShoppingItem> {
    const item = await ShoppingItem.findOne({
      _id: itemId,
      familyId: new Types.ObjectId(familyId),
    });

    if (!item) {
      throw new NotFoundError('Shopping item not found');
    }
    return item;
  }

  public static async editItem(
    itemId: string,
    familyId: string,
    userId: string,
    data: EditItemInput
  ): Promise<IShoppingItem> {
    const item = await ShoppingItem.findOne({
      _id: itemId,
      familyId: new Types.ObjectId(familyId),
    });

    if (!item) {
      throw new NotFoundError('Shopping item not found');
    }

    const wasPurchased = item.isPurchased;

    if (data.name !== undefined) item.name = data.name;
    if (data.category !== undefined) item.category = data.category;
    if (data.quantity !== undefined) item.quantity = data.quantity;
    if (data.unit !== undefined) item.unit = data.unit;
    if (data.priority !== undefined) item.priority = data.priority;
    if (data.notes !== undefined) item.notes = data.notes;

    if (data.isPurchased !== undefined && data.isPurchased !== wasPurchased) {
      item.isPurchased = data.isPurchased;
      if (data.isPurchased) {
        item.purchasedBy = new Types.ObjectId(userId);
        item.purchasedAt = new Date();
      } else {
        item.purchasedBy = null;
        item.purchasedAt = null;
      }
    }

    await item.save();

    // If marked as purchased, send notification to family members
    if (data.isPurchased && !wasPurchased) {
      const family = await Family.findById(familyId);
      if (family) {
        const memberIds = family.members.map((m) => m.userId);
        await NotificationService.notifyFamilyMembers(
          familyId,
          userId,
          'PURCHASE_COMPLETED',
          'Item Purchased!',
          `An item "${item.name}" was marked as purchased.`,
          memberIds,
          { itemId: item._id, listId: item.listId }
        );
      }
    }

    return item;
  }

  public static async updateQuantity(
    itemId: string,
    familyId: string,
    data: UpdateQuantityInput
  ): Promise<IShoppingItem> {
    const item = await ShoppingItem.findOneAndUpdate(
      { _id: itemId, familyId: new Types.ObjectId(familyId) },
      { quantity: data.quantity },
      { new: true, runValidators: true }
    );

    if (!item) throw new NotFoundError('Shopping item not found');
    return item;
  }

  public static async updatePriority(
    itemId: string,
    familyId: string,
    data: UpdatePriorityInput
  ): Promise<IShoppingItem> {
    const item = await ShoppingItem.findOneAndUpdate(
      { _id: itemId, familyId: new Types.ObjectId(familyId) },
      { priority: data.priority },
      { new: true, runValidators: true }
    );

    if (!item) throw new NotFoundError('Shopping item not found');
    return item;
  }

  public static async togglePurchaseStatus(
    itemId: string,
    familyId: string,
    userId: string
  ): Promise<IShoppingItem> {
    const item = await ShoppingItem.findOne({
      _id: itemId,
      familyId: new Types.ObjectId(familyId),
    });

    if (!item) throw new NotFoundError('Shopping item not found');

    item.isPurchased = !item.isPurchased;
    if (item.isPurchased) {
      item.purchasedBy = new Types.ObjectId(userId);
      item.purchasedAt = new Date();
    } else {
      item.purchasedBy = null;
      item.purchasedAt = null;
    }

    await item.save();

    if (item.isPurchased) {
      const family = await Family.findById(familyId);
      if (family) {
        const memberIds = family.members.map((m) => m.userId);
        await NotificationService.notifyFamilyMembers(
          familyId,
          userId,
          'PURCHASE_COMPLETED',
          'Item Purchased!',
          `An item "${item.name}" was bought!`,
          memberIds,
          { itemId: item._id, listId: item.listId }
        );
      }
    }

    return item;
  }

  public static async deleteItem(itemId: string, familyId: string): Promise<void> {
    const item = await ShoppingItem.findOneAndDelete({
      _id: itemId,
      familyId: new Types.ObjectId(familyId),
    });

    if (!item) throw new NotFoundError('Shopping item not found');
  }
}
