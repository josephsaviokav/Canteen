import { Router } from 'express';
import { itemController } from '../controller/index.js';

const itemRouter = Router();

// CRUD routes
itemRouter.post('/', itemController.createItem);           // Create item
itemRouter.get('/', itemController.getAllItems);           // Get all items
itemRouter.get('/:id', itemController.getItemById);        // Get item by ID
itemRouter.put('/:id', itemController.updateItem);         // Update item
itemRouter.delete('/:id', itemController.deleteItem);      // Delete item

export default itemRouter;