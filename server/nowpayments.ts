/**
 * NOWPayments API Integration
 * Crypto payment processing for okkyno.com
 * 
 * API Documentation: https://documenter.getpostman.com/view/7907941/S1a32n38
 */

import axios from 'axios';

interface NOWPaymentsConfig {
    apiKey: string;
    ipnSecret?: string;
    sandbox?: boolean;
}

interface CreatePaymentParams {
    priceAmount: number;
    priceCurrency: string;
    payCurrency?: string;
    orderId: string;
    orderDescription?: string;
    ipnCallbackUrl?: string;
    successUrl?: string;
    cancelUrl?: string;
}

interface PaymentResponse {
    payment_id: string;
    payment_status: string;
    pay_address: string;
    price_amount: number;
    price_currency: string;
    pay_amount: number;
    pay_currency: string;
    order_id: string;
    order_description: string;
    ipn_callback_url: string;
    created_at: string;
    updated_at: string;
    purchase_id: string;
    amount_received: number;
    payin_extra_id: string | null;
    smart_contract: string | null;
    network: string;
    network_precision: number;
    time_limit: number | null;
    burning_percent: number | null;
    expiration_estimate_date: string;
}

interface PaymentStatus {
    payment_id: string;
    payment_status: string;
    pay_address: string;
    price_amount: number;
    price_currency: string;
    pay_amount: number;
    pay_currency: string;
    actually_paid: number;
    actually_paid_at_fiat: number;
    order_id: string;
    order_description: string;
    purchase_id: string;
    created_at: string;
    updated_at: string;
    outcome_amount: number;
    outcome_currency: string;
}

interface CurrencyInfo {
    id: number;
    code: string;
    name: string;
    enable: boolean;
    wallet_regex: string;
    priority: number;
    extra_id_exists: boolean;
    extra_id_regex: string | null;
    logo_url: string;
    track: boolean;
    cg_id: string;
    is_maxlimit: boolean;
    network: string;
    smart_contract: string | null;
    network_precision: number;
}

export class NOWPaymentsService {
    private apiKey: string;
    private ipnSecret: string;
    private baseUrl: string;

    constructor(config: NOWPaymentsConfig) {
        this.apiKey = config.apiKey || '';
        this.ipnSecret = config.ipnSecret || '';
        this.baseUrl = config.sandbox
            ? 'https://api-sandbox.nowpayments.io/v1'
            : 'https://api.nowpayments.io/v1';
    }

    /**
     * Get API status
     */
    async getStatus(): Promise<{ message: string }> {
        try {
            const response = await axios.get(`${this.baseUrl}/status`);
            return response.data;
        } catch (error: any) {
            console.error('NOWPayments status check failed:', error.message);
            throw new Error('Failed to check NOWPayments status');
        }
    }

    /**
     * Get available currencies
     */
    async getCurrencies(): Promise<{ currencies: string[] }> {
        try {
            const response = await axios.get(`${this.baseUrl}/currencies`, {
                headers: {
                    'x-api-key': this.apiKey
                }
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to get currencies:', error.message);
            throw new Error('Failed to get available currencies');
        }
    }

    /**
     * Get minimum payment amount for a currency
     */
    async getMinimumPaymentAmount(currencyFrom: string, currencyTo: string = 'btc'): Promise<{ min_amount: number }> {
        try {
            const response = await axios.get(`${this.baseUrl}/min-amount`, {
                headers: {
                    'x-api-key': this.apiKey
                },
                params: {
                    currency_from: currencyFrom,
                    currency_to: currencyTo
                }
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to get minimum amount:', error.message);
            throw new Error('Failed to get minimum payment amount');
        }
    }

    /**
     * Get estimated price for payment
     */
    async getEstimatedPrice(amount: number, currencyFrom: string, currencyTo: string): Promise<{ estimated_amount: number }> {
        try {
            const response = await axios.get(`${this.baseUrl}/estimate`, {
                headers: {
                    'x-api-key': this.apiKey
                },
                params: {
                    amount,
                    currency_from: currencyFrom,
                    currency_to: currencyTo
                }
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to get estimated price:', error.message);
            throw new Error('Failed to get estimated price');
        }
    }

    /**
     * Create a payment/invoice
     */
    async createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
        if (!this.apiKey) {
            throw new Error('NOWPayments API key is not configured');
        }

        try {
            const payload = {
                price_amount: params.priceAmount,
                price_currency: params.priceCurrency.toLowerCase(),
                pay_currency: params.payCurrency?.toLowerCase() || 'btc',
                order_id: params.orderId,
                order_description: params.orderDescription || `Order #${params.orderId}`,
                ipn_callback_url: params.ipnCallbackUrl,
                success_url: params.successUrl,
                cancel_url: params.cancelUrl
            };

            const response = await axios.post(`${this.baseUrl}/payment`, payload, {
                headers: {
                    'x-api-key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error: any) {
            console.error('Failed to create payment:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to create payment');
        }
    }

    /**
     * Create an invoice (hosted payment page)
     */
    async createInvoice(params: CreatePaymentParams): Promise<{ id: string; token_id: string; invoice_url: string }> {
        if (!this.apiKey) {
            throw new Error('NOWPayments API key is not configured');
        }

        try {
            const payload = {
                price_amount: params.priceAmount,
                price_currency: params.priceCurrency.toLowerCase(),
                order_id: params.orderId,
                order_description: params.orderDescription || `Order #${params.orderId}`,
                ipn_callback_url: params.ipnCallbackUrl,
                success_url: params.successUrl,
                cancel_url: params.cancelUrl
            };

            const response = await axios.post(`${this.baseUrl}/invoice`, payload, {
                headers: {
                    'x-api-key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error: any) {
            console.error('Failed to create invoice:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to create invoice');
        }
    }

    /**
     * Get payment status
     */
    async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
        if (!this.apiKey) {
            throw new Error('NOWPayments API key is not configured');
        }

        try {
            const response = await axios.get(`${this.baseUrl}/payment/${paymentId}`, {
                headers: {
                    'x-api-key': this.apiKey
                }
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to get payment status:', error.message);
            throw new Error('Failed to get payment status');
        }
    }

    /**
     * Verify IPN callback signature
     */
    verifyIPNSignature(payload: any, signature: string): boolean {
        if (!this.ipnSecret) {
            console.warn('IPN secret not configured, skipping signature verification');
            return true;
        }

        const crypto = require('crypto');

        // Sort the payload keys and create a string
        const sortedKeys = Object.keys(payload).sort();
        const sortedPayload: Record<string, any> = {};
        for (const key of sortedKeys) {
            sortedPayload[key] = payload[key];
        }

        const payloadString = JSON.stringify(sortedPayload);
        const expectedSignature = crypto
            .createHmac('sha512', this.ipnSecret)
            .update(payloadString)
            .digest('hex');

        return signature === expectedSignature;
    }

    /**
     * Get list of payments
     */
    async getPayments(limit: number = 10, page: number = 0): Promise<{ data: PaymentStatus[]; total: number }> {
        if (!this.apiKey) {
            throw new Error('NOWPayments API key is not configured');
        }

        try {
            const response = await axios.get(`${this.baseUrl}/payment`, {
                headers: {
                    'x-api-key': this.apiKey
                },
                params: {
                    limit,
                    page
                }
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to get payments:', error.message);
            throw new Error('Failed to get payments list');
        }
    }
}

// Default instance with client's API key
export const nowPaymentsService = new NOWPaymentsService({
    apiKey: '45R77CP-T8ZMVQT-K4ASMB3-2DKJYAT',
    sandbox: false
});

export default NOWPaymentsService;
