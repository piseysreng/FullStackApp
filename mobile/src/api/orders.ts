const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function createOrder(items: any[],shippingAddress: any ,deliveryOption: any,paymentMethod: any,token: string) {
    const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        // We send the items inside the body now
        body: JSON.stringify({ 
            items,
            shippingAddress,
            deliveryOption,
            paymentMethod
        }) 
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Error reaching backend');
    }
    return data;
}