import mongoose, { Document, Schema, Types } from 'mongoose';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TaskStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxlength: [255, 'Title must be less than 255 characters'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Description must be less than 1000 characters'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.IN_PROGRESS,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for performance
taskSchema.index({ dueDate: 1, status: 1 });
taskSchema.index({ title: 'text', description: 'text' });

export const Task = mongoose.model<ITask>('Task', taskSchema);
