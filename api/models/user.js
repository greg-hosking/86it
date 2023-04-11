import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
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
    unique: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  roles: [
    {
      restaurantId: {
        type: mongoose.ObjectId,
        ref: 'Restaurant',
        required: [true, 'Restaurant ID is required.'],
      },
      role: {
        type: String,
        enum: ['admin', 'moderator'],
        required: [true, 'Role is required.'],
      },
    },
  ],
  favoriteItems: [
    {
      type: mongoose.ObjectId,
      ref: 'Item',
      default: [],
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model('User', userSchema);

export default User;
