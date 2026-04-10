import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-expo';
import { useCartStore } from '@/src/store/cart-store';
import { createOrder } from '@/src/api/orders';
import { checkPaymentStatus, paymentCreditCard, paymentKQCode } from '@/src/api/payments';

// --- Types ---
export interface SavedMethod {
    id: string;
    type: 'aba' | 'card';
    lastDigits: string;
    brand?: string;
}

export interface WebViewPostSource {
    uri: string;
    method: 'POST';
    body: string;
    headers: { 'Content-Type': string };
}

export const SAVED_METHODS: SavedMethod[] = [
    { id: 'save_1', type: 'aba', lastDigits: '789' },
    { id: 'save_2', type: 'card', lastDigits: '4242', brand: 'Visa' },
];

export const usePaymentLogic = (onSuccess: () => void) => {
    const { getToken } = useAuth();
    const { items, delivery, shippingDetails } = useCartStore();

    const [loading, setLoading] = useState(false);
    const [qrVisible, setQrVisible] = useState(false);
    const [showWebView, setShowWebView] = useState(false);
    const [webViewSource, setWebViewSource] = useState<WebViewPostSource | null>(null);
    const [qrData, setQrData] = useState<{ qrString: string, deeplink: string, orderNumber: string } | null>(null);

    // --- Polling Logic ---
    useEffect(() => {
        let interval: any;
        if ((qrVisible && qrData) || (showWebView && qrData)) {
            const startTime = Date.now();
            interval = setInterval(async () => {
                const elapsedSeconds = (Date.now() - startTime) / 1000;
                if (elapsedSeconds > 300) {
                    clearInterval(interval);
                    setQrVisible(false);
                    setShowWebView(false);
                    Alert.alert("Session Expired", "Payment time limit reached.");
                    return;
                }
                if (!qrData?.orderNumber) return;

                try {
                    const response = await checkPaymentStatus(qrData.orderNumber);
                    if (response.status === 'PAID' || response.success === true) {
                        clearInterval(interval);
                        onSuccess();
                    }
                } catch (error) {
                    console.error("Polling check failed:", error);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [qrVisible, showWebView, qrData]);

    // --- Mutations ---
    const payWithQRCodeMutation = useMutation({
        mutationFn: async (orderNumber: string) => {
            const response = await paymentKQCode(orderNumber);
            return { ...response, orderNumber };
        },
        onSuccess: (data) => {
            if (data.success && data.qrString) {
                setQrData({ qrString: data.qrString, deeplink: data.deeplink, orderNumber: data.orderNumber });
                setQrVisible(true);
            }
        },
    });

    const payWithCardMutation = useMutation({
        mutationFn: (orderNumber: string) => paymentCreditCard(orderNumber),
        onSuccess: (data) => {
            if (data.url && data.params) {
                const formBody = Object.keys(data.params)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data.params[key])}`)
                    .join('&');
                setQrData({ qrString: '', deeplink: '', orderNumber: data.orderNumber });
                setWebViewSource({
                    uri: data.url,
                    method: 'POST',
                    body: formBody,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                setShowWebView(true);
            }
        },
    });

    const handlePay = async (selectedId: string) => {
        setLoading(true);
        try {
            const token = await getToken();
            if (!token) {
                Alert.alert("Error", "You must be logged in to pay.");
                return;
            }
            const itemsData = items.map(i => ({ productId: i.id, quantity: i.quantity }));

            // Determine Label
            const saved = SAVED_METHODS.find(m => m.id === selectedId);
            const paymentMethodLabel = selectedId === 'new_aba' ? "ABA KHQR" :
                selectedId === 'new_card' ? "Credit Card" :
                    `Saved ${saved?.type}`;


            const order = await createOrder(
                itemsData,
                { customerName: shippingDetails.fullName, email: shippingDetails.email, phone: shippingDetails.phoneNumber, addressLine: shippingDetails.address, city: shippingDetails.city },
                { title: delivery.title, fee: delivery.price },
                paymentMethodLabel,
                token
            );

            if (selectedId === 'new_aba') payWithQRCodeMutation.mutate(order.orderNumber);
            else if (selectedId === 'new_card') payWithCardMutation.mutate(order.orderNumber);
            else onSuccess(); // Assuming saved method logic

        } catch (error) {
            Alert.alert("Order Error", "Failed to process items.");
        } finally {
            setLoading(false);
        }
    };

    return {
        loading, qrVisible, setQrVisible, showWebView, setShowWebView,
        webViewSource, setWebViewSource, qrData, handlePay
    };
};