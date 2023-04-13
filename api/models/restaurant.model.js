import mongoose from 'mongoose';

const { Schema } = mongoose;

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
    address: {
      type: {
        street1: {
          type: String,
          required: [true, 'Street is required.'],
        },
        street2: {
          type: String,
        },
        city: {
          type: String,
          required: [true, 'City is required.'],
        },
        state: {
          type: String,
          required: [true, 'State is required.'],
        },
        zip: {
          type: String,
          required: [true, 'Zip is required.'],
        },
      },
      required: [true, 'Address is required.'],
    },
    hours: {
      type: {
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
    },
    menus: [
      {
        type: mongoose.ObjectId,
        ref: 'Menu',
        default: [],
      },
    ],
    users: [
      {
        userId: {
          type: mongoose.ObjectId,
          ref: 'User',
          required: [true, 'User ID is required.'],
        },
        role: {
          type: String,
          enum: ['admin', 'moderator'],
          required: [true, 'Role is required.'],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Restaurant', restaurantSchema);
