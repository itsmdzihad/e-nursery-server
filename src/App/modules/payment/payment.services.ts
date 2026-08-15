import SSLCommerzPayment from "sslcommerz-lts";
import config from "../../config/index.js";
import AppError from "../../errors/AppError.js";
import { prisma } from "../../config/db.js";
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "../../../generated/prisma/enums.js";
import { Prisma } from "../../../generated/prisma/client.js";

const setting = {
  store_id: config.store_id,
  store_passwd: config.store_pass,
  is_live: false,
};

const createPayment = async (payload: any) => {
  const { orderId, userId } = payload;

  if (!orderId) {
    throw new AppError(400, "Order ID is required");
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  if (order.userId !== userId) {
    throw new AppError(
      403,
      "You are not allowed to create payment for this order",
    );
  }

  if (order.status === OrderStatus.CANCELLED) {
    throw new AppError(400, "Cannot create payment for a cancelled order");
  }

  if (order.paymentStatus === PaymentStatus.PAID) {
    throw new AppError(
      400,
      "Payment has already been completed for this order",
    );
  }

  const existingPayment = await prisma.payment.findUnique({
    where: {
      orderId,
    },
  });

  if (existingPayment) {
    throw new AppError(400, "Payment already exists for this order");
  }

  const result = await prisma.payment.create({
    data: {
      orderId: order.id,
      userId: order.userId,
      amount: order.total,
      method: order.paymentMethod,
    },
  });

  return result;
};

const processPayment = async (paymentId: string, userId: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      user: true,
      order: {
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
              size: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  if (payment.userId !== userId) {
    throw new AppError(403, "You are not allowed to process this payment");
  }

  if (payment.status === PaymentStatus.PAID) {
    throw new AppError(400, "Payment has already been completed");
  }

  if (payment.status === PaymentStatus.REFUNDED) {
    throw new AppError(400, "Payment has already been refunded");
  }

  if (payment.status === PaymentStatus.CANCELLED) {
    throw new AppError(400, "Payment has been cancelled");
  }

  if (payment.order.status === OrderStatus.CANCELLED) {
    throw new AppError(400, "Cannot process payment for a cancelled order");
  }

  if (payment.method !== PaymentMethod.SSLCOMMERZ) {
    throw new AppError(400, "This payment method does not support SSLCommerz");
  }

  if (payment.order.paymentStatus === PaymentStatus.PAID) {
    throw new AppError(400, "Order payment has already been completed");
  }

  if (!payment.order.items.length) {
    throw new AppError(400, "Cannot process payment for an empty order");
  }

  const productName = payment.order.items
    .map((item) => {
      return `${item.product.name} - ${item.size.name} x${item.quantity}`;
    })
    .join(", ");

  const productCategory = [
    ...new Set(payment.order.items.map((item) => item.product.category.name)),
  ].join(", ");

  const data = {
    total_amount: Number(payment.amount),
    currency: payment.currency,

    tran_id: payment.id,

    success_url: config.base_url + `/payments/success`,
    fail_url: config.base_url + `/payments/failure`,
    cancel_url: config.base_url + `/payments/cancel`,
    ipn_url: config.base_url + `/payments/ipn`,

    shipping_method: "Courier",

    product_name: productName,
    product_category: productCategory,
    product_profile: "general",

    cus_name: payment.order.fullName,
    cus_email: payment.user.email,
    cus_phone: payment.order.phone,

    cus_add1: payment.order.addressLine,
    cus_add2: payment.order.landmark || "",
    cus_city: payment.order.district,
    cus_state: payment.order.division,
    cus_postcode: payment.order.postalCode || "",
    cus_country: payment.order.country,
    cus_fax: payment.order.phone,

    ship_name: payment.order.fullName,
    ship_add1: payment.order.addressLine,
    ship_add2: payment.order.landmark || "",
    ship_city: payment.order.district,
    ship_state: payment.order.division,
    ship_postcode: payment.order.postalCode || "",
    ship_country: payment.order.country,
  };

  const sslcz = new SSLCommerzPayment(
    setting.store_id,
    setting.store_passwd,
    setting.is_live,
  );

  const apiResponse = await sslcz.init(data);

  if (!apiResponse?.GatewayPageURL) {
    throw new AppError(500, "Failed to initialize SSLCommerz payment");
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.PENDING,
        gateway: "SSLCOMMERZ",
        gatewayData: apiResponse as Prisma.InputJsonValue,
      },
    }),

    prisma.order.update({
      where: {
        id: payment.orderId,
      },
      data: {
        paymentStatus: PaymentStatus.PENDING,
      },
    }),
  ]);

  return {
    url: apiResponse.GatewayPageURL,
  };
};

const ipnPayment = async (payload: any) => {
  const { tran_id, val_id } = payload;

  if (!tran_id) {
    throw new AppError(400, "Transaction ID is required");
  }

  if (!val_id) {
    throw new AppError(400, "Validation ID is required");
  }

  const payment = await prisma.payment.findUnique({
    where: {
      id: tran_id,
    },
    include: {
      order: true,
    },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  if (payment.status === PaymentStatus.PAID) {
    return {
      success: true,
      message: "Payment already processed",
      payment,
    };
  }

  if (payment.status === PaymentStatus.REFUNDED) {
    throw new AppError(400, "Payment has already been refunded");
  }

  if (payment.status === PaymentStatus.CANCELLED) {
    throw new AppError(400, "Payment has been cancelled");
  }

  if (payment.order.status === OrderStatus.CANCELLED) {
    throw new AppError(400, "Order has been cancelled");
  }

  const validationUrl = new URL(
    "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php",
  );

  validationUrl.searchParams.set("val_id", val_id);
  validationUrl.searchParams.set("store_id", setting.store_id);
  validationUrl.searchParams.set("store_passwd", setting.store_passwd);
  validationUrl.searchParams.set("v", "1");
  validationUrl.searchParams.set("format", "json");

  let validationResponse;

  try {
    const response = await fetch(validationUrl);

    const responseText = await response.text();

    if (!response.ok) {
      throw new AppError(
        502,
        `SSLCommerz validation API returned ${response.status}`,
      );
    }

    if (!responseText.trim()) {
      throw new AppError(
        502,
        "SSLCommerz validation API returned an empty response",
      );
    }

    try {
      validationResponse = JSON.parse(responseText);
    } catch {
      console.error("Invalid SSLCommerz response:", responseText);

      throw new AppError(502, "SSLCommerz returned an invalid JSON response");
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error("SSLCommerz validation request failed:", error);

    throw new AppError(502, "Unable to connect to SSLCommerz validation API");
  }

  if (!validationResponse) {
    throw new AppError(502, "Empty response received from SSLCommerz");
  }

  if (validationResponse.status !== "VALID") {
    throw new AppError(
      400,
      `Payment verification failed: ${validationResponse.status}`,
    );
  }

  if (validationResponse.tran_id !== payment.id) {
    throw new AppError(400, "Transaction ID does not match payment");
  }

  if (Number(validationResponse.amount) !== Number(payment.amount)) {
    throw new AppError(400, "Payment amount does not match");
  }

  if (validationResponse.currency !== payment.currency) {
    throw new AppError(400, "Payment currency does not match");
  }

  const result = await prisma.$transaction([
    prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.PAID,
        transactionId: validationResponse.bank_tran_id,
        paidAt: new Date(),
        gateway: "SSLCOMMERZ",
        gatewayData: validationResponse as Prisma.InputJsonValue,
      },
    }),

    prisma.order.update({
      where: {
        id: payment.orderId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.CONFIRMED,
      },
    }),
  ]);

  return {
    success: true,
    message: "Payment processed successfully",
    payment: result[0],
    order: result[1],
  };
};

const verifyPayment = async (payload: any) => {};

const handlePaymentFailure = async (paymentId: string, payload: any) => {};

const handlePaymentWebhook = async (payload: any) => {};

const updatePaymentStatus = async (paymentId: string, status: string) => {};

const getPaymentById = async (paymentId: string) => {};

const getPaymentByOrderId = async (orderId: string) => {};

const getUserPayments = async (userId: string) => {};

const getAllPayments = async (query: any) => {};

const refundPayment = async (paymentId: string, payload: any) => {};

const getRefundByPaymentId = async (paymentId: string) => {};

const cancelPayment = async (paymentId: string) => {};

const getPaymentHistory = async (paymentId: string) => {};

export const paymentService = {
  createPayment,
  processPayment,
  verifyPayment,
  handlePaymentFailure,
  handlePaymentWebhook,
  updatePaymentStatus,
  getPaymentById,
  getPaymentByOrderId,
  getUserPayments,
  getAllPayments,
  refundPayment,
  getRefundByPaymentId,
  cancelPayment,
  getPaymentHistory,
  ipnPayment,
};
