const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function listProducts () {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error ('Error with connecting the database');
    }
    return data;
}

export async function fetchProductById (id: number){
    const res = await fetch(`${API_URL}/products/${id}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error ('Error with connecting the database');
    }
    return data;
}

// export async function fetchProductByCategoryId (categoryId: number){
//     const res = await fetch(`${API_URL}/products/${categoryId}`);
//     const data = await res.json();
//     if (!res.ok) {
//         throw new Error ('Error with connecting the database');
//     }
//     return data;
// }