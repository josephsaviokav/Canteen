import Item from './item.entity';
import { NotFoundError } from '../../utils/errors';
import type { CreateItemDto,
  UpdateItemDto,
  ItemDto
 } from './item.dto';
import ItemRepository from './item.repository';
import { PaginationOptions, PaginatedResult } from '../../utils/pagination';

const toItemDto = (item: Item): ItemDto => item.toJSON() as ItemDto;

// Create a new item
const createItem = async (data: CreateItemDto) : Promise<ItemDto> => {
  const newItem = await ItemRepository.create(data);
  return toItemDto(newItem);
};

// Get all items
const getAllItems = async (options: PaginationOptions) : Promise<PaginatedResult<ItemDto>> => {
  const paginatedItems = await ItemRepository.findAll(options);
  return {
    ...paginatedItems,
    data: paginatedItems.data.map(toItemDto),
  };
};

// Get item by ID
const getItemById = async (id: string) : Promise<ItemDto> => {
  const item = await ItemRepository.findById(id);

  if (!item) {
    throw new NotFoundError('Item not found');
  }

  return toItemDto(item);
};

// Update item
const updateItem = async (
  id: string,
  data: UpdateItemDto
) : Promise<ItemDto> => {
  const item = await ItemRepository.update(id, data);

  if (!item) {
    throw new NotFoundError('Item not found');
  }

  return toItemDto(item);
};

// Delete item
const deleteItem = async (id: string) : Promise<{message: string}> => {
  const deleted = await ItemRepository.delete(id);

  if (!deleted) {
    throw new NotFoundError('Item not found');
  }

  return { message: 'Item deleted successfully' };
};

export default {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};