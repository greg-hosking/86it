import mongoose from 'mongoose';

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    menuId: {
      type: mongoose.ObjectId,
      ref: 'Menu',
      required: [true, 'Menu ID is required.'],
    },
    name: {
      type: String,
      required: [true, 'Category name is required.'],
    },
    items: [
      {
        type: mongoose.ObjectId,
        ref: 'Item',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Category', categorySchema);
