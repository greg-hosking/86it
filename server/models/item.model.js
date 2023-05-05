import mongoose from 'mongoose';

const { Schema } = mongoose;

const itemSchema = new Schema(
  {
    // categories: [
    //   {
    //     type: mongoose.ObjectId,
    //     ref: 'Category',
    //     default: [],
    //   },
    // ],
    name: {
      type: String,
      required: [true, 'Item name is required.'],
    },
    description: String,
    price: {
      type: Number,
      required: [true, 'Item price is required.'],
    },
    image: String,
    // ingredients: [
    //   {
    //     type: mongoose.ObjectId,
    //     ref: 'Ingredient',
    //     default: [],
    //   },
    // ],
    ingredients: [String], // TODO: Change to Ingredient model
    available: {
      type: Boolean,
      default: true,
    },
    likedBy: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Item', itemSchema);
