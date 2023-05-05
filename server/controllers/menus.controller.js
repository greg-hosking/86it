import createError from 'http-errors';

import Menu from '../models/menu.model.js';
import Restaurant from '../models/restaurant.model.js';
import User from '../models/user.model.js';
import Section from '../models/section.model.js';
import Item from '../models/item.model.js';

async function createMenu(req, res, next) {
  const { _id } = req.authenticatedUser;
  const restaurantId = req.restaurantId;

  const user = await User.findOne({ _id: _id }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  const { name } = req.body;
  if (!name) {
    return next(createError(400, 'Name is required.'));
  }
  const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
  if (!restaurant) {
    return next(createError(404, 'Restaurant not found.'));
  }
  const menu = new Menu({
    name: name,
  });
  await menu.save();
  restaurant.menus.push(menu._id);
  await restaurant.save();
  res.status(201).json(menu);
}

async function getMenus(req, res, next) {
  const { _id } = req.authenticatedUser;
  // const { restaurantId } = req.params;
  const restaurantId = req.restaurantId;

  const user = await User.findOne({ _id: _id }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  const restaurant = await Restaurant.findOne({ _id: restaurantId })
    .populate('menus')
    .exec();
  if (!restaurant) {
    return next(createError(404, 'Restaurant not found.'));
  }
  console.log(restaurant.menus);
  res.status(200).json(restaurant.menus);
}

async function getMenu(req, res, next) {
  const { _id } = req.authenticatedUser;
  // const { restaurantId, menuId } = req.params;
  const { menuId } = req.params;
  const restaurantId = req.restaurantId;

  const user = await User.findOne({ _id: _id }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
  if (!restaurant) {
    return next(createError(404, 'Restaurant not found.'));
  }

  if (!restaurant.menus.includes(menuId)) {
    return next(createError(404, 'Menu not found.'));
  }
  const menu = await Menu.findOne({ _id: menuId })
    .populate({
      path: 'sections',
      populate: {
        path: 'items',
      },
    })
    .exec();
  if (!menu) {
    return next(createError(404, 'Menu not found.'));
  }
  console.log(menu);
  res.status(200).json(menu);
}

async function deleteMenu(req, res, next) {
  const { _id } = req.authenticatedUser;
  // const { restaurantId, menuId } = req.params;
  const { menuId } = req.params;
  const restaurantId = req.restaurantId;
}

export default {
  createMenu,
  getMenus,
  getMenu,
};
