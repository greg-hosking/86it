import mongoose from 'mongoose';

import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required.'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: [true, 'Email already exists.'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    avatar: {
      type: String,
    },
    restaurants: {
      type: [
        {
          restaurantId: {
            type: mongoose.ObjectId,
            ref: 'Restaurant',
            required: [true, 'Restaurant ID is required.'],
          },
          role: {
            type: String,
            enum: ['owner', 'manager', 'employee'],
            required: [true, 'Role is required.'],
          },
          status: {
            type: String,
            enum: ['active', 'pending'],
            default: 'pending',
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
