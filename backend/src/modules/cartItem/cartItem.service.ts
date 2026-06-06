import { get } from "http";
import { NotFoundError } from "../../utils/errors";
import { PaginatedResult, PaginationOptions } from "../../utils/pagination";
import { CartItemDTO, CreateCartItemDTO, UpdateCartItemDTO } from "./cartItem.dto";
import CartItem from "./cartItem.entity";
import CartItemRepository from "./cartItem.repository";

const toCartItemDto = (cartItem: CartItem) : CartItemDTO => {
    return cartItem.toJSON() as CartItemDTO;
}

// create a cartItem
const createCartItem = async (data: CreateCartItemDTO) : Promise<CartItemDTO> => {
    const cartItem = await CartItemRepository.create(data);
    return toCartItemDto(cartItem);
}

// get cart item by ID
const getCartItemById = async (cartItemId: string) : Promise<CartItemDTO> => {
    const cartItem = await CartItemRepository.findById(cartItemId);
    if (!cartItem) {
        throw new NotFoundError('Cart item not found');
    }
    return toCartItemDto(cartItem);
}

// get cart items by cartId
const getCartItemsByCartId = async (cartId: string) : Promise<CartItemDTO[]> => {
    const cartItems = await CartItemRepository.findAllByCartId(cartId);
    return cartItems.map(cartItem => toCartItemDto(cartItem));
}

// update cart item 
const updateCartItem = async (cartItemId: string, data: UpdateCartItemDTO) : Promise<CartItemDTO> => {
    const updatedCartItem = await CartItemRepository.update(cartItemId, data);
    if (!updatedCartItem) {
        throw new NotFoundError('Cart item not found');
    }
    return toCartItemDto(updatedCartItem);
}

// get all cart items
const getAllCartItems = async (options: PaginationOptions) : Promise<PaginatedResult<CartItemDTO>> => {
    const cartItems = await CartItemRepository.findAll(options);
    return {
        ...cartItems,
        data: cartItems.data.map(toCartItemDto),
    }
}

// delete cart item
const deleteCartItem = async (cartItemId: string) : Promise<{message : string}> => {
    const deleted = await CartItemRepository.delete(cartItemId);

    if (!deleted) {
        throw new NotFoundError('Cart item not found');
    }
    return { message: 'Cart item deleted successfully' };
}

export default {
    createCartItem,
    getCartItemById,
    getCartItemsByCartId,
    updateCartItem,
    getAllCartItems,
    deleteCartItem
}