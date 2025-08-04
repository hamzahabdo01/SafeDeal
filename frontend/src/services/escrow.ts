import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { Escrow, CreateEscrowRequest } from '../types';

class EscrowService {
  async createEscrow(escrowData: CreateEscrowRequest): Promise<Escrow> {
    return await apiClient.post<Escrow>(API_ENDPOINTS.ESCROWS, escrowData);
  }

  async getEscrow(id: number): Promise<Escrow> {
    return await apiClient.get<Escrow>(API_ENDPOINTS.ESCROW_BY_ID(id));
  }

  async getEscrows(): Promise<Escrow[]> {
    return await apiClient.get<Escrow[]>(API_ENDPOINTS.ESCROWS);
  }

  async releaseEscrow(id: number): Promise<{ message: string }> {
    return await apiClient.get<{ message: string }>(
      API_ENDPOINTS.RELEASE_ESCROW(id)
    );
  }

  // Helper method to get escrows by status
  async getEscrowsByStatus(status?: string): Promise<Escrow[]> {
    const params = status ? { status } : undefined;
    return await apiClient.get<Escrow[]>(API_ENDPOINTS.ESCROWS, params);
  }

  // Helper method to get user's escrows (as buyer or seller)
  async getUserEscrows(): Promise<{
    asBuyer: Escrow[];
    asSeller: Escrow[];
  }> {
    const allEscrows = await this.getEscrows();
    // Note: This assumes the backend returns user-specific escrows
    // You might need to adjust based on your backend implementation
    return {
      asBuyer: allEscrows, // Backend should filter these based on user ID
      asSeller: allEscrows, // Backend should filter these based on user ID
    };
  }
}

export const escrowService = new EscrowService();
export default escrowService;