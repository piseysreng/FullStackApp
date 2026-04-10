import { create } from 'zustand';
import { checkPaymentStatus } from '@/src/api/payments';

export type PaymentType = 'new_aba' | 'new_card' | 'saved_method' | string;

interface ActiveOrderState {
  orderNumber: string | undefined;
  paymentMethod: PaymentType | null;
  status: string | null;
  isPolling: boolean;
  isPaid: boolean;
  
  startPolling: (orderId: string, method: PaymentType) => void;
  stopPolling: () => void;
  updateStatus: (status: string) => void;
}

export const useActiveOrderStore = create<ActiveOrderState>((set, get) => ({
  orderNumber: undefined,
  paymentMethod: null,
  status: null,
  isPolling: false,
  isPaid: false,

  startPolling: (orderId, method) => {
    if (get().orderNumber === orderId && get().isPolling) return;

    set({ 
      orderNumber: orderId, 
      paymentMethod: method, 
      isPolling: true, 
      isPaid: false, 
      status: 'PENDING' 
    });
  },

  stopPolling: () => {
    set({ isPolling: false, orderNumber: undefined, status: null });
  },

  updateStatus: (newStatus) => {
    const isPaid = newStatus === 'PAID' || newStatus === 'APPROVED';
    set({ status: newStatus, isPaid });
    if (isPaid) set({ isPolling: false });
  },
}));