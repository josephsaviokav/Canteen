import { type Request,type Response } from 'express';
import { userService } from '../services/index.js';

// Create user
const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, first name, and last name are required',
      });
    }

    const user = await userService.createUser({ email, password, firstName, lastName, role });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    res.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get user by ID
const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if(!id){
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }
    const user = await userService.getUserById(id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};


// Update user
const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if(!id){
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }
    const { firstName, lastName, email, password, role } = req.body;

    const user = await userService.updateUser(id, { firstName, lastName, email, password, role });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete user
const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if(!id){
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }
    const result = await userService.deleteUser(id);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
}