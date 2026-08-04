import httpStatus from "http-status";
import { prisma } from "../../config/db.js";
import AppError from "../../errors/AppError.js";

const getAllCart = async () => {
  const data = await prisma.cart.findMany({
    include: {
      user: true,
      items: true,
    },
  });

  if (!data) {
    throw new AppError(httpStatus.NOT_FOUND, "Cart is Empty");
  }

  return data;
};

const getCartById = async (cartId: string) => {
  const cart = await prisma.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      items: {
        include: {
          product: true,
          size: true,
        },
      },
    },
  });

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, "Cart not found");
  }

  return cart;
};

const getMyCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
          size: true,
        },
      },
    },
  });

  if (!cart) {
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
    };
  }

  const subtotal = cart.items.reduce((total, item) => {
    return total + Number(item.size.price) * item.quantity;
  }, 0);

  const totalItems = cart.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  return {
    ...cart,
    totalItems,
    subtotal,
  };
};

const addItemToCart = async (payload: {
  userId: string;
  sizeId: string;
  quantity: number;
}) => {
  const { quantity, sizeId, userId } = payload;
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const size = await prisma.size.findUnique({
    where: {
      id: sizeId,
    },
    include: {
      product: true,
    },
  });

  if (!size) {
    throw new Error("Size not found");
  }

  if (size.quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  let cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_sizeId: {
        cartId: cart.id,
        sizeId,
      },
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > size.quantity) {
      throw new Error("Insufficient stock");
    }

    return await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: newQuantity,
      },
      include: {
        product: true,
        size: true,
      },
    });
  }

  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: size.productId,
      sizeId,
      quantity,
    },
    include: {
      product: true,
      size: true,
    },
  });
};

const updateCartItemQuantity = async (payload: {
  userId: string;
  cartItemId: string;
  quantity: number;
}) => {
  const { userId, cartItemId, quantity } = payload;
  if (quantity <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "quantity must be greater than 0",
    );
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id: cartItemId,
    },
    include: {
      cart: true,
      size: true,
      product: true,
    },
  });

  if (!cartItem) {
    throw new AppError(httpStatus.NOT_FOUND, "cart item not found");
  }

  if (cartItem.cart.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "you are not authorized to update this cart item",
    );
  }

  if (quantity > cartItem.size.quantity) {
    throw new AppError(httpStatus.BAD_REQUEST, "insufficient stock");
  }

  const updatedCartItem = await prisma.cartItem.update({
    where: {
      id: cartItemId,
    },
    data: {
      quantity,
    },
    include: {
      product: true,
      size: true,
    },
  });

  return updatedCartItem;
};

const removeCartItem = async (payload: {
  userId: string;
  cartItemId: string;
}) => {
  const { userId, cartItemId } = payload;
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id: cartItemId,
    },
    include: {
      cart: true,
    },
  });

  if (!cartItem) {
    throw new AppError(httpStatus.NOT_FOUND, "cart item not found");
  }

  if (cartItem.cart.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "you are not authorized to remove this cart item",
    );
  }

  await prisma.cartItem.delete({
    where: {
      id: cartItemId,
    },
  });

  return null;
};

const clearCart = async (userId: string) => {
  const result = await prisma.cartItem.deleteMany({
    where: {
      cart: {
        userId,
      },
    },
  });

  if (result.count === 0) {
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      throw new AppError(httpStatus.NOT_FOUND, "cart not found");
    }
  }

  return {
    message: "Cart cleared successfully",
  };
};

const deleteCart = async (cartId: string) => {
  const cart = await prisma.cart.findUnique({
    where: {
      id: cartId,
    },
  });

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, "cart not found");
  }

  await prisma.cart.delete({
    where: {
      id: cartId,
    },
  });

  return {
    message: "Cart deleted successfully",
  };
};

const calculateCartSummary = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
          size: true,
        },
      },
    },
  });

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, "cart not found");
  }

  let totalItems = 0;
  let subtotal = 0;

  cart.items.forEach((item) => {
    totalItems += item.quantity;
    subtotal += Number(item.size.price) * item.quantity;
  });

  return {
    totalItems,
    subtotal,
    shipping: 0,
    discount: 0,
    tax: 0,
    total: subtotal,
  };
};

export const cartService = {
  getAllCart,
  getCartById,
  getMyCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  deleteCart,
  calculateCartSummary,
};
