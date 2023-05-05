import mongoose from 'mongoose';

const { Schema } = mongoose;

const sectionSchema = new Schema(
  {
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

export default mongoose.model('Section', sectionSchema);
