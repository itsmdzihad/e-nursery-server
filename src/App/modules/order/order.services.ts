import { Decimal } from "@prisma/client/runtime/client";
import { prisma } from "../../config/db.js";
import AppError from "../../errors/AppError.js";

const createOrder = async (
  userId: string,
  payload: {
    addressId: string;
    paymentMethod: "COD" | "ONLINE";
  },
) => {
  const result = await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
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

    if (!cart || cart.items.length === 0) {
      throw new AppError(404, "Cart is empty");
    }

    const address = await tx.address.findFirst({
      where: {
        id: payload.addressId,
        userId,
      },
    });

    if (!address) {
      throw new AppError(404, "Address not found");
    }

    let subtotal = new Decimal(0);

    const orderItems = cart.items.map((item) => {
      if (item.size.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for ${item.product.name} - ${item.size.name}`,
        );
      }

      const price = item.size.price;
      const itemSubtotal = price.mul(item.quantity);

      subtotal = subtotal.add(itemSubtotal);

      return {
        productId: item.productId,
        sizeId: item.sizeId,
        productName: item.product.name,
        sizeName: item.size.name,
        price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      };
    });

    const deliveryFee = new Decimal(60);
    const total = subtotal.add(deliveryFee);

    const order = await tx.order.create({
      data: {
        userId,
        addressId: address.id,

        fullName: address.fullName,
        phone: address.phone,
        country: address.country,
        division: address.division,
        district: address.district,
        upazila: address.upazila,
        area: address.area,
        postalCode: address.postalCode,
        addressLine: address.addressLine,
        landmark: address.landmark,

        subtotal,
        deliveryFee,
        total,

        paymentMethod: payload.paymentMethod,

        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    for (const item of cart.items) {
      await tx.size.update({
        where: {
          id: item.sizeId,
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return order;
  });

  return result;
};

const getAllOrders = () => {};

const getMyOrders = () => {};

const getSingleOrder = () => {};

const updateOrderStatus = () => {};

const cancelOrder = () => {};

const updatePaymentStatus = () => {};

const getOrdersByStatus = () => {};

const getOrderSummary = () => {};

export const orderService = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder,
  updatePaymentStatus,
  getOrdersByStatus,
  getOrderSummary,
};
