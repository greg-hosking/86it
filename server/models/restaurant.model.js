import mongoose from 'mongoose';

const { Schema } = mongoose;

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
    image: {
      type: String,
      default: 'https://86it.s3.amazonaws.com/restaurants/placeholder.png',
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
          enum: [
            'AL',
            'AK',
            'AZ',
            'AR',
            'CA',
            'CO',
            'CT',
            'DE',
            'FL',
            'GA',
            'HI',
            'ID',
            'IL',
            'IN',
            'IA',
            'KS',
            'KY',
            'LA',
            'ME',
            'MD',
            'MA',
            'MI',
            'MN',
            'MS',
            'MO',
            'MT',
            'NE',
            'NV',
            'NH',
            'NJ',
            'NM',
            'NY',
            'NC',
            'ND',
            'OH',
            'OK',
            'OR',
            'PA',
            'RI',
            'SC',
            'SD',
            'TN',
            'TX',
            'UT',
            'VT',
            'VA',
            'WA',
            'WV',
            'WI',
            'WY',
          ],
        },
        zip: {
          type: String,
          required: [true, 'Zip is required.'],
        },
        coordinates: {
          type: {
            lat: {
              type: Number,
            },
            lng: {
              type: Number,
            },
          },
        },
      },
      required: [true, 'Address is required.'],
    },
    hours: {
      type: {
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
    },
    cuisine: {
      type: String,
      enum: [
        'American',
        'Asian',
        'Barbecue',
        'Burgers',
        'Cajun',
        'Caribbean',
        'Chinese',
        'Cuban',
        'Deli',
        'Dessert',
        'Ethiopian',
        'French',
        'Greek',
        'Indian',
        'Italian',
        'Japanese',
        'Korean',
        'Latin American',
        'Mediterranean',
        'Mexican',
        'Middle Eastern',
        'Moroccan',
        'Pizza',
        'Sandwiches',
        'Seafood',
        'Southern',
        'Spanish',
        'Steakhouse',
        'Sushi',
        'Thai',
        'Vietnamese',
        'Other',
      ],
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
        type: {
          userId: {
            type: mongoose.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required.'],
          },
          role: {
            type: String,
            enum: ['owner', 'manager', 'pending'],
            required: [true, 'Role is required.'],
          },
        },
        default: [],
      },
    ],
    invitations: [
      {
        type: {
          userId: {
            type: mongoose.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required.'],
          },
          role: {
            type: String,
            enum: ['owner', 'manager', 'employee'],
            required: [true, 'Role is required.'],
          },
        },
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Restaurant', restaurantSchema);
