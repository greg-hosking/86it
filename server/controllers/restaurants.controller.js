import Restaurant from '../models/restaurant.model.js';
import User from '../models/user.model.js';

import config from '../utils/env.js';
import transporter from '../utils/mail.js';

import createError from 'http-errors';
import _ from 'lodash';

// *****************
// CREATE RESTAURANT
// *****************
async function createRestaurant(req, res, next) {
  const { _id } = req.authenticatedUser;
  const { name, address, hours } = req.body;
  // if (!(name && address && hours)) {
  if (!(name && address)) {
    return next(
      createError(400, 'Request is missing name, address, or hours.')
    );
  }
  const restaurant = new Restaurant({
    name: name,
    address: address,
    hours: hours,
    users: [{ userId: _id, role: 'owner', status: 'active' }],
  });
  const user = await User.findOne({ _id: _id }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  user.restaurants.push({
    restaurantId: restaurant._id,
    role: 'owner',
    status: 'active',
  });
  await restaurant.save();
  await user.save();
  res.status(201).json(restaurant);
}

// **********************************
// GET AUTHENTICATED USER RESTAURANTS
// **********************************
async function getAuthenticatedUserRestaurants(req, res, next) {
  const { _id } = req.authenticatedUser;
  const user = await User.findOne({ _id: _id })
    .populate({
      path: 'restaurants.restaurantId',
    })
    .exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  const restaurants = user.restaurants.map((restaurant) => {
    const { restaurantId, role, status } = restaurant;
    const transformedRestaurant = {
      ...restaurantId._doc,
      role,
      status,
    };
    return transformedRestaurant;
  });
  res.status(200).json(restaurants);
}

// ********************
// GET RESTAURANT USERS
// ********************
async function getRestaurantUsers(req, res, next) {
  const { _id } = req.authenticatedUser;
  const { restaurantId } = req.params;
  const user = await User.findOne({ _id: _id }).select('-password').exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  const restaurant = await Restaurant.findOne({ _id: restaurantId })
    .populate('users.userId')
    .exec();
  if (!restaurant) {
    return next(createError(404, 'Restaurant not found.'));
  }

  const users = restaurant.users.map((user) => {
    const { userId, role, status } = user;
    const transformedUser = {
      ...userId._doc,
      role,
      status,
    };
    return _.omit(transformedUser, ['password']);
  });
  res.status(200).json(users);
}

// **************
// GET RESTAURANT
// **************
async function getRestaurant(req, res, next) {
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findOne({ _id: restaurantId })
    .populate({
      path: 'menus',
      populate: {
        path: 'sections',
        populate: {
          path: 'items',
        },
      },
    })
    .exec();

  if (!restaurant) {
    return next(createError(404, 'Restaurant not found.'));
  }
  res.status(200).json(restaurant);
}

// ************************************
// UPDATE AUTHENTICATED USER RESTAURANT
// ************************************
async function updateAuthenticatedUserRestaurant(req, res, next) {}

// *****************
// ACCEPT INVITATION
// *****************
async function acceptInvitation(req, res, next) {
  const { _id } = req.authenticatedUser;
  const { restaurantId } = req.params;
  const user = await User.findOne({ _id: _id }).select('-password').exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
  if (!restaurant) {
    return next(createError(404, 'Restaurant not found.'));
  }
  const hasPendingInvitation =
    user.restaurants.some(
      (restaurant) =>
        restaurant.restaurantId.equals(restaurantId) &&
        restaurant.status == 'pending'
    ) &&
    restaurant.users.some(
      (existingUser) =>
        existingUser.userId.equals(user._id) &&
        existingUser.status === 'pending'
    );
  if (!hasPendingInvitation) {
    return next(createError(404, 'Invitation not found.'));
  }

  const userIndex = user.restaurants.findIndex(
    (restaurant) =>
      restaurant.restaurantId.equals(restaurantId) &&
      restaurant.status == 'pending'
  );
  const restaurantIndex = restaurant.users.findIndex(
    (existingUser) =>
      existingUser.userId.equals(user._id) && existingUser.status === 'pending'
  );
  user.restaurants[userIndex].status = 'active';
  restaurant.users[restaurantIndex].status = 'active';
  await restaurant.save();
  await user.save();
  return res.status(204).json(user);
}

// ******************
// DECLINE INVITATION
// ******************
async function declineInvitation(req, res, next) {
  const { _id } = req.authenticatedUser;
  const { restaurantId } = req.params;
  const user = await User.findOne({ _id: _id }).select('-password').exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
  if (!restaurant) {
    return next(createError(404, 'Restaurant not found.'));
  }
  const hasPendingInvitation =
    user.restaurants.some(
      (restaurant) =>
        restaurant.restaurantId.equals(restaurantId) &&
        restaurant.status == 'pending'
    ) &&
    restaurant.users.some(
      (existingUser) =>
        existingUser.userId.equals(user._id) &&
        existingUser.status === 'pending'
    );
  if (!hasPendingInvitation) {
    return next();
  }

  const userIndex = user.restaurants.findIndex(
    (restaurant) =>
      restaurant.restaurantId.equals(restaurantId) &&
      restaurant.status == 'pending'
  );
  const restaurantIndex = restaurant.users.findIndex(
    (existingUser) =>
      existingUser.userId.equals(user._id) && existingUser.status === 'pending'
  );
  user.restaurants.splice(userIndex, 1);
  restaurant.users.splice(restaurantIndex, 1);
  await restaurant.save();
  await user.save();
  return res.status(204).json(user);
}

// ****************
// LEAVE RESTAURANT
// ****************
async function leaveRestaurant(req, res, next) {
  const { _id } = req.authenticatedUser;
  const { restaurantId } = req.params;
  const user = await User.findOne({ _id: _id }).select('-password').exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
  if (!restaurant) {
    return next(createError(404, 'Restaurant not found.'));
  }
  const role = user.restaurants.find((restaurant) =>
    restaurant.restaurantId.equals(restaurantId)
  ).role;
  if (role === 'owner') {
    return next();
  }

  const userIndex = user.restaurants.findIndex((restaurant) =>
    restaurant.restaurantId.equals(restaurantId)
  );
  const restaurantIndex = restaurant.users.findIndex(
    (existingUser) =>
      existingUser.userId.equals(user._id) && existingUser.status === 'active'
  );
  user.restaurants.splice(userIndex, 1);
  restaurant.users.splice(restaurantIndex, 1);
  await restaurant.save();
  await user.save();
  return res.status(204).json(user);
}

// *****************
// DELETE RESTAURANT
// *****************
async function deleteRestaurant(req, res, next) {
  const { _id } = req.authenticatedUser;
  const { restaurantId } = req.params;
  const user = await User.findOne({ _id: _id }).select('-password').exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
  if (!restaurant) {
    return next(createError(404, 'Restaurant not found.'));
  }
  const role = user.restaurants.find((restaurant) =>
    restaurant.restaurantId.equals(restaurantId)
  ).role;
  if (role !== 'owner') {
    return next(createError(403, 'Forbidden.'));
  }

  // TODO: Delete everything related to the restaurant.
  // const userIndex = user.restaurants.findIndex((restaurant) =>
  //   restaurant.restaurantId.equals(restaurantId)
  // );
  // const restaurantIndex = restaurant.users.findIndex(
  //   (existingUser) =>
  //     existingUser.userId.equals(user._id) && existingUser.status === 'active'
  // );
  // user.restaurants.splice(userIndex, 1);
  // restaurant.users.splice(restaurantIndex, 1);
  // await restaurant.save();
  // await user.save();
  return res.status(204).json(user);
}

// *************************
// INVITE USER TO RESTAURANT
// *************************
async function inviteUserToRestaurant(req, res, next) {
  const { _id } = req.authenticatedUser;
  const { restaurantId } = req.params;
  const { email, role } = req.body;
  if (!(email && role)) {
    return next(createError(400, 'Request is missing email or role.'));
  }
  const sender = await User.findOne({ _id: _id }).select('-password').exec();
  if (!sender) {
    return next(createError(404, 'Sender not found.'));
  }
  const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
  if (!restaurant) {
    return next(createError(404, 'Restaurant not found.'));
  }
  const recipient = await User.findOne({ email: email })
    .select('-password')
    .exec();
  if (!recipient) {
    return next(createError(404, 'Recipient not found.'));
  }
  if (sender._id.equals(recipient._id)) {
    return next(createError(400, 'Cannot invite yourself.'));
  }
  const senderRole = sender.restaurants.find((restaurant) =>
    restaurant.restaurantId.equals(restaurantId)
  ).role;
  if (senderRole !== 'owner' && senderRole !== 'manager') {
    return next(createError(403, 'Forbidden.'));
  }
  if (senderRole === 'manager' && role === 'owner') {
    return next(createError(403, 'Forbidden.'));
  }

  if (
    recipient.restaurants.some((restaurant) =>
      restaurant.restaurantId.equals(restaurantId)
    ) &&
    restaurant.users.some((existingUser) =>
      existingUser.userId.equals(recipient._id)
    )
  ) {
    return next(
      createError(409, 'Recipient is already a member of the restaurant.')
    );
  }
  recipient.restaurants.push({
    restaurantId: restaurant._id,
    role: role,
    status: 'pending',
  });
  restaurant.users.push({
    userId: recipient._id,
    role: role,
    status: 'pending',
  });
  await restaurant.save();
  await recipient.save();

  const url =
    config.server.env === 'production'
      ? 'https://eightysixit.herokuapp.com/'
      : 'http://localhost:3000';
  transporter.sendMail({
    to: email,
    subject: '86it - Invitation to join restaurant',
    html: `Hi ${recipient.firstName},<br><br>
      You have been invited to join ${restaurant.name} on 86it.<br><br>
      Please <a href="${url}">click here</a> to join.<br><br>
      Thanks! - The 86it team`,
  });
  console.log(recipient);
  return res.status(200).json(recipient);
}

// ****************
// UPDATE USER ROLE
// ****************
async function updateUserRole(req, res, next) {
  const { _id } = req.authenticatedUser;
  const { restaurantId, userId } = req.params;
  const { role } = req.body;
  if (!role) {
    return next(createError(400, 'Request is missing role.'));
  }
  const user = await User.findOne({ _id: _id }).select('-password').exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
  if (!restaurant) {
    return next(createError(404, 'Restaurant not found.'));
  }
  const userToUpdate = await User.findOne({ _id: userId }).exec();
  if (!userToUpdate) {
    return next(createError(404, 'User to update not found.'));
  }
  const updaterRole = user.restaurants.find((restaurant) =>
    restaurant.restaurantId.equals(restaurantId)
  ).role;
  if (updaterRole !== 'owner' && updaterRole !== 'manager') {
    return next(createError(403, 'Forbidden.'));
  }
  if (updaterRole === 'manager' && role === 'owner') {
    return next(createError(403, 'Forbidden.'));
  }
  if (updaterRole === 'owner' && role === 'owner') {
    // Uncomment this to allow owners to demote themselves.
    // const updaterIndex = user.restaurants.findIndex((restaurant) =>
    //   restaurant.restaurantId.equals(restaurantId)
    // );
    // const restaurantIndex = restaurant.users.findIndex(
    //   (existingUser) =>
    //     existingUser.userId.equals(user._id) &&
    //     existingUser.status === 'active'
    // );
    // user.restaurants.splice(updaterIndex, 1);
    // restaurant.users.splice(restaurantIndex, 1);
    // await restaurant.save();
    // await user.save();
    console.log('TODO!');
  }
  const userToUpdateIndex = userToUpdate.restaurants.findIndex((restaurant) =>
    restaurant.restaurantId.equals(restaurantId)
  );
  const restaurantIndex = restaurant.users.findIndex(
    (existingUser) =>
      existingUser.userId.equals(userToUpdate._id) &&
      existingUser.status === 'active'
  );
  userToUpdate.restaurants[userToUpdateIndex].role = role;
  restaurant.users[restaurantIndex].role = role;
  await restaurant.save();
  await userToUpdate.save();
  return res.status(204).json(restaurant);
}

// ***************************
// REMOVE USER FROM RESTAURANT
// ***************************
async function removeUserFromRestaurant(req, res, next) {
  const { _id } = req.authenticatedUser;
  const { restaurantId, userId } = req.params;
  const user = await User.findOne({ _id: _id }).select('-password').exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
  if (!restaurant) {
    return next(createError(404, 'Restaurant not found.'));
  }
  const userToRemove = await User.findOne({ _id: userId }).exec();
  if (!userToRemove) {
    return next(createError(404, 'User to remove not found.'));
  }
  const role = user.restaurants.find((restaurant) =>
    restaurant.restaurantId.equals(restaurantId)
  ).role;
  if (role !== 'owner' && role !== 'manager') {
    return next(createError(403, 'Forbidden.'));
  }
  const userToRemoveIndex = userToRemove.restaurants.findIndex((restaurant) =>
    restaurant.restaurantId.equals(restaurantId)
  );
  const restaurantIndex = restaurant.users.findIndex(
    (existingUser) =>
      existingUser.userId.equals(userToRemove._id) &&
      existingUser.status === 'active'
  );
  userToRemove.restaurants.splice(userToRemoveIndex, 1);
  restaurant.users.splice(restaurantIndex, 1);
  await restaurant.save();
  await userToRemove.save();
  return res.status(204).json(restaurant);
}

export default {
  createRestaurant,
  getAuthenticatedUserRestaurants,
  getRestaurantUsers,
  getRestaurant,
  updateAuthenticatedUserRestaurant,
  acceptInvitation,
  declineInvitation,
  leaveRestaurant,
  deleteRestaurant,
  inviteUserToRestaurant,
  updateUserRole,
  removeUserFromRestaurant,
};

// updateRestaurant: async function (req, res, next) {
//   const { restaurantId } = req.params;
//   const { name, address } = req.body;
//   if (!(restaurantId && name && address)) {
//     return next(
//       createError(400, 'Request is missing restaurantId, name, or address.')
//     );
//   }
//   let restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
//   if (!restaurant) {
//     return next(createError(404, 'Restaurant not found.'));
//   }
//   if (name) {
//     restaurant.name = name;
//   }
//   if (address) {
//     restaurant.address = address;
//   }
//   await restaurant.save();
//   return res.status(200).json(restaurant);
// },
// updateRestaurantImage: async function (req, res, next) {
//   const { restaurantId } = req.params;
//   let restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
//   if (!restaurant) {
//     return next(createError(404, 'Restaurant not found.'));
//   }
//   restaurant.image = req.file.location;
//   await restaurant.save();
//   res.status(200).json(restaurant);
// },

// // ************************************
// // UPDATE AUTHENTICATED USER RESTAURANT
// // ************************************
// async function updateAuthenticatedUserRestaurant(req, res, next) {
//   const { _id } = req.authenticatedUser;
//   const user = await User.findOne({ _id: _id }).exec();
//   if (!user) {
//     return next(createError(404, 'User not found.'));
//   }
//   const { restaurantId } = req.params;
//   const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
//   if (!restaurant) {
//     return next(createError(404, 'Restaurant not found.'));
//   }
//   const { name, address } = req.body;
//   if (name) {
//     restaurant.name = name;
//   }
//   if (address) {
//     restaurant.address = address;
//   }
//   await restaurant.save();
//   res.status(204).json(restaurant);
// }

// // ******************************************
// // UPDATE AUTHENTICATED USER RESTAURANT IMAGE
// // ******************************************
// async function updateAuthenticatedUserRestaurantImage(req, res, next) {
//   const { _id } = req.authenticatedUser;
//   const user = await User.findOne({ _id: _id }).exec();
//   if (!user) {
//     return next(createError(404, 'User not found.'));
//   }
//   const { restaurantId } = req.params;
//   const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
//   if (!restaurant) {
//     return next(createError(404, 'Restaurant not found.'));
//   }
//   restaurant.image = req.file.location;
//   await restaurant.save();
//   res.status(204).json(restaurant);
// }
