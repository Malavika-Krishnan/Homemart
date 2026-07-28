import { Schema, model, Document, Types } from 'mongoose';

export interface ISyncLog extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  familyId?: Types.ObjectId;
  clientTimestamp: Date;
  serverTimestamp: Date;
  processedCount: number;
  conflictsResolved: number;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  details: any[];
  createdAt: Date;
}

const syncLogSchema = new Schema<ISyncLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'Family',
      default: null,
    },
    clientTimestamp: {
      type: Date,
      required: true,
    },
    serverTimestamp: {
      type: Date,
      default: Date.now,
    },
    processedCount: {
      type: Number,
      default: 0,
    },
    conflictsResolved: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'PARTIAL', 'FAILED'],
      default: 'SUCCESS',
    },
    details: {
      type: [Schema.Types.Mixed],
      default: [],
    } as any,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const SyncLog = model<ISyncLog>('SyncLog', syncLogSchema);
