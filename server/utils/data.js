import User from '../models/user.model.js';
import Restaurant from '../models/restaurant.model.js';
import Menu from '../models/menu.model.js';
import Section from '../models/section.model.js';
import Item from '../models/item.model.js';
// import Ingredient from '../models/ingredient.model.js';

async function createData() {
  // Create users...
  const users = [
    {
      _id: '62d9e3625bdc4a8a0b0d1605',
      firstName: 'Luffy',
      lastName: 'Monkey',
      email: 'luffy@example.com',
      verified: true,
      password: 'password',
      avatar:
        'https://86it.s3.amazonaws.com/users/62d9e3625bdc4a8a0b0d1605/avatar.jpg',
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1606',
      firstName: 'Chopper',
      lastName: 'Tony Tony',
      email: 'chopper@example.com',
      verified: true,
      password: 'password',
      avatar:
        'https://86it.s3.amazonaws.com/users/62d9e3625bdc4a8a0b0d1606/avatar.jpg',
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1607',
      firstName: 'Sanji',
      lastName: 'Vinsmoke',
      email: 'sanji@example.com',
      verified: true,
      password: 'password',
      avatar:
        'https://86it.s3.amazonaws.com/users/62d9e3625bdc4a8a0b0d1607/avatar.jpg',
    },
  ];

  for (const user of users) {
    await new User(user).save();
  }

  // Create restaurants...
  const restaurants = [
    {
      _id: '62d9e3625bdc4a8a0b0d1608',
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
      _id: '62d9e3625bdc4a8a0b0d1609',
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
      _id: '62d9e3625bdc4a8a0b0d1610',
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
      _id: '62d9e3625bdc4a8a0b0d1611',
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
    status: 'active',
  });
  user1.restaurants.push({
    restaurantId: restaurant2._id,
    role: 'owner',
    status: 'active',
  });
  user1.restaurants.push({
    restaurantId: restaurant3._id,
    role: 'manager',
    status: 'active',
  });
  user1.restaurants.push({
    restaurantId: restaurant4._id,
    role: 'manager',
    status: 'active',
  });

  user2.restaurants.push({
    restaurantId: restaurant1._id,
    role: 'manager',
    status: 'active',
  });
  user2.restaurants.push({
    restaurantId: restaurant3._id,
    role: 'owner',
    status: 'active',
  });
  user2.restaurants.push({
    restaurantId: restaurant4._id,
    role: 'manager',
    status: 'active',
  });

  user3.restaurants.push({
    restaurantId: restaurant1._id,
    role: 'employee',
    status: 'active',
  });
  user3.restaurants.push({
    restaurantId: restaurant2._id,
    role: 'manager',
    status: 'active',
  });
  user3.restaurants.push({
    restaurantId: restaurant4._id,
    role: 'owner',
    status: 'active',
  });

  await user1.save();
  await user2.save();
  await user3.save();

  // Add users to restaurants...
  restaurant1.users.push({
    userId: user1._id,
    role: 'owner',
    status: 'active',
  });
  restaurant1.users.push({
    userId: user2._id,
    role: 'manager',
    status: 'active',
  });
  restaurant1.users.push({
    userId: user3._id,
    role: 'employee',
    status: 'active',
  });

  restaurant2.users.push({
    userId: user1._id,
    role: 'owner',
    status: 'active',
  });
  restaurant2.users.push({
    userId: user3._id,
    role: 'manager',
    status: 'active',
  });

  restaurant3.users.push({
    userId: user1._id,
    role: 'manager',
    status: 'active',
  });
  restaurant3.users.push({
    userId: user2._id,
    role: 'owner',
    status: 'active',
  });

  restaurant4.users.push({
    userId: user1._id,
    role: 'manager',
    status: 'active',
  });
  restaurant4.users.push({
    userId: user2._id,
    role: 'manager',
    status: 'active',
  });
  restaurant4.users.push({
    userId: user3._id,
    role: 'owner',
    status: 'active',
  });

  await restaurant1.save();
  await restaurant2.save();
  await restaurant3.save();
  await restaurant4.save();

  // Add menu items to restaurants...
  const restaurant2Menus = [
    {
      _id: '62d9e3625bdc4a8a0b0d1612',
      restaurantId: restaurant2._id,
      name: 'Lunch',
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1613',
      restaurantId: restaurant2._id,
      name: 'Dinner',
    },
  ];

  // Add menus to restaurants...
  // for (const menu of restaurant1Menus) {
  //   const newMenu = new Menu(menu);
  //   await newMenu.save();
  //   restaurant1.menus.push(newMenu._id);
  // }
  for (const menu of restaurant2Menus) {
    const newMenu = new Menu(menu);
    await newMenu.save();
    restaurant2.menus.push(newMenu._id);
  }
  // for (const menu of restaurant3Menus) {
  //   const newMenu = new Menu(menu);
  //   await newMenu.save();
  //   restaurant3.menus.push(newMenu._id);
  // }
  // for (const menu of restaurant4Menus) {
  //   const newMenu = new Menu(menu);
  //   await newMenu.save();
  //   restaurant4.menus.push(newMenu._id);
  // }

  await restaurant1.save();
  await restaurant2.save();
  await restaurant3.save();
  await restaurant4.save();

  // Add sections to menus...
  const menu1Sections = [
    {
      _id: '62d9e3625bdc4a8a0b0d1614',
      name: 'Appetizers',
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1615',
      name: 'Sushi Rolls',
    },
  ];
  const menu2Sections = [
    {
      _id: '62d9e3625bdc4a8a0b0d1616',
      name: 'Appetizers',
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1617',
      name: 'Sushi Rolls',
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1618',
      name: 'Entrees',
    },
  ];

  // Add sections to menus...
  for (const section of menu1Sections) {
    const newSection = new Section(section);
    await newSection.save();
    const menu = await Menu.findOne({ _id: restaurant2.menus[0] }).exec();
    menu.sections.push(newSection._id);
    await menu.save();
  }
  for (const section of menu2Sections) {
    const newSection = new Section(section);
    await newSection.save();
    const menu = await Menu.findOne({ _id: restaurant2.menus[1] }).exec();
    menu.sections.push(newSection._id);
    await menu.save();
  }

  // Add items to sections...
  const menu1section1Items = [
    {
      _id: '62d9e3625bdc4a8a0b0d1619',
      name: 'Edamame',
      description: 'Steamed soybeans',
      price: 4.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1619/image.jpg',
      ingredients: ['Edamame', 'Salt'],
      available: false,
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1620',
      name: 'Gyoza',
      description: 'Pan-fried pork dumplings',
      price: 5.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1620/image.jpg',
      ingredients: ['Pork', 'Flour', 'Salt', 'Pepper'],
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1621',
      name: 'Shrimp Tempura',
      description: 'Deep-fried shrimp',
      price: 6.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1621/image.jpg',
      ingredients: ['Shrimp', 'Flour', 'Salt', 'Pepper'],
    },
  ];
  const menu1section2Items = [
    {
      _id: '62d9e3625bdc4a8a0b0d1622',
      name: 'California Roll',
      description: 'Crab, avocado, cucumber',
      price: 7.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1622/image.jpg',
      ingredients: ['Crab', 'Avocado', 'Cucumber', 'Rice', 'Nori'],
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1623',
      name: 'Spicy Tuna Roll',
      description: 'Tuna, spicy mayo, cucumber',
      price: 8.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1623/image.jpg',
      ingredients: ['Tuna', 'Spicy Mayo', 'Cucumber', 'Rice', 'Nori'],
      available: false,
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1624',
      name: 'Salmon Roll',
      description: 'Salmon, avocado, cucumber',
      price: 9.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1624/image.jpg',
      ingredients: ['Salmon', 'Avocado', 'Cucumber', 'Rice', 'Nori'],
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1634',
      name: 'Rainbow Roll',
      description: 'Tuna, salmon, yellowtail, avocado, cucumber',
      price: 13.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1634/image.jpg',
      ingredients: [
        'Tuna',
        'Salmon',
        'Yellowtail',
        'Avocado',
        'Cucumber',
        'Rice',
        'Nori',
      ],
    },
  ];
  const menu2section1Items = [
    {
      _id: '62d9e3625bdc4a8a0b0d1625',
      name: 'Edamame',
      description: 'Steamed soybeans',
      price: 4.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1619/image.jpg',
      ingredients: ['Edamame', 'Salt'],
      available: false,
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1626',
      name: 'Gyoza',
      description: 'Pan-fried pork dumplings',
      price: 5.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1620/image.jpg',
      ingredients: ['Pork', 'Flour', 'Salt', 'Pepper'],
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1627',
      name: 'Shrimp Tempura',
      description: 'Deep-fried shrimp',
      price: 6.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1621/image.jpg',
      ingredients: ['Shrimp', 'Flour', 'Salt', 'Pepper'],
    },
  ];
  const menu2section2Items = [
    {
      _id: '62d9e3625bdc4a8a0b0d1628',
      name: 'California Roll',
      description: 'Crab, avocado, cucumber',
      price: 7.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1622/image.jpg',
      ingredients: ['Crab', 'Avocado', 'Cucumber', 'Rice', 'Nori'],
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1629',
      name: 'Spicy Tuna Roll',
      description: 'Tuna, spicy mayo, cucumber',
      price: 8.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1623/image.jpg',
      ingredients: ['Tuna', 'Spicy Mayo', 'Cucumber', 'Rice', 'Nori'],
      available: false,
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1630',
      name: 'Salmon Roll',
      description: 'Salmon, avocado, cucumber',
      price: 9.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1624/image.jpg',
      ingredients: ['Salmon', 'Avocado', 'Cucumber', 'Rice', 'Nori'],
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1635',
      name: 'Rainbow Roll',
      description: 'Tuna, salmon, yellowtail, avocado, cucumber',
      price: 13.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1634/image.jpg',
      ingredients: [
        'Tuna',
        'Salmon',
        'Yellowtail',
        'Avocado',
        'Cucumber',
        'Rice',
        'Nori',
      ],
    },
  ];
  const menu2section3Items = [
    {
      _id: '62d9e3625bdc4a8a0b0d1631',
      name: 'Yakisoba',
      description: 'Stir-fried noodles',
      price: 10.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1631/image.webp',
      ingredients: ['Noodles', 'Pork', 'Cabbage', 'Carrots', 'Onions'],
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1632',
      name: 'Curry Rice',
      description: 'Japanese curry with rice',
      price: 11.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1632/image.webp',
      ingredients: ['Rice', 'Beef', 'Carrots', 'Potatoes', 'Onions'],
    },
    {
      _id: '62d9e3625bdc4a8a0b0d1633',
      name: 'Tonkatsu',
      description: 'Deep-fried pork cutlet',
      price: 12.99,
      image:
        'https://86it.s3.amazonaws.com/items/62d9e3625bdc4a8a0b0d1633/image.webp',
      ingredients: ['Pork', 'Flour', 'Egg', 'Panko'],
    },
  ];

  const restaurantExpanded = await Restaurant.findOne({
    _id: restaurant2._id,
  })
    .populate({
      path: 'menus',
      populate: {
        path: 'sections',
      },
    })
    .exec();

  // Add items to sections...
  for (const item of menu1section1Items) {
    const newItem = new Item(item);
    await newItem.save();
    const section = await Section.findOne({
      _id: restaurantExpanded.menus[0].sections[0],
    }).exec();
    section.items.push(newItem._id);
    await section.save();
  }
  for (const item of menu1section2Items) {
    const newItem = new Item(item);
    await newItem.save();
    const section = await Section.findOne({
      _id: restaurantExpanded.menus[0].sections[1],
    }).exec();
    section.items.push(newItem._id);
    await section.save();
  }
  for (const item of menu2section1Items) {
    const newItem = new Item(item);
    await newItem.save();
    const section = await Section.findOne({
      _id: restaurantExpanded.menus[1].sections[0],
    }).exec();
    section.items.push(newItem._id);
    await section.save();
  }
  for (const item of menu2section2Items) {
    const newItem = new Item(item);
    await newItem.save();
    const section = await Section.findOne({
      _id: restaurantExpanded.menus[1].sections[1],
    }).exec();
    section.items.push(newItem._id);
    await section.save();
  }
  for (const item of menu2section3Items) {
    const newItem = new Item(item);
    await newItem.save();
    const section = await Section.findOne({
      _id: restaurantExpanded.menus[1].sections[2],
    }).exec();
    section.items.push(newItem._id);
    await section.save();
  }
}

export default createData;
