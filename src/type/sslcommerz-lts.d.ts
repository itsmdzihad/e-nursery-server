declare module "sslcommerz-lts" {
  interface SSLCommerzResponse {
    GatewayPageURL: string;
    status?: string;
    failedreason?: string;
    sessionkey?: string;
    tran_date?: string;
    tran_id?: string;
    bank_tran_id?: string;
    validation_id?: string;
    amount?: string;
    currency?: string;
    risk_level?: string;
    risk_title?: string;
    [key: string]: unknown;
  }

  interface SSLCommerzPaymentData {
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url: string;
    shipping_method: string;
    product_name: string;
    product_category: string;
    product_profile: string;
    cus_name: string;
    cus_email: string;
    cus_add1: string;
    cus_add2?: string;
    cus_city: string;
    cus_state?: string;
    cus_postcode: string | number;
    cus_country: string;
    cus_phone: string;
    cus_fax?: string;
    ship_name?: string;
    ship_add1?: string;
    ship_add2?: string;
    ship_city?: string;
    ship_state?: string;
    ship_postcode?: string | number;
    ship_country?: string;
    [key: string]: unknown;
  }

  interface SSLCommerzConfig {
    store_id: string;
    store_passwd: string;
    is_live: boolean;
  }

  class SSLCommerzPayment {
    constructor(store_id: string, store_passwd: string, is_live: boolean);

    init(data: SSLCommerzPaymentData): Promise<SSLCommerzResponse>;

    validate(data: Record<string, unknown>): Promise<SSLCommerzResponse>;

    initiateRefund(data: Record<string, unknown>): Promise<SSLCommerzResponse>;

    refundQuery(data: Record<string, unknown>): Promise<SSLCommerzResponse>;

    transactionQueryByTransactionId(
      data: Record<string, unknown>,
    ): Promise<SSLCommerzResponse>;

    transactionQueryBySessionId(
      data: Record<string, unknown>,
    ): Promise<SSLCommerzResponse>;
  }

  export = SSLCommerzPayment;
}
