import mongoose from 'mongoose';

const { Schema } = mongoose;

const menuSchema = new Schema(
  {
    restaurantId: {
      type: mongoose.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required.'],
    },
    name: {
      type: String,
      required: [true, 'Menu name is required.'],
    },
    hours: {
      monday: {
        from: String,
        to: String,
      },
      tuesday: {
        from: String,
        to: String,
      },
      wednesday: {
        from: String,
        to: String,
      },
      thursday: {
        from: String,
        to: String,
      },
      friday: {
        from: String,
        to: String,
      },
      saturday: {
        from: String,
        to: String,
      },
      sunday: {
        from: String,
        to: String,
      },
    },
    sections: [
      {
        type: mongoose.ObjectId,
        ref: 'Section',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Menu', menuSchema);
