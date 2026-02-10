'use server';

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UpdateCategoryType, UpdateProductType } from "../types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function listCategory() {
    try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) {
            return { error: true, message: `API Error: ${res.status} ${res.statusText}` };
        }
        const data = await res.json();
        return data;
    } catch (err) {
        return {
            error: true,
            message: "The API is not running or is unreachable. Please check your connection."
        };
    }
}

// export async function fetchCategoryById(id: number) {
//     const res = await fetch(`${API_URL}/products/${id}`);
//     const data = await res.json();
//     if (!res.ok) {
//         throw new Error('Error with connecting the database');
//     }
//     return data;
// }

// export async function createCategory(
//     name: string,
//     description?: string | null | undefined,
//     image?: File | null,
//     parentId?: number | null | undefined
// ) {
//     let redirectUrl = '/dashboard/categories';
//     try {
//         // const token = (await cookies()).get('token')?.value;
//         const res = await fetch(`${API_URL}/categories/`, {
//             method: 'POST',
//             headers: {
//                 // 'Authorization': `${token}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 name,
//                 description,
//                 image,
//                 parentId
//             }),
//         });
//         if (!res.ok) {
//             throw new Error('Failed to create category');
//         }
//     } catch (error) {
//         redirectUrl = `/dashboard/categories/create?errorMessage=${encodeURIComponent('Failed to create category')}`;
//     }
//     finally {
//         redirect(redirectUrl);
//     }
// }


export async function createCategory(
    name: string,
    description: string | null | undefined,
    imageFile: File | null,
    parentId: number | null | undefined
) {
    let imageUrl = null;

    try {
        // STEP 1: Upload Image first if it exists
        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile); // Adjust 'file' to match your Express multer field name

            const uploadRes = await fetch(`${API_URL}/upload/single`, {
                method: 'POST',
                // Note: Don't set Content-Type header when sending FormData; 
                // the browser will set it automatically with the boundary.
                body: formData,
            });

            if (!uploadRes.ok) throw new Error('Image upload failed');
            
            const uploadData = await uploadRes.json();
            imageUrl = uploadData; // Adjust based on your Express response
        }

        // STEP 2: Create Category with the Image URL
        const res = await fetch(`${API_URL}/categories/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                description,
                image: imageUrl, // Send the URL string, not the File object
                parentId
            }),
        });

        if (!res.ok) throw new Error('Failed to create category');

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: (error as Error).message };
    }
}

// export async function updateCategoryAction(id: number, value: UpdateCategoryType) {
//     try {
//         const res = await fetch(`${API_URL}/categories/${id}`, {
//             method: 'PUT',
//             headers: {
//                 // 'Authorization': `${token}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(value),
//         });

//         const updatedCategory = res.json();

//         // IMPORTANT: Purge the cache for the products page so the UI updates
//         revalidatePath("/dashboard/categories");
//         revalidatePath(`/dashboard/categories/${id}`);

//         return { success: true, data: updatedCategory };
//     } catch (error) {
//         console.error("Database Error:", error);
//         return { success: false, error: "Internal Server Error" };
//     }
// }

export async function updateCategoryAction(id: number, value: UpdateCategoryType) {
    let imageUrl = value.image; // Default to the existing value (likely a URL string)

    try {
        // 1. Check if 'image' is a new File object for uploading
        if (value.image instanceof File) {
            const formData = new FormData();
            formData.append('file', value.image); // 'file' must match your Express/Multer field name

            const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/single`, {
                method: 'POST',
                // Browser automatically sets Content-Type to multipart/form-data with boundary
                body: formData,
            });

            if (!uploadRes.ok) {
                throw new Error('Image upload failed');
            }

            const uploadData = await uploadRes.json();
            imageUrl = uploadData; // Use the new URL from your Express API
        }

        // 2. Perform the actual Category Update
        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...value,
                image: imageUrl, // Replace the File object with the URL string
            }),
        });

        if (!res.ok) {
            throw new Error('Failed to update category');
        }

        const updatedCategory = await res.json();

        // 3. Purge the cache
        revalidatePath("/dashboard/categories");
        revalidatePath(`/dashboard/categories/${id}`);

        return { success: true, data: updatedCategory };
        
    } catch (error) {
        console.error("Update Error:", error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Internal Server Error" 
        };
    }
}

export async function deleteCategoryById(id: number) {
    try {
        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: {
                // 'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
        });
        revalidatePath("/dashboard/categories");
        return { success: true };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, error: "Failed to delete category from database" };
    }
}
