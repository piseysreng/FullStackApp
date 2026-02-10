import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function listCategories() {
    const res = await fetch(`${API_URL}/categories`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error('Error with connecting the database');
    }
    return data;
}

export async function fetchCategoryById(id: number) {
    const res = await fetch(`${API_URL}/categories/${id}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error('Error with connecting the database');
    }
    return data;
}

export async function listProductsByCategoryID(categoryId: number | null = null) {
    try {
        const res = await axios.get(`${API_URL}/products`, {
            params: { category_id: categoryId }
        });
        return res.data;
    } catch (error) {
        // Check if the error is specifically an Axios error
        if (axios.isAxiosError(error)) {
            // console.error(error.response?.data);
            throw new Error(error.response?.data?.message || 'Database connection failed');
        }
        
        // Handle non-Axios errors (like a code crash)
        throw new Error('An unexpected error occurred');
    }
}
