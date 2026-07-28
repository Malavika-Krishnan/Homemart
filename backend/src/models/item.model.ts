import { Schema, model, Document, Types } from 'mongoose';

export type ItemCategory =
  | 'Produce'
  | 'Dairy'
  | 'Meat'
  | 'Pantry'
  | 'Bakery'
  | 'Household'
  | 'Beverages'
  | 'Personal Care'
  | 'Frozen'
  | 'Other';

export type ItemPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface IShoppingItem extends Document {
  _id: Types.ObjectId;
  listId: Types.ObjectId;
  familyId: Types.ObjectId;
  name: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  priority: ItemPriority;
  isPurchased: boolean;
  purchasedBy?: Types.ObjectId | null;
  purchasedAt?: Date | null;
  addedBy: Types.ObjectId;
  notes?: string;
  clientItemId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const shoppingItemSchema = new Schema<IShoppingItem>(
  {
    listId: {
      type: Schema.Types.ObjectId,
      ref: 'ShoppingList',
      required: [true, 'List ID is required'],
      index: true,
    },
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'Family',
      required: [true, 'Family ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      minlength: [1, 'Item name cannot be empty'],
      maxlength: [100, 'Item name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      enum: [
        'Produce',
        'Dairy',
        'Meat',
        'Pantry',
        'Bakery',
        'Household',
        'Beverages',
        'Personal Care',
        'Frozen',
        'Other',
      ],
      default: 'Other',
      index: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'Quantity must be at least 1'],
    },
    unit: {
      type: String,
      default: 'pcs',
      trim: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
      index: true,
    },
    isPurchased: {
      type: Boolean,
      default: false,
      index: true,
    },
    purchasedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    purchasedAt: {
      type: Date,
      default: null,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    clientItemId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

shoppingItemSchema.index({ listId: 1, isPurchased: 1 });
shoppingItemSchema.index({ name: 'text' });

export const ShoppingItem = model<IShoppingItem>('ShoppingItem', shoppingItemSchema);
