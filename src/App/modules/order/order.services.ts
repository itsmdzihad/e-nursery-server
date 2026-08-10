import { Decimal } from "@prisma/client/runtime/client";
import { prisma } from "../../config/db.js";
import AppError from "../../errors/AppError.js";
import {
  OrderStatus,
  PaymentStatus,
  Role,
} from "../../../generated/prisma/enums.js";

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

const getAllOrders = async (query: {
  page?: string;
  limit?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    ...(query.status && {
      status: query.status,
    }),
    ...(query.paymentStatus && {
      paymentStatus: query.paymentStatus,
    }),
  };

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
      },
    }),
    prisma.order.count({
      where,
    }),
  ]);

  if (!orders) {
    throw new AppError(404, "Orders not found");
  }

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: orders,
  };
};

const getMyOrders = async (
  userId: string,
  query: {
    page?: string;
    limit?: string;
    status?: OrderStatus;
  },
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  if (page < 1) {
    throw new AppError(400, "Page must be greater than 0");
  }

  if (limit < 1 || limit > 100) {
    throw new AppError(400, "Limit must be between 1 and 100");
  }

  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(query.status && {
      status: query.status,
    }),
  };

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
      },
    }),

    prisma.order.count({
      where,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: orders,
  };
};

const getSingleOrder = async (orderId: string, userId: string, role: Role) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
          size: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  if (role === Role.CUSTOMER && order.userId !== userId) {
    throw new AppError(403, "You are not allowed to view this order");
  }

  return order;
};

const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    CONFIRMED: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    PROCESSING: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    SHIPPED: [OrderStatus.OUT_FOR_DELIVERY],
    OUT_FOR_DELIVERY: [OrderStatus.DELIVERED],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[order.status].includes(status)) {
    throw new AppError(
      400,
      `Cannot change order status from ${order.status} to ${status}`,
    );
  }

  const result = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
    include: {
      items: true,
    },
  });

  return result;
};
const cancelOrder = async (
  orderId: string,
  userId: string,
  reason?: string,
) => {
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new AppError(404, "Order not found");
    }

    if (order.userId !== userId) {
      throw new AppError(403, "You are not allowed to cancel this order");
    }

    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.CONFIRMED
    ) {
      throw new AppError(
        400,
        `Order cannot be cancelled when status is ${order.status}`,
      );
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new AppError(400, "Paid order cannot be cancelled");
    }

    for (const item of order.items) {
      await tx.size.update({
        where: {
          id: item.sizeId,
        },
        data: {
          quantity: {
            increment: item.quantity,
          },
        },
      });
    }

    const cancelledOrder = await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: OrderStatus.CANCELLED,
      },
      include: {
        items: true,
      },
    });

    return cancelledOrder;
  });

  return result;
};
const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: PaymentStatus,
) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  const allowedTransitions: Record<PaymentStatus, PaymentStatus[]> = {
    UNPAID: [PaymentStatus.PAID, PaymentStatus.FAILED],
    PAID: [PaymentStatus.REFUNDED],
    FAILED: [PaymentStatus.PAID],
    REFUNDED: [],
  };

  if (!allowedTransitions[order.paymentStatus].includes(paymentStatus)) {
    throw new AppError(
      400,
      `Cannot change payment status from ${order.paymentStatus} to ${paymentStatus}`,
    );
  }

  const result = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      paymentStatus,
    },
    include: {
      items: true,
    },
  });

  return result;
};

const getOrdersByStatus = async (
  status: OrderStatus,
  query: {
    page?: string;
    limit?: string;
  },
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  if (page < 1) {
    throw new AppError(400, "Page must be greater than 0");
  }

  if (limit < 1 || limit > 100) {
    throw new AppError(400, "Limit must be between 1 and 100");
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where: {
        status,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
      },
    }),

    prisma.order.count({
      where: {
        status,
      },
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: orders,
  };
};
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
