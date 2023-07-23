import mongoose from 'mongoose';

enum TaskStatus {
  STARTED = 'STARTED',
  IN_PORGRESS = 'PROGRESS',
  COMPLETED = 'COMPLETED'
}

interface TaskAttrs {
  title: string;
  userId: string;
}

interface TaskModel extends mongoose.Model<any> {
  build(attrs: TaskAttrs): any;
}

interface TaskDoc extends mongoose.Document {
  title: string;
  userId: string;
  status: TaskStatus;
}

const taskSchema = new mongoose.Schema({
  title: String,
  status: {
    type: String,
    enum: TaskStatus,
    default: TaskStatus.STARTED
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
},
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

taskSchema.statics.build = (attrs: TaskAttrs) => {
  return new Task(attrs);
};

const Task = mongoose.model<TaskDoc, TaskModel>('Task', taskSchema);


export { Task };