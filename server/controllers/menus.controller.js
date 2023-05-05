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

async function createSection(req, res, next) {
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
  const menu = await Menu.findOne({ _id: menuId }).exec();
  if (!menu) {
    return next(createError(404, 'Menu not found.'));
  }

  const { name } = req.body;
  if (!name) {
    return next(createError(400, 'Name is required.'));
  }

  const section = new Section({
    name: name,
  });
  await section.save();

  // Update menu
  menu.sections.push(section._id);
  await menu.save();

  res.status(201).json(section);
}

async function deleteSection(req, res, next) {
  const { _id } = req.authenticatedUser;
  // const { restaurantId, menuId, sectionId } = req.params;
  const { menuId, sectionId } = req.params;
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
  const menu = await Menu.findOne({ _id: menuId }).exec();
  if (!menu) {
    return next(createError(404, 'Menu not found.'));
  }
  if (!menu.sections.includes(sectionId)) {
    return next(createError(404, 'Section not found.'));
  }
  const section = await Section.findOne({ _id: sectionId }).exec();
  if (!section) {
    return next(createError(404, 'Section not found.'));
  }
  // Delete items from section
  for (const itemId of section.items) {
    await Item.deleteOne({ _id: itemId }).exec();
  }
  // Delete section
  await Section.deleteOne({ _id: sectionId }).exec();
  // Update menu
  const index = menu.sections.indexOf(sectionId);
  menu.sections.splice(index, 1);
  await menu.save();
}

async function createItem(req, res, next) {
  const { _id } = req.authenticatedUser;
  // const { restaurantId, menuId, sectionId } = req.params;
  const { menuId, sectionId } = req.params;
  const restaurantId = req.restaurantId;
  const { name, description, price, ingredients } = req.body;

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
  const menu = await Menu.findOne({ _id: menuId }).exec();
  if (!menu) {
    return next(createError(404, 'Menu not found.'));
  }
  if (!menu.sections.includes(sectionId)) {
    return next(createError(404, 'Section not found.'));
  }
  const section = await Section.findOne({ _id: sectionId }).exec();
  if (!section) {
    return next(createError(404, 'Section not found.'));
  }

  const item = new Item({
    name: name,
    description: description,
    price: Number(price),
    ingredients: ingredients,
  });
  await item.save();

  // Update section
  section.items.push(item._id);
  await section.save();

  res.status(201).json(item);
}

async function deleteItem(req, res, next) {
  const { _id } = req.authenticatedUser;
  // const { restaurantId, menuId, sectionId, itemId } = req.params;
  const { menuId, sectionId, itemId } = req.params;
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
  const menu = await Menu.findOne({ _id: menuId }).exec();
  if (!menu) {
    return next(createError(404, 'Menu not found.'));
  }
  if (!menu.sections.includes(sectionId)) {
    return next(createError(404, 'Section not found.'));
  }
  const section = await Section.findOne({ _id: sectionId }).exec();
  if (!section) {
    return next(createError(404, 'Section not found.'));
  }
  if (!section.items.includes(itemId)) {
    return next(createError(404, 'Item not found.'));
  }
  const item = await Item.findOne({ _id: itemId }).exec();
  if (!item) {
    return next(createError(404, 'Item not found.'));
  }
  // Delete item
  const index = section.items.indexOf(itemId);
  section.items.splice(index, 1);
  await section.save();

  await Item.deleteOne({ _id: itemId }).exec();
  res.status(204).json('Item deleted.');
}

async function updateItem(req, res, next) {
  const { _id } = req.authenticatedUser;
  // const { restaurantId, menuId, sectionId, itemId } = req.params;
  const { menuId, sectionId, itemId } = req.params;
  const restaurantId = req.restaurantId;
  const { name, description, price, ingredients } = req.body;

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
  const menu = await Menu.findOne({ _id: menuId }).exec();
  if (!menu) {
    return next(createError(404, 'Menu not found.'));
  }
  if (!menu.sections.includes(sectionId)) {
    return next(createError(404, 'Section not found.'));
  }
  const section = await Section.findOne({ _id: sectionId }).exec();
  if (!section) {
    return next(createError(404, 'Section not found.'));
  }
  if (!section.items.includes(itemId)) {
    return next(createError(404, 'Item not found.'));
  }
  const item = await Item.findOne({ _id: itemId }).exec();
  if (!item) {
    return next(createError(404, 'Item not found.'));
  }
  // Update item
  item.name = name;
  item.description = description;
  item.price = Number(price);
  item.ingredients = ingredients;
  await item.save();

  res.status(200).json(item);
}

async function updateItemImage(req, res, next) {
  console.log('UPDATING ITEM IMAGE!!!!');
  const { _id } = req.authenticatedUser;
  // const { restaurantId, menuId, sectionId, itemId } = req.params;
  const { menuId, sectionId, itemId } = req.params;
  const restaurantId = req.restaurantId;
  const image = req.file.location;

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
  const menu = await Menu.findOne({ _id: menuId }).exec();
  if (!menu) {
    return next(createError(404, 'Menu not found.'));
  }
  if (!menu.sections.includes(sectionId)) {
    return next(createError(404, 'Section not found.'));
  }
  const section = await Section.findOne({ _id: sectionId }).exec();
  if (!section) {
    return next(createError(404, 'Section not found.'));
  }
  if (!section.items.includes(itemId)) {
    return next(createError(404, 'Item not found.'));
  }
  const item = await Item.findOne({ _id: itemId }).exec();
  if (!item) {
    return next(createError(404, 'Item not found.'));
  }
  // Update item
  item.image = image;
  await item.save();

  res.status(200).json(item);
}

export default {
  createMenu,
  deleteMenu,
  getMenus,
  getMenu,
  createSection,
  deleteSection,
  createItem,
  deleteItem,
  updateItem,
  updateItemImage,
};
