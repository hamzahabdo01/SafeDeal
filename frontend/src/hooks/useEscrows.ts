import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { escrowService } from '../services/escrow';
import { SUCCESS_MESSAGES } from '../utils/constants';
import type { Escrow, CreateEscrowRequest } from '../types';
import { useAsync } from './useAsync';

export function useEscrows() {
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  
  const {
    isLoading: isLoadingEscrows,
    error: escrowsError,
    execute: fetchEscrows,
  } = useAsync(async () => {
    const data = await escrowService.getEscrows();
    setEscrows(data);
    return data;
  });

  const {
    isLoading: isCreating,
    error: createError,
    execute: createEscrow,
  } = useAsync(async (escrowData: CreateEscrowRequest) => {
    const newEscrow = await escrowService.createEscrow(escrowData);
    setEscrows(prev => [newEscrow, ...prev]);
    toast.success(SUCCESS_MESSAGES.ESCROW_CREATED);
    return newEscrow;
  });

  const {
    isLoading: isReleasing,
    error: releaseError,
    execute: releaseEscrow,
  } = useAsync(async (id: number) => {
    await escrowService.releaseEscrow(id);
    setEscrows(prev =>
      prev.map(escrow =>
        escrow.ID === id ? { ...escrow, status: 'Released' } : escrow
      )
    );
    toast.success(SUCCESS_MESSAGES.ESCROW_RELEASED);
  });

  const getEscrowById = (id: number): Escrow | undefined => {
    return escrows.find(escrow => escrow.ID === id);
  };

  const getEscrowsByStatus = (status: string): Escrow[] => {
    return escrows.filter(escrow => escrow.status === status);
  };

  useEffect(() => {
    fetchEscrows();
  }, []);

  return {
    escrows,
    isLoadingEscrows,
    escrowsError,
    isCreating,
    createError,
    isReleasing,
    releaseError,
    fetchEscrows,
    createEscrow,
    releaseEscrow,
    getEscrowById,
    getEscrowsByStatus,
  };
}