import { User } from "../models/index.js";
import bcrypt from "bcrypt";

// Remove password from user object
const sanitizeUser = (user: User) => {
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
};

// Create a new user (Sign Up)
const createUser = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role?: 'admin' | 'customer';
}) => {
    const userExists = await User.findOne({ where: { email: data.email } });
    if (userExists) {
        throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: data.role || 'customer'
    });

    return sanitizeUser(newUser);
};

// Sign in (returns user without password)
const signIn = async (email: string, password: string) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    return sanitizeUser(user);
};

// Get all users
const getAllUsers = async () => {
    const users = await User.findAll();
    return users.map(user => sanitizeUser(user));
};

// Get user by ID
const getUserById = async (userId: string) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return sanitizeUser(user);
};

// Get user by email
const getUserByEmail = async (email: string) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }
    return sanitizeUser(user);
};

// Update user
const updateUser = async (userId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
}) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== user.email) {
        const emailExists = await User.findOne({ where: { email: data.email } });
        if (emailExists) {
            throw new Error('Email already in use');
        }
    }

    // Update only provided fields
    if (data.firstName !== undefined) user.firstName = data.firstName;
    if (data.lastName !== undefined) user.lastName = data.lastName;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.email !== undefined) user.email = data.email;

    await user.save();
    return sanitizeUser(user);
};

// Update password
const updatePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return sanitizeUser(user);
};

const forgotPassword = async (email: string, newPassword: string) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return sanitizeUser(user);
};

// Delete user
const deleteUser = async (userId: string) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }

    await user.destroy();
    return { message: 'User deleted successfully' };
};

export default {
    createUser,
    signIn,
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    updatePassword,
    forgotPassword,
    deleteUser
};