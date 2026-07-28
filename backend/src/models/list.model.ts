import { Schema, model, Document, Types } from 'mongoose';

export interface IShoppingList extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  familyId: Types.ObjectId;
  color: string;
  createdBy: Types.ObjectId;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const shoppingListSchema = new Schema<IShoppingList>(
  {
    name: {
      type: String,
      required: [true, 'Shopping list name is required'],
      trim: true,
      minlength: [1, 'Shopping list name cannot be empty'],
      maxlength: [100, 'Shopping list name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [250, 'Description cannot exceed 250 characters'],
    },
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'Family',
      required: [true, 'Family ID is required'],
      index: true,
    },
    color: {
      type: String,
      default: '#3B82F6',
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
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

shoppingListSchema.index({ familyId: 1, isArchived: 1 });

export const ShoppingList = model<IShoppingList>('ShoppingList', shoppingListSchema);
