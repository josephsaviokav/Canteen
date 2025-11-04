import User from '../models/user.js';
import bcrypt from 'bcrypt';

const createUser = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: 'USER' | 'ADMIN';
  }) => {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'USER',
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
}

const getAllUsers = async () => {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Don't return passwords
    });
    return users;
  }

  // Get user by ID
 const getUserById = async (id: string) => {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Get user by email
 const getUserByEmail = async (email: string) => {
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Update user
 const updateUser = async (id: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: 'USER' | 'ADMIN';
  }) => {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }

    // If updating email, check if new email already exists
    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({ where: { email: data.email } });
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }

    // If updating password, hash it
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // Update user
    await user.update(data);

    // Return updated user without password
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  // Delete user
 const deleteUser = async (id: string) => {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }

    await user.destroy();
    return { message: 'User deleted successfully' };
  }

export default {
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
}

// class UserService {
//   // Create new user
//   async createUser(data: {
//     email: string;
//     password: string;
//     name: string;
//     phone?: string;
//     role?: 'USER' | 'ADMIN';
//   }) {
//     // Check if email already exists
//     const existingUser = await User.findOne({ where: { email: data.email } });
//     if (existingUser) {
//       throw new Error('Email already exists');
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     // Create user
//     const user = await User.create({
//       email: data.email,
//       password: hashedPassword,
//       name: data.name,
//       ...(data.phone !== undefined && { phone: data.phone }),
//       role: data.role || 'USER',
//     });

//     // Return user without password
//     const { password, ...userWithoutPassword } = user.toJSON();
//     return userWithoutPassword;
//   }

//   // Get all users
//   async getAllUsers() {
//     const users = await User.findAll({
//       attributes: { exclude: ['password'] }, // Don't return passwords
//     });
//     return users;
//   }

//   // Get user by ID
//   async getUserById(id: string) {
//     const user = await User.findByPk(id, {
//       attributes: { exclude: ['password'] },
//     });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     return user;
//   }

//   // Get user by email
//   async getUserByEmail(email: string) {
//     const user = await User.findOne({
//       where: { email },
//       attributes: { exclude: ['password'] },
//     });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     return user;
//   }

//   // Update user
//   async updateUser(id: string, data: {
//     name?: string;
//     email?: string;
//     phone?: string;
//     password?: string;
//     role?: 'USER' | 'ADMIN';
//   }) {
//     const user = await User.findByPk(id);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     // If updating email, check if new email already exists
//     if (data.email && data.email !== user.email) {
//       const existingUser = await User.findOne({ where: { email: data.email } });
//       if (existingUser) {
//         throw new Error('Email already exists');
//       }
//     }

//     // If updating password, hash it
//     if (data.password) {
//       data.password = await bcrypt.hash(data.password, 10);
//     }

//     // Update user
//     await user.update(data);

//     // Return updated user without password
//     const { password, ...userWithoutPassword } = user.toJSON();
//     return userWithoutPassword;
//   }

//   // Delete user
//   async deleteUser(id: string) {
//     const user = await User.findByPk(id);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     await user.destroy();
//     return { message: 'User deleted successfully' };
//   }
// }

// export default new UserService();

// class UserService {
//   // Create new user
//   async createUser(data: {
//     email: string;
//     password: string;
//     name: string;
//     phone?: string;
//     role?: 'USER' | 'ADMIN';
//   }) {
//     // Check if email already exists
//     const existingUser = await User.findOne({ where: { email: data.email } });
//     if (existingUser) {
//       throw new Error('Email already exists');
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     // Create user
//     const user = await User.create({
//       email: data.email,
//       password: hashedPassword,
//       name: data.name,
//       ...(data.phone !== undefined && { phone: data.phone }),
//       role: data.role || 'USER',
//     });

//     // Return user without password
//     const { password, ...userWithoutPassword } = user.toJSON();
//     return userWithoutPassword;
//   }

//   // Get all users
//   async getAllUsers() {
//     const users = await User.findAll({
//       attributes: { exclude: ['password'] }, // Don't return passwords
//     });
//     return users;
//   }

//   // Get user by ID
//   async getUserById(id: string) {
//     const user = await User.findByPk(id, {
//       attributes: { exclude: ['password'] },
//     });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     return user;
//   }

//   // Get user by email
//   async getUserByEmail(email: string) {
//     const user = await User.findOne({
//       where: { email },
//       attributes: { exclude: ['password'] },
//     });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     return user;
//   }

//   // Update user
//   async updateUser(id: string, data: {
//     name?: string;
//     email?: string;
//     phone?: string;
//     password?: string;
//     role?: 'USER' | 'ADMIN';
//   }) {
//     const user = await User.findByPk(id);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     // If updating email, check if new email already exists
//     if (data.email && data.email !== user.email) {
//       const existingUser = await User.findOne({ where: { email: data.email } });
//       if (existingUser) {
//         throw new Error('Email already exists');
//       }
//     }

//     // If updating password, hash it
//     if (data.password) {
//       data.password = await bcrypt.hash(data.password, 10);
//     }

//     // Update user
//     await user.update(data);

//     // Return updated user without password
//     const { password, ...userWithoutPassword } = user.toJSON();
//     return userWithoutPassword;
//   }

//   // Delete user
//   async deleteUser(id: string) {
//     const user = await User.findByPk(id);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     await user.destroy();
//     return { message: 'User deleted successfully' };
//   }
// }

// export default new UserService();