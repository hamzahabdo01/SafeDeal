import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { EscrowPayment, InitiatePaymentRequest } from '../types';

class PaymentService {
  async initiatePayment(paymentData: InitiatePaymentRequest): Promise<EscrowPayment> {
    return await apiClient.post<EscrowPayment>(
      API_ENDPOINTS.INITIATE_PAYMENT,
      paymentData
    );
  }

  async getPayments(): Promise<EscrowPayment[]> {
    return await apiClient.get<EscrowPayment[]>(API_ENDPOINTS.PAYMENTS);
  }

  async getPaymentsByEscrow(escrowId: number): Promise<EscrowPayment[]> {
    const params = { escrow_id: escrowId };
    return await apiClient.get<EscrowPayment[]>(API_ENDPOINTS.PAYMENTS, params);
  }

  async getPaymentsByStatus(status: string): Promise<EscrowPayment[]> {
    const params = { status };
    return await apiClient.get<EscrowPayment[]>(API_ENDPOINTS.PAYMENTS, params);
  }

  // Helper method to check if payment is completed
  isPaymentCompleted(payment: EscrowPayment): boolean {
    return payment.status === 'Completed';
  }

  // Helper method to check if payment is pending
  isPaymentPending(payment: EscrowPayment): boolean {
    return payment.status === 'Pending';
  }

  // Helper method to format payment amount
  formatPaymentAmount(payment: EscrowPayment): string {
    return `${payment.amount.toFixed(2)} ${payment.currency}`;
  }
}

export const paymentService = new PaymentService();
export default paymentService;