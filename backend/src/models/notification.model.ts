import { Schema, model, Document, Types } from 'mongoose';

export type NotificationType =
  | 'SHOPPING_REMINDER'
  | 'PURCHASE_COMPLETED'
  | 'MEMBER_JOINED'
  | 'FAMILY_UPDATE'
  | 'SYSTEM';

export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  familyId?: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'Family',
      default: null,
      index: true,
    },
    type: {
      type: String,
      enum: ['SHOPPING_REMINDER', 'PURCHASE_COMPLETED', 'MEMBER_JOINED', 'FAMILY_UPDATE', 'SYSTEM'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isRead: {
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

notificationSchema.index({ userId: 1, isRead: 1 });

export const Notification = model<INotification>('Notification', notificationSchema);
