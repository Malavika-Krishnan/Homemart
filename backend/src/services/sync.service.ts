import { Types } from 'mongoose';
import { ShoppingItem, IShoppingItem } from '../models/item.model';
import { ShoppingList } from '../models/list.model';
import { SyncLog } from '../models/syncLog.model';
import { SyncBatchInput, SyncOperation } from '../validators/sync.validator';
import { NotificationService } from './notification.service';

export interface SyncOperationResult {
  operationIndex: number;
  action: string;
  entity: string;
  status: 'SUCCESS' | 'CONFLICT_RESOLVED' | 'SKIPPED' | 'FAILED';
  message: string;
  entityData?: any;
}

export class SyncService {
  public static async processOfflineBatch(
    userId: string,
    familyId: string,
    batchData: SyncBatchInput
  ): Promise<{
    processedCount: number;
    conflictsResolved: number;
    status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
    results: SyncOperationResult[];
    syncLogId: string;
  }> {
    const results: SyncOperationResult[] = [];
    let processedCount = 0;
    let conflictsResolved = 0;

    const clientBatchTime = new Date(batchData.clientTimestamp);

    for (let i = 0; i < batchData.operations.length; i++) {
      const op: SyncOperation = batchData.operations[i];
      try {
        if (op.entity === 'item') {
          const itemResult = await this.handleItemOperation(op, i, userId, familyId, clientBatchTime);
          results.push(itemResult);
          if (itemResult.status === 'SUCCESS' || itemResult.status === 'CONFLICT_RESOLVED') {
            processedCount++;
          }
          if (itemResult.status === 'CONFLICT_RESOLVED') {
            conflictsResolved++;
          }
        } else if (op.entity === 'list') {
          const listResult = await this.handleListOperation(op, i, userId, familyId);
          results.push(listResult);
          if (listResult.status === 'SUCCESS' || listResult.status === 'CONFLICT_RESOLVED') {
            processedCount++;
          }
        }
      } catch (err: any) {
        results.push({
          operationIndex: i,
          action: op.action,
          entity: op.entity,
          status: 'FAILED',
          message: err.message || 'Operation execution failed',
        });
      }
    }

    const overallStatus =
      processedCount === batchData.operations.length
        ? 'SUCCESS'
        : processedCount > 0
        ? 'PARTIAL'
        : 'FAILED';

    const syncLog = await SyncLog.create({
      userId: new Types.ObjectId(userId),
      familyId: new Types.ObjectId(familyId),
      clientTimestamp: clientBatchTime,
      serverTimestamp: new Date(),
      processedCount,
      conflictsResolved,
      status: overallStatus,
      details: results,
    });

    return {
      processedCount,
      conflictsResolved,
      status: overallStatus,
      results,
      syncLogId: syncLog._id.toString(),
    };
  }

  private static async handleItemOperation(
    op: SyncOperation,
    index: number,
    userId: string,
    familyId: string,
    clientBatchTime: Date
  ): Promise<SyncOperationResult> {
    const { action, entityId, clientItemId, listId, data } = op;

    if (action === 'CREATE') {
      if (!listId || !data?.name) {
        return {
          operationIndex: index,
          action,
          entity: 'item',
          status: 'FAILED',
          message: 'Missing listId or item name for CREATE operation',
        };
      }

      // Check duplicate by clientItemId or duplicate name in same list
      if (clientItemId) {
        const existing = await ShoppingItem.findOne({
          clientItemId,
          familyId: new Types.ObjectId(familyId),
        });
        if (existing) {
          return {
            operationIndex: index,
            action,
            entity: 'item',
            status: 'CONFLICT_RESOLVED',
            message: 'Duplicate client item detected. Ignored creation.',
            entityData: existing,
          };
        }
      }

      const newItem = await ShoppingItem.create({
        listId: new Types.ObjectId(listId),
        familyId: new Types.ObjectId(familyId),
        name: data.name,
        category: data.category || 'Other',
        quantity: data.quantity || 1,
        unit: data.unit || 'pcs',
        priority: data.priority || 'MEDIUM',
        notes: data.notes || '',
        clientItemId: clientItemId || undefined,
        addedBy: new Types.ObjectId(userId),
      });

      return {
        operationIndex: index,
        action,
        entity: 'item',
        status: 'SUCCESS',
        message: 'Offline item created successfully',
        entityData: newItem,
      };
    }

    if (action === 'UPDATE' || action === 'TOGGLE_PURCHASE') {
      let item: IShoppingItem | null = null;

      if (entityId) {
        item = await ShoppingItem.findOne({
          _id: entityId,
          familyId: new Types.ObjectId(familyId),
        });
      } else if (clientItemId) {
        item = await ShoppingItem.findOne({
          clientItemId,
          familyId: new Types.ObjectId(familyId),
        });
      }

      if (!item) {
        return {
          operationIndex: index,
          action,
          entity: 'item',
          status: 'FAILED',
          message: 'Item not found for update operation',
        };
      }

      let isConflict = false;
      // Last-Write-Wins check against server updatedAt
      if (item.updatedAt > clientBatchTime) {
        isConflict = true;
      }

      if (action === 'TOGGLE_PURCHASE') {
        item.isPurchased = !item.isPurchased;
        if (item.isPurchased) {
          item.purchasedBy = new Types.ObjectId(userId);
          item.purchasedAt = new Date();
        } else {
          item.purchasedBy = null;
          item.purchasedAt = null;
        }
      } else if (data) {
        if (data.name !== undefined) item.name = data.name;
        if (data.category !== undefined) item.category = data.category;
        if (data.quantity !== undefined) item.quantity = data.quantity;
        if (data.unit !== undefined) item.unit = data.unit;
        if (data.priority !== undefined) item.priority = data.priority;
        if (data.notes !== undefined) item.notes = data.notes;
        if (data.isPurchased !== undefined) {
          item.isPurchased = data.isPurchased;
          if (data.isPurchased) {
            item.purchasedBy = new Types.ObjectId(userId);
            item.purchasedAt = new Date();
          } else {
            item.purchasedBy = null;
            item.purchasedAt = null;
          }
        }
      }

      await item.save();

      return {
        operationIndex: index,
        action,
        entity: 'item',
        status: isConflict ? 'CONFLICT_RESOLVED' : 'SUCCESS',
        message: isConflict
          ? 'Conflict resolved using client values (Last-Write-Wins)'
          : 'Offline item updated successfully',
        entityData: item,
      };
    }

    if (action === 'DELETE') {
      if (entityId) {
        await ShoppingItem.findOneAndDelete({
          _id: entityId,
          familyId: new Types.ObjectId(familyId),
        });
      } else if (clientItemId) {
        await ShoppingItem.findOneAndDelete({
          clientItemId,
          familyId: new Types.ObjectId(familyId),
        });
      }

      return {
        operationIndex: index,
        action,
        entity: 'item',
        status: 'SUCCESS',
        message: 'Offline item deleted successfully',
      };
    }

    return {
      operationIndex: index,
      action,
      entity: 'item',
      status: 'FAILED',
      message: `Unsupported action: ${action}`,
    };
  }

  private static async handleListOperation(
    op: SyncOperation,
    index: number,
    userId: string,
    familyId: string
  ): Promise<SyncOperationResult> {
    const { action, entityId, data } = op;

    if (action === 'CREATE') {
      if (!data?.name) {
        return {
          operationIndex: index,
          action,
          entity: 'list',
          status: 'FAILED',
          message: 'List name required for CREATE operation',
        };
      }

      const newList = await ShoppingList.create({
        name: data.name,
        description: data.description || '',
        color: data.color || '#3B82F6',
        familyId: new Types.ObjectId(familyId),
        createdBy: new Types.ObjectId(userId),
      });

      return {
        operationIndex: index,
        action,
        entity: 'list',
        status: 'SUCCESS',
        message: 'Offline list created successfully',
        entityData: newList,
      };
    }

    if (action === 'UPDATE' && entityId) {
      const list = await ShoppingList.findOneAndUpdate(
        { _id: entityId, familyId: new Types.ObjectId(familyId) },
        { $set: data || {} },
        { new: true }
      );

      if (!list) {
        return {
          operationIndex: index,
          action,
          entity: 'list',
          status: 'FAILED',
          message: 'List not found for update',
        };
      }

      return {
        operationIndex: index,
        action,
        entity: 'list',
        status: 'SUCCESS',
        message: 'Offline list updated successfully',
        entityData: list,
      };
    }

    return {
      operationIndex: index,
      action,
      entity: 'list',
      status: 'FAILED',
      message: `Unsupported list action: ${action}`,
    };
  }
}
