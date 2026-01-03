import express from 'express';
import {
  createItem,
  getAllItems,
  getItemById,
  deleteItem,
} from '../controllers/itemController.js';

const router = express.Router();

// CRUD
router.post('/', createItem);       // CREATE
router.get('/', getAllItems);       // READ ALL
router.get('/:id', getItemById);    // READ ONE
router.delete('/:id', deleteItem);  // DELETE (soft)

export default router;
