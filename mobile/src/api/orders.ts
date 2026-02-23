const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function createOrder(token: string) {
    // 1. Log to your terminal/browser console to see if the token exists
    console.log("📡 Attempting fetch with Token:", token ? "✅ Token Found" : "❌ No Token");

    const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // This is the most important part
        },
        // 2. Send an empty body to ignore payload issues
        body: JSON.stringify({}) 
    });

    const data = await res.json();

    if (!res.ok) {
        console.log("❌ Server Response Error:", data);
        throw new Error(data.message || 'Error reaching backend');
    }
    
    return data;
}