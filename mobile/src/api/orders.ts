const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function createOrder(items: any[]) {

    const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            order: {}, items
        })
    });
    const data = await res.json();
    if (!res.ok) {
        console.log(data);
        throw new Error('Error create order');
    }
    return data;
}