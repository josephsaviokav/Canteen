import { ConflictError, NotFoundError } from "../../utils/errors.js";
import { PaginatedResult, PaginationOptions } from "../../utils/pagination.js";
import { CartDto, CreateCartDto } from "./cart.dto.js";
import Cart from "./cart.entity.js";
import CartRepository from "./cart.repository.js";

const toCartDto = (cart: Cart): CartDto => {
    return cart.toJSON() as CartDto;
}

// create a cart
const createCart = async (data: CreateCartDto) : Promise<CartDto> => {
    const cart = await CartRepository.create(data);
    
    if(!cart) {
        throw new ConflictError('Cart already exists for the given userId');
    }
    return toCartDto(cart);
}

// get cart by userId
const getCartByUserId = async (userId: string) : Promise<CartDto> => {
    const cart = await CartRepository.findByUserId(userId);
    
    if(!cart) {
        throw new NotFoundError('Cart not found for the given userId');
    }

    return toCartDto(cart);
}

// get all carts
const getAllCarts = async (options: PaginationOptions) : Promise<PaginatedResult<CartDto>> => {
    const carts = await CartRepository.findAll(options);
    return {
        ...carts,
        data: carts.data.map(toCartDto)
    };
}

export default {
    createCart,
    getCartByUserId,
    getAllCarts
}