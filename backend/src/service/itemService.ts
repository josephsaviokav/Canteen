import Item from '../models/Item';

interface CreateItemInput {
  name: string;
  price: number;
  imageUrl: string;
  available?: boolean;
}

const createItem = async (data: CreateItemInput) => {
  if (!data.name || !data.price || !data.imageUrl) {
    throw new Error('name, price and imageUrl are required');
  }

  const item = await Item.create({
    name: data.name,
    price: data.price,
    imageUrl: data.imageUrl,
    available: data.available ?? true,
  });

  return item;
};

const getAllItems = async () => {
  return await Item.findAll({
    order: [['createdAt', 'ASC']]
  });
};

const getItemById = async (id: string) => {
  const item = await Item.findByPk(id);

  if (!item) {
    throw new Error('Item not found');
  }

  return item;
};

const updateItem = async (
  id: string,
  data: Partial<CreateItemInput>
) => {
  const item = await Item.findByPk(id);

  if (!item) {
    throw new Error('Item not found');
  }

  await item.update(data);
  return item;
};

const deleteItem = async (id: string) => {
  const item = await Item.findByPk(id);

  if (!item) {
    throw new Error('Item not found');
  }

  await item.destroy(); // hard delete (model has no soft delete)
};

export default {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};