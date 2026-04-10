const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function paymentKQCode(orderNumber: string) {
    const res = await fetch(`${API_URL}/payment/aba/qrcode`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            orderNumber,
        })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Error reaching backend');
    }
    return data;
}

export async function paymentCreditCard(orderNumber: string) {
    const res = await fetch(`${API_URL}/payment/aba/card`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            tran_id: orderNumber,
        })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Error reaching backend');
    }
    return data;
}

// export const checkPaymentStatus = async (orderNumber: string) => {
//     try {
//         const response = await fetch(`https://your-api.com/orders/${orderNumber}/status`);
//         const data = await response.json();

//         // Example: returns { status: 'PAID' } or { status: 'PENDING' }
//         return data; 
//     } catch (error) {
//         console.error("Status check failed", error);
//         throw error;
//     }
// };

export const checkPaymentStatus = async (orderNumber: string) => {
    const res = await fetch(`${API_URL}/payment/aba/check-status/${orderNumber}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            tran_id: orderNumber,
        })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Error reaching backend');
    }

    return {
        status: data.status,
        success: data.success,
        orderNumber: orderNumber
    };
};