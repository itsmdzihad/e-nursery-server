import { prisma } from "../../config/db.js";

const getAllCart = async () => {
  const data = await prisma.cart.findMany();

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
    throw new Error("Cart not found");
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

const addItemToCart = async (
  userId: string,
  sizeId: string,
  quantity: number,
) => {
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

export const cartService = {
  getAllCart,
};
