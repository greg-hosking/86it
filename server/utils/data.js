import User from '../models/user.model.js';
import Restaurant from '../models/restaurant.model.js';
import Menu from '../models/menu.model.js';
import Category from '../models/category.model.js';
import Item from '../models/item.model.js';
import Ingredient from '../models/ingredient.model.js';

async function createData() {
  // Create users...
  const users = [
    {
      firstName: 'Luffy',
      lastName: 'Monkey',
      email: 'luffy@example.com',
      verified: true,
      password: 'password',
      image: 'https://86it.s3.amazonaws.com/one-piece-pfp-1.jpg',
    },
    {
      firstName: 'Chopper',
      lastName: 'Tony Tony',
      email: 'chopper@example.com',
      verified: true,
      password: 'password',
      image: 'https://86it.s3.amazonaws.com/one-piece-pfp-2.jpg',
    },
    {
      firstName: 'Sanji',
      lastName: 'Vinsmoke',
      email: 'sanji@example.com',
      verified: true,
      password: 'password',
      image: 'https://86it.s3.amazonaws.com/one-piece-pfp-6.jpg',
    },
  ];

  for (const user of users) {
    await new User(user).save();
  }

  // Create restaurants...
  const restaurants = [
    {
      name: 'Spice Garden',
      image: 'https://86it.s3.amazonaws.com/restaurant-1.jpg',
      address: {
        street1: '123 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
      },
      hours: {
        monday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        tuesday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        wednesday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        thursday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        friday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        saturday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        sunday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
      },
      cuisine: 'Indian',
    },
    {
      name: 'Sushi Express',
      image: 'https://86it.s3.amazonaws.com/restaurant-2.jpg',
      address: {
        street1: '456 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
      },
      hours: {
        monday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        tuesday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        wednesday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        thursday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        friday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        saturday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        sunday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
      },
      cuisine: 'Japanese',
    },
    {
      name: 'La Pizzeria',
      image: 'https://86it.s3.amazonaws.com/restaurant-3.jpg',
      address: {
        street1: '789 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
      },
      hours: {
        monday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        tuesday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        wednesday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        thursday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        friday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        saturday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        sunday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
      },
      cuisine: 'Italian',
    },
    {
      name: 'Burger Palace',
      image: 'https://86it.s3.amazonaws.com/restaurant-4.jpg',
      address: {
        street1: '101 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
      },
      hours: {
        monday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        tuesday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        wednesday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        thursday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        friday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        saturday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
        sunday: {
          from: '11:00 AM',
          to: '9:00 PM',
        },
      },
      cuisine: 'American',
    },
  ];

  for (const restaurant of restaurants) {
    await new Restaurant(restaurant).save();
  }

  // Add restaurants to users...
  const user1 = await User.findOne({ email: 'luffy@example.com' }).exec();
  const user2 = await User.findOne({ email: 'chopper@example.com' }).exec();
  const user3 = await User.findOne({ email: 'sanji@example.com' }).exec();

  const restaurant1 = await Restaurant.findOne({ name: 'Spice Garden' }).exec();
  const restaurant2 = await Restaurant.findOne({
    name: 'Sushi Express',
  }).exec();
  const restaurant3 = await Restaurant.findOne({ name: 'La Pizzeria' }).exec();
  const restaurant4 = await Restaurant.findOne({
    name: 'Burger Palace',
  }).exec();

  user1.restaurants.push({
    restaurantId: restaurant1._id,
    role: 'owner',
  });
  user1.restaurants.push({
    restaurantId: restaurant2._id,
    role: 'owner',
  });
  user1.restaurants.push({
    restaurantId: restaurant3._id,
    role: 'manager',
  });
  user1.restaurants.push({
    restaurantId: restaurant4._id,
    role: 'manager',
  });

  user2.restaurants.push({
    restaurantId: restaurant1._id,
    role: 'manager',
  });
  user2.restaurants.push({
    restaurantId: restaurant3._id,
    role: 'owner',
  });
  user2.restaurants.push({
    restaurantId: restaurant4._id,
    role: 'manager',
  });

  user3.restaurants.push({
    restaurantId: restaurant1._id,
    role: 'manager',
  });
  user3.restaurants.push({
    restaurantId: restaurant2._id,
    role: 'manager',
  });
  user3.restaurants.push({
    restaurantId: restaurant4._id,
    role: 'owner',
  });

  await user1.save();
  await user2.save();
  await user3.save();

  // Add users to restaurants...
  restaurant1.users.push({
    userId: user1._id,
    role: 'owner',
  });
  restaurant1.users.push({
    userId: user2._id,
    role: 'manager',
  });
  restaurant1.users.push({
    userId: user3._id,
    role: 'manager',
  });

  restaurant2.users.push({
    userId: user1._id,
    role: 'owner',
  });
  restaurant2.users.push({
    userId: user3._id,
    role: 'manager',
  });

  restaurant3.users.push({
    userId: user1._id,
    role: 'manager',
  });
  restaurant3.users.push({
    userId: user2._id,
    role: 'owner',
  });

  restaurant4.users.push({
    userId: user1._id,
    role: 'manager',
  });
  restaurant4.users.push({
    userId: user2._id,
    role: 'manager',
  });
  restaurant4.users.push({
    userId: user3._id,
    role: 'owner',
  });

  await restaurant1.save();
  await restaurant2.save();
  await restaurant3.save();
  await restaurant4.save();

  // Add menu items to restaurants...
  const restaurant1Menus = [
    {
      restaurantId: restaurant1._id,
      name: 'Lunch',
    },
    {
      restaurantId: restaurant1._id,
      name: 'Dinner',
    },
    {
      restaurantId: restaurant1._id,
      name: 'Drinks',
    },
    {
      restaurantId: restaurant1._id,
      name: 'Dessert',
    },
  ];
  const restaurant2Menus = [
    {
      restaurantId: restaurant2._id,
      name: 'Lunch',
    },
    {
      restaurantId: restaurant2._id,
      name: 'Dinner',
    },
    {
      restaurantId: restaurant2._id,
      name: 'Drinks',
    },
    {
      restaurantId: restaurant2._id,
      name: `Chef's Specials`,
    },
  ];
  const restaurant3Menus = [
    {
      restaurantId: restaurant3._id,
      name: 'Menu',
    },
  ];
  const restaurant4Menus = [
    {
      restaurantId: restaurant4._id,
      name: 'Menu',
    },
  ];

  // Add menus to restaurants...
  for (const menu of restaurant1Menus) {
    const newMenu = new Menu(menu);
    await newMenu.save();
    restaurant1.menus.push(newMenu._id);
  }
  for (const menu of restaurant2Menus) {
    const newMenu = new Menu(menu);
    await newMenu.save();
    restaurant2.menus.push(newMenu._id);
  }
  for (const menu of restaurant3Menus) {
    const newMenu = new Menu(menu);
    await newMenu.save();
    restaurant3.menus.push(newMenu._id);
  }
  for (const menu of restaurant4Menus) {
    const newMenu = new Menu(menu);
    await newMenu.save();
    restaurant4.menus.push(newMenu._id);
  }

  await restaurant1.save();
  await restaurant2.save();
  await restaurant3.save();
  await restaurant4.save();

  // Add categories to menus...
}

export default createData;
