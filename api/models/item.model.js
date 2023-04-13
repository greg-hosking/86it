import mongoose from 'mongoose';

const { Schema } = mongoose;

const itemSchema = new Schema(
  {
    categoryId: {
      type: mongoose.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required.'],
    },
    name: {
      type: String,
      required: [true, 'Item name is required.'],
    },
    description: {
      type: String,
      required: [true, 'Item description is required.'],
    },
    price: {
      type: Number,
      required: [true, 'Item price is required.'],
    },
    image: {
      type: String,
    },
    ingredients: [
      {
        type: String,
      },
    ],
    options: [
      {
        type: String,
      },
    ],
    allergens: [
      {
        type: String,
      },
    ],
    dietary: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    favoritedBy: [
      {
        type: mongoose.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Item', itemSchema);
