import { Schema, model, Document, Types } from 'mongoose';

export interface IFamilyMember {
  userId: Types.ObjectId;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: Date;
}

export interface IFamily extends Document {
  _id: Types.ObjectId;
  name: string;
  inviteCode: string;
  ownerId: Types.ObjectId;
  members: IFamilyMember[];
  createdAt: Date;
  updatedAt: Date;
}

const familyMemberSchema = new Schema<IFamilyMember>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'MEMBER'],
      default: 'MEMBER',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const familySchema = new Schema<IFamily>(
  {
    name: {
      type: String,
      required: [true, 'Family name is required'],
      trim: true,
      minlength: [2, 'Family name must be at least 2 characters long'],
      maxlength: [100, 'Family name cannot exceed 100 characters'],
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    members: [familyMemberSchema],
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

export const Family = model<IFamily>('Family', familySchema);
