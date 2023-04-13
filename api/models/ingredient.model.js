import mongoose from 'mongoose';

const { Schema } = mongoose;

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Ingredient name is required.'],
    },
    description: {
      type: String,
      required: [true, 'Ingredient description is required.'],
    },
    price: {
      type: Number,
      required: [true, 'Ingredient price is required.'],
    },
    allergens: [String],
    dietary: [String],
    tags: [String],
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Ingredient', ingredientSchema);
