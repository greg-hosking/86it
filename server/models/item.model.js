import mongoose from 'mongoose';

const { Schema } = mongoose;

const itemSchema = new Schema(
  {
    restaurantId: {
      type: mongoose.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Item restaurant ID is required.'],
    },
    categories: [
      {
        type: mongoose.ObjectId,
        ref: 'Category',
        default: [],
      },
    ],
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
    images: {
      type: [
        {
          index: {
            type: Number,
            required: [true, 'Image index is required.'],
            unique: true,
          },
          url: {
            type: String,
            required: [true, 'Image URL is required.'],
            unique: true,
          },
        },
      ],
      default: [],
    },
    ingredients: [
      {
        type: mongoose.ObjectId,
        ref: 'Ingredient',
        default: [],
      },
    ],
    options: {
      type: [
        {
          name: { type: String, required: [true, 'Option name is required.'] },
          choices: [
            {
              name: {
                type: String,
                required: [true, 'Choice name is required.'],
              },
              price: Number,
            },
          ],
        },
      ],
      default: [],
    },
    available: {
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
