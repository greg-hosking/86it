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
        from: {
          type: String,
        },
        to: {
          type: String,
        },
      },
      tuesday: {
        from: {
          type: String,
        },
        to: {
          type: String,
        },
      },
      wednesday: {
        from: {
          type: String,
        },
        to: {
          type: String,
        },
      },
      thursday: {
        from: {
          type: String,
        },
        to: {
          type: String,
        },
      },
      friday: {
        from: {
          type: String,
        },
        to: {
          type: String,
        },
      },
      saturday: {
        from: {
          type: String,
        },

        to: {
          type: String,
        },
      },
      sunday: {
        from: {
          type: String,
        },

        to: {
          type: String,
        },
      },
    },
    categories: [
      {
        type: mongoose.ObjectId,
        ref: 'Category',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Menu', menuSchema);
