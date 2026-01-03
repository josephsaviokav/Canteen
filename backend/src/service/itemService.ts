import Item from '../models/Item.js';

export const createItem = async (data: any) => {
  if (!data.name || !data.price) {
    throw new Error('Item name and price are required');
  }

  return await Item.create(data);
};

export const getAllItems = async () => {
  return await Item.findAll();
};

export const getItemById = async (id: string) => {
  const item = await Item.findByPk(id);
  if (!item) {
    throw new Error('Item not found');
  }
  return item;
};

export const deleteItem = async (id: string) => {
  const item = await Item.findByPk(id);
  if (!item) throw new Error('Item not found');

  await item.destroy();
};
