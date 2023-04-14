import User from '../models/user.model.js';
import Restaurant from '../models/restaurant.model.js';

import createError from 'http-errors';

export default {
  getRestaurants: async function (req, res, next) {
    const restaurants = await Restaurant.find({}).exec();
    return res.status(200).json(restaurants);
  },

  getRestaurantById: async function (req, res, next) {
    const { restaurantId } = req.params;
    if (!restaurantId) {
      return next(createError(400, 'Request params is missing restaurantId.'));
    }

    const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
    if (!restaurant) {
      return next(createError(404, 'Restaurant not found.'));
    }

    return res.status(200).json(restaurant);
  },

  createRestaurant: async function (req, res, next) {
    const { name, address } = req.body;
    const ownerId = req.authenticatedUser._id;

    if (!(name && address && ownerId)) {
      return next(
        createError(400, 'Request is missing name, address, or ownerId.')
      );
    }

    const restaurant = new Restaurant({
      name: name,
      address: address,
      users: [{ userId: ownerId, role: 'owner' }],
    });
    let user = await User.findOne({ _id: ownerId }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }
    user.restaurants.push({ restaurantId: restaurant._id, role: 'owner' });

    await restaurant.save();
    await user.save();

    return res
      .status(201)
      .json({ ownerId: ownerId, restaurantId: restaurant._id });
  },

  updateRestaurant: async function (req, res, next) {
    const { restaurantId } = req.params;
    const { name, address } = req.body;

    if (!(restaurantId && name && address)) {
      return next(
        createError(400, 'Request is missing restaurantId, name, or address.')
      );
    }

    let restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
    if (!restaurant) {
      return next(createError(404, 'Restaurant not found.'));
    }
    if (name) {
      restaurant.name = name;
    }
    if (address) {
      restaurant.address = address;
    }
    await restaurant.save();
    return res.status(200).json(restaurant);
  },

  updateRestaurantImage: async function (req, res, next) {
    const { restaurantId } = req.params;
    let restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
    if (!restaurant) {
      return next(createError(404, 'Restaurant not found.'));
    }
    restaurant.image = req.file.location;
    await restaurant.save();
    res.status(200).json(restaurant);
  },

  inviteUserToRestaurant: async function (req, res, next) {
    const { restaurantId } = req.params;
    const { email } = req.body;
    const authenticatedUserId = req.authenticatedUser._id;

    if (!(restaurantId && email)) {
      return next(
        createError(400, 'Request is missing restaurantId or email.')
      );
    }

    let user = await User.findOne({ email: email }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }

    let restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
    if (!restaurant) {
      return next(createError(404, 'Restaurant not found.'));
    }

    const isUserInRestaurant = restaurant.users.some((existingUser) =>
      existingUser.userId.equals(user._id)
    );
    if (isUserInRestaurant) {
      return next(createError(409, 'User already in restaurant.'));
    }

    restaurant.users.push({ userId: user._id, role: 'pending' });
    user.restaurants.push({
      restaurantId: restaurant._id,
      role: 'pending',
    });
    await restaurant.save();
    await user.save();

    return res
      .status(200)
      .json('User has been invited to restaurant successfully.');
  },

  acceptInvitation: async function (req, res, next) {
    const { userId, restaurantId } = req.params;
    if (!(userId && restaurantId)) {
      return next(
        createError(400, 'Request is missing restaurantId or userId.')
      );
    }

    let user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }

    let index = user.restaurants.findIndex(
      (restaurant) => restaurant.restaurantId == restaurantId
    );
    if (index < 0) {
      return next(createError(404, 'Restaurant not found.'));
    }

    if (user.restaurants[index].role != 'pending') {
      return next(createError(409, 'User already in restaurant.'));
    }

    user.restaurants[index].role = 'manager';

    let restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
    if (!restaurant) {
      return next(createError(404, 'Restaurant not found.'));
    }

    index = restaurant.users.findIndex((user) => user.userId == userId);
    if (index < 0) {
      return next(createError(404, 'User not found.'));
    }

    if (restaurant.users[index].role != 'pending') {
      return next(createError(409, 'User already in restaurant.'));
    }

    restaurant.users[index].role = 'manager';

    await user.save();
    await restaurant.save();

    return res.status(200).json('Invitation accepted.');
  },

  rejectInvitation: async function (req, res, next) {
    const { userId, restaurantId } = req.params;
    if (!(userId && restaurantId)) {
      return next(
        createError(400, 'Request is missing restaurantId or userId.')
      );
    }

    let user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }

    let index = user.restaurants.findIndex(
      (restaurant) => restaurant.restaurantId == restaurantId
    );
    if (index < 0) {
      return next(createError(404, 'Restaurant not found.'));
    }

    if (user.restaurants[index].role != 'pending') {
      return next(createError(409, 'User already in restaurant.'));
    }

    user.restaurants.splice(index, 1);

    let restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
    if (!restaurant) {
      return next(createError(404, 'Restaurant not found.'));
    }

    index = restaurant.users.findIndex((user) => user.userId == userId);
    if (index < 0) {
      return next(createError(404, 'User not found.'));
    }

    if (restaurant.users[index].role != 'pending') {
      return next(createError(409, 'User already in restaurant.'));
    }

    restaurant.users.splice(index, 1);

    await user.save();
    await restaurant.save();

    return res.status(200).json('Invitation rejected.');
  },
};
