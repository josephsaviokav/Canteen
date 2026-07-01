import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./user.entity.js";
import type {
    CreateUserDTO,
    ForgotPasswordDTO,
    SignInDTO,
    UpdatePasswordDTO,
    UpdateUserDTO,
    UserDTO,
} from "./user.dto.js";
import userRepository from "./user.repository.js";
import type { PaginationOptions, PaginatedResult } from "../../utils/pagination.js";
import cartRepository from "../cart/cart.repository.js";
import sequelize from "../../config/database.js";

dotenv.config();

type UserPlain = {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: "admin" | "customer";
    password?: string;
};

const sanitizeUser = (user: User): UserDTO => {
    const { password: _password, ...userWithoutPassword } = user.toJSON() as UserPlain;
    return userWithoutPassword;
};

// Sign Up
const createUser = async (data: CreateUserDTO): Promise<UserDTO> => {
    const userExists = await userRepository.findByEmail(data.email);
    if (userExists) {
        throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, Number(process.env.BCRYPT_SALT_ROUNDS));

    const transaction = await sequelize.transaction();
    try {
        const newUser = await userRepository.create({
            ...data,
            password: hashedPassword,
            role: data.role || 'customer'
        }, transaction);

        if(data.role === 'customer') {
            await cartRepository.create({ userId: newUser.userId }, transaction);
        }

        await transaction.commit();
        return sanitizeUser(newUser);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Sign in 
const signIn = async ({ email, password }: SignInDTO): Promise<UserDTO> => {
    const user = await userRepository.findByEmail(email);
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
const getAllUsers = async (options: PaginationOptions = {}): Promise<PaginatedResult<UserDTO>> => {
    const users = await userRepository.findAll(options);
    return {
        ...users,
        data: users.data.map(sanitizeUser)
    };
};

// Get all customers
const getAllCustomers = async (options: PaginationOptions = {}): Promise<PaginatedResult<UserDTO>> => {
    const users = await userRepository.findAllByRole("customer", options);
    return {
        ...users,
        data: users.data.map(sanitizeUser)
    };
}

// Get user by ID
const getUserById = async (userId: string): Promise<UserDTO> => {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return sanitizeUser(user);
};

// Get user by email
const getUserByEmail = async (email: string): Promise<UserDTO> => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    return sanitizeUser(user);
};

// Update user
const updateUser = async (userId: string, data: UpdateUserDTO): Promise<UserDTO> => {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== user.email) {
        const emailExists = await userRepository.findByEmail(data.email);
        if (emailExists) {
            throw new Error('Email already in use');
        }
    }

    const updatedUser = await userRepository.update(user.userId, data);
    if(!updatedUser) {
        throw new Error('Failed to update user');
    }
    return sanitizeUser(updatedUser);
};

// Update password
const updatePassword = async (
    userId: string,
    { oldPassword, newPassword }: UpdatePasswordDTO,
): Promise<UserDTO> => {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT_ROUNDS) );
    await userRepository.updatePassword(user.userId, user.password);

    return sanitizeUser(user);
};

// Forgot password
const forgotPassword = async ({ email, newPassword }: ForgotPasswordDTO): Promise<UserDTO> => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }

    // send reset password email with token (not implemented here)

    user.password = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT_ROUNDS) );
    await userRepository.updatePassword(user.userId, user.password);

    return sanitizeUser(user);
};

// Delete user
const deleteUser = async (userId: string) : Promise<{ message: string }> => {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    await userRepository.delete(userId);
    return { message: 'User deleted successfully' };
};

export default {
    createUser,
    signIn,
    getAllUsers,
    getAllCustomers,
    getUserById,
    getUserByEmail,
    updateUser,
    updatePassword,
    forgotPassword,
    deleteUser
};