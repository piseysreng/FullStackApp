import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { checkPaymentStatus } from '@/src/api/payments';
import { useCartStore } from '@/src/store/cart-store'; // 1. Import your store

interface PaymentContextType {
  activeOrderNumber: string | undefined;
  paymentType: string | undefined;
  startPolling: (orderNumber: string, type: string) => void;
  stopPolling: () => void;
  isPaid: boolean;
  status: string | undefined;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [activeOrderNumber, setActiveOrderNumber] = useState<string | undefined>(undefined);
  const [paymentType, setPaymentType] = useState<string | undefined>(undefined);
  const [isPaid, setIsPaid] = useState(false);
  const pollingStartTime = useRef<number | null>(null);
  const queryClient = useQueryClient();

  // 2. Access resetCart from your Zustand store
  const resetCart = useCartStore((state) => state.resetCart);

  const { data } = useQuery({
    queryKey: ['globalPaymentStatus', activeOrderNumber, paymentType, isPaid],
    queryFn: async () => {
      if (!activeOrderNumber) return null;
      const elapsedSec = (Date.now() - pollingStartTime.current!) / 1000;
      if (elapsedSec > 180) return null;
      
      console.log(`LOG ⏱️ Polling Order: ${activeOrderNumber}`);
      return await checkPaymentStatus(activeOrderNumber);
    },
    enabled: !!activeOrderNumber && !isPaid,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      const isFinished = ['PAID', 'APPROVED', 'COMPLETED'].includes(status || '');

      if (isFinished || isPaid) return false;
      if (!pollingStartTime.current) return 10000;

      if (paymentType === 'new_aba') return 3000;

      const elapsedSec = (Date.now() - pollingStartTime.current) / 1000;
      if (elapsedSec > 180) return false;

      // Staggered intervals
      if (elapsedSec <= 30) return 10000;
      if (elapsedSec <= 60) return 15000;
      return 20000;
    },
  });

  // 3. Success Side Effect
  useEffect(() => {
    const status = data?.status;
    if (['PAID', 'APPROVED', 'COMPLETED'].includes(status || '')) {
      if (!isPaid) { 
        setIsPaid(true);
        
        // --- 🛒 RESET CART ACCORDING TO YOUR STORE ---
        console.log("✅ Payment Successful: Resetting Cart Store...");
        resetCart(); 
        // ---------------------------------------------
      }
    }
  }, [data?.status, isPaid, resetCart]);

  const startPolling = (orderNumber: string, type: string) => {
    queryClient.cancelQueries({ queryKey: ['globalPaymentStatus'] });
    queryClient.removeQueries({ queryKey: ['globalPaymentStatus'] });
    setIsPaid(false);
    setActiveOrderNumber(orderNumber);
    setPaymentType(type);
    pollingStartTime.current = Date.now();
  };

  const stopPolling = () => {
    setActiveOrderNumber(undefined);
    setIsPaid(false);
    pollingStartTime.current = null;
    queryClient.removeQueries({ queryKey: ['globalPaymentStatus'] });
  };

  return (
    <PaymentContext.Provider value={{
      activeOrderNumber,
      paymentType,
      startPolling,
      stopPolling,
      isPaid,
      status: data?.status
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export const usePaymentStatus = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error('usePaymentStatus must be used within PaymentProvider');
  return context;
};