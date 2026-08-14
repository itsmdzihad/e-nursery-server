import SSLCommerzPayment from "sslcommerz-lts";
import config from "../../config/index.js";

const setting = {
  store_id: config.store_id,
  store_passwd: config.store_pass,
  is_live: false,
};

const createPayment = async (payload: any) => {
  const data = {
    total_amount: 100,
    currency: "BDT",
    tran_id: "REF123", // use unique tran_id for each api call
    success_url: "http://localhost:3030/success",
    fail_url: "http://localhost:3030/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };
  const sslcz = new SSLCommerzPayment(
    setting.store_id,
    setting.store_passwd,
    setting.is_live,
  );
  const apiResponse = await sslcz.init(data);

  return { url: apiResponse.GatewayPageURL };
};

const processPayment = async (paymentId: string) => {};

const verifyPayment = async (payload: any) => {};

const handlePaymentSuccess = async (paymentId: string, payload: any) => {};

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
  handlePaymentSuccess,
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
};
