import mongoose from 'mongoose';

import { Password } from '../services/password';

// interface
interface UserAttr {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttr): UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// Define schema first
const userSchema = new mongoose.Schema({
  email: String,
  password: String
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }

  next();
});

userSchema.statics.build = (attrs: UserAttr) => {
  return new User(attrs);
};

// Convert schema to model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };