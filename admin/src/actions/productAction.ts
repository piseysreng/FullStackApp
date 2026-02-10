'use server';

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UpdateProductType } from "../types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function listProducts() {
    try {
        const res = await fetch(`${API_URL}/products`);
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

export async function fetchProductById(id: number) {
    const res = await fetch(`${API_URL}/products/${id}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error('Error with connecting the database');
    }
    return data;
}

export async function createProduct(formData: FormData) {
    let redirectUrl = '/dashboard/products';
    const name = formData.get('name') as string;
    const featureImage = formData.get('featureImage') as File | null;
    const price = Number(formData.get('price')) || 0;
    const categories = JSON.parse(formData.get('categories') as string);
    const galleryFiles = formData.getAll('galleryImages') as File[];
    const sku = formData.get('sku') as string | null;
    const description = formData.get('description') as string | null;
    const rawStock = formData.get('stockQuantity');
    const stockQuantity = rawStock !== null ? Number(rawStock) : 0;
    const rawIsPublished = formData.get('isPublished');
    const isPublished = rawIsPublished !== null ? rawIsPublished === 'true' : undefined;

    let imageUrl = null;
    let galleryUrls: string[] = [];

    try {
        if (featureImage && featureImage.size > 0) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', featureImage);

            const uploadRes = await fetch(`${API_URL}/upload/single`, {
                method: 'POST',
                body: uploadFormData, // Send as FormData to your Express API
            });

            if (!uploadRes.ok) throw new Error('Image upload failed');
            const uploadData = await uploadRes.json();
            imageUrl = uploadData; // Ensure this matches your API response structure
        }

        if (galleryFiles.length > 0) {
            const multiUploadFormData = new FormData();
            // Append all files to the key 'files' as requested
            galleryFiles.forEach((file) => {
                multiUploadFormData.append('files', file);
            });

            const multiRes = await fetch(`${API_URL}/upload/multi`, {
                method: 'POST',
                body: multiUploadFormData,
            });

            if (!multiRes.ok) throw new Error('Gallery images upload failed');
            const multiData = await multiRes.json(); // Expecting an array of strings/URLs
            galleryUrls = multiData.files;
        }

        const res = await fetch(`${API_URL}/products/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                price,
                sku,
                description,
                stockQuantity,
                featureImage: imageUrl,
                galleryImages: galleryUrls,
                isPublished,
                categories
            }),
        });

        if (!res.ok) throw new Error('Failed to create product');

        return { success: true };
    } catch (error) {
        // redirectUrl = `/dashboard/products/create?errorMessage=${encodeURIComponent('Failed to create product')}`;
        console.error(error);
        return { success: false, error: (error as Error).message };
    }
}
// export async function createProduct(
//     name: string,
//     // price: number,
//     // sku?: string | null | undefined,
//     // description?: string | null | undefined,
//     // stockQuantity?: number | null | undefined,
//     // galleryImages?: string[] | undefined | null,
//     // isPublished?: boolean | undefined,
//     categories?: number[] | null,
//     featureImage?: File | null,
// ) {
//     let redirectUrl = '/dashboard/products';
//     let imageUrl = null;
//     try {

//         // STEP 1: Upload Image first if it exists
//         if (featureImage) {
//             const formData = new FormData();
//             formData.append('file', featureImage); // Adjust 'file' to match your Express multer field name

//             const uploadRes = await fetch(`${API_URL}/upload/single`, {
//                 method: 'POST',
//                 // Note: Don't set Content-Type header when sending FormData; 
//                 // the browser will set it automatically with the boundary.
//                 body: formData,
//             });

//             if (!uploadRes.ok) throw new Error('Image upload failed');

//             const uploadData = await uploadRes.json();
//             imageUrl = uploadData; // Adjust based on your Express response
//         }

//         // STEP 2: Create Category with the Image URL
//         const res = await fetch(`${API_URL}/products/`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 name,
//                 price: 11,
//                 sku: '',
//                 description: 'testing description',
//                 stockQuantity: 0,
//                 featureImage: imageUrl,
//                 galleryImages: [],
//                 isPublished: false,
//                 categories
//             }),
//         });

//         if (!res.ok) throw new Error('Failed to create product');

//         return { success: true };

//         // // const token = (await cookies()).get('token')?.value;
//         // const res = await fetch(`${API_URL}/products/`, {
//         //     method: 'POST',
//         //     headers: {
//         //         // 'Authorization': `${token}`,
//         //         'Content-Type': 'application/json',
//         //     },
//         //     body: JSON.stringify({
//         //         name,
//         //         price,
//         //         sku,
//         //         description,
//         //         stockQuantity,
//         //         featureImage,
//         //         galleryImages,
//         //         isPublished,
//         //         categories
//         //     }),
//         // });
//         // if (!res.ok) {
//         //     throw new Error('Failed to create product');
//         // }
//     } catch (error) {
//         redirectUrl = `/dashboard/products/create?errorMessage=${encodeURIComponent('Failed to create product')}`;
//     }
//     finally {
//         redirect(redirectUrl);
//     }
// }

// export async function createProduct(
//     name: string,
//     price: number,
//     sku?: string | null,
//     description?: string | null,
//     stockQuantity?: number | null,
//     featureImageFile?: File | null, // Changed to File
//     galleryImageFiles?: File[] | null, // Changed to File array
//     isPublished?: boolean,
//     categories?: number[] | null,
// ) {
//     let redirectUrl = '/dashboard/products';
//     const API_URL = process.env.NEXT_PUBLIC_API_URL;

//     try {
//         // 1. Upload Featured Image if it's a file
//         let featureImageUrl = "";
//         if (featureImageFile instanceof File) {
//             const formData = new FormData();
//             formData.append('file', featureImageFile);
//             const uploadRes = await fetch(`${API_URL}/upload/single`, {
//                 method: 'POST',
//                 body: formData,
//             });
//             if (!uploadRes.ok) throw new Error('Featured image upload failed');
//             const data = await uploadRes.json();
//             featureImageUrl = data.url;
//         }

//         // 2. Upload Gallery Images
//         const galleryUrls: string[] = [];
//         if (galleryImageFiles && galleryImageFiles.length > 0) {
//             for (const file of galleryImageFiles) {
//                 const formData = new FormData();
//                 formData.append('files', file);
//                 const uploadRes = await fetch(`${API_URL}/upload/multi`, {
//                     method: 'POST',
//                     body: formData,
//                 });
//                 if (uploadRes.ok) {
//                     const data = await uploadRes.json();
//                     galleryUrls.push(data.url);
//                 }
//             }
//         }

//         // 3. Create Product with URLs
//         const res = await fetch(`${API_URL}/products/`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 name,
//                 price,
//                 sku,
//                 description,
//                 stockQuantity,
//                 featureImage: featureImageUrl, // Sending the URL string
//                 galleryImages: galleryUrls,    // Sending array of URL strings
//                 isPublished,
//                 categories
//             }),
//         });

//         if (!res.ok) throw new Error('Failed to create product');

//     } catch (error) {
//         console.error(error);
//         redirectUrl = `/dashboard/products/create?errorMessage=${encodeURIComponent('Failed to create product')}`;
//     } finally {
//         redirect(redirectUrl);
//     }
// }



export async function updateProductAction(id: number, formData: FormData) {
    const name = formData.get('name') as string;
    // const featureImage = formData.get('featureImage') as File | null;
    const price = Number(formData.get('price')) || 0;
    const categories = formData.getAll('categories').map(Number);
    // const galleryFiles = formData.getAll('galleryImages') as File[];
    const sku = formData.get('sku') as string | null;
    const description = formData.get('description') as string | null;
    const rawStock = formData.get('stockQuantity');
    const stockQuantity = rawStock !== null ? Number(rawStock) : 0;
    const rawIsPublished = formData.get('isPublished');
    const isPublished = rawIsPublished !== null ? rawIsPublished === 'true' : undefined;

    // const galleryItems = formData.getAll("galleryImages");
    // const finalGalleryUrls: string[] = [];

    let imageUrl = null;
    // let galleryUrls: string[] = [];

    try {
        let featureImageUrl = formData.get("featureImage");

        // 1. Check if featureImage is a File to be uploaded
        if (featureImageUrl instanceof File) {
            const uploadData = new FormData();
            uploadData.append("file", featureImageUrl);

            const uploadRes = await fetch(`${API_URL}/upload/single`, {
                method: 'POST',
                body: uploadData,
            });

            if (!uploadRes.ok) throw new Error("Image upload failed");

            const uploadResult = await uploadRes.json();
            featureImageUrl = uploadResult; // Overwrite with the new URL
        }

        // --- 2. Handle Gallery Images (Mixed Strings and Files) ---
        const galleryItems = formData.getAll('galleryImages');
        const oldGalleryUrls: string[] = [];
        const newFilesToUpload: File[] = [];

        // Separate existing URLs from new Files
        galleryItems.forEach(item => {
            if (item instanceof File) {
                newFilesToUpload.push(item);
            } else if (typeof item === 'string' && item !== "") {
                oldGalleryUrls.push(item);
            }
        });

        let uploadedGalleryUrls: string[] = [];
        if (newFilesToUpload.length > 0) {
            // Option: Use /upload/multi if your API supports it
            const multiUploadData = new FormData();
            newFilesToUpload.forEach(file => multiUploadData.append("files", file));

            const multiRes = await fetch(`${API_URL}/upload/multi`, {
                method: 'POST',
                body: multiUploadData,
            });

            if (!multiRes.ok) throw new Error("Gallery upload failed");
            const multiData = await multiRes.json();
            const multiDataFile = multiData.files;
            // Assuming multiData is an array of strings or objects with urls
            uploadedGalleryUrls = multiDataFile.map((item: any) => typeof item === 'string' ? item : item.url);
        }
        // Combine Old URLs and New Uploaded URLs
        const finalGalleryImages = [...oldGalleryUrls, ...uploadedGalleryUrls];



        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                // 'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                price,
                sku,
                description,
                stockQuantity,
                featureImage: featureImageUrl,
                galleryImages: finalGalleryImages,
                isPublished,
                categories
            }),
        });

        const updatedProduct = res.json();

        // IMPORTANT: Purge the cache for the products page so the UI updates
        revalidatePath("/dashboard/products");
        revalidatePath(`/dashboard/products/${id}`);

        return { success: true, data: updatedProduct };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, error: "Internal Server Error" };
    }
}

export async function deleteProductById(id: number) {
    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                // 'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
        });
        revalidatePath("/dashboard/products");
        return { success: true };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, error: "Failed to delete product from database" };
    }
}


// export async function updateProductAction(formData: FormData) {
//     // 1. Extract the ID and existing data
//     const id = formData.get('id') as string;
//     if (!id) return { success: false, error: "Product ID is required for updating" };

//     const name = formData.get('name') as string;
//     const featureImage = formData.get('featureImage') as File | null;
//     const price = Number(formData.get('price')) || 0;
//     const categories = JSON.parse(formData.get('categories') as string);
//     const galleryFiles = formData.getAll('galleryImages') as File[];
//     const sku = formData.get('sku') as string | null;
//     const description = formData.get('description') as string | null;
//     const rawStock = formData.get('stockQuantity');
//     const stockQuantity = rawStock !== null ? Number(rawStock) : 0;
//     const rawIsPublished = formData.get('isPublished');
//     const isPublished = rawIsPublished !== null ? rawIsPublished === 'true' : undefined;

//     let imageUrl = undefined; // Use undefined so we don't overwrite if not provided
//     let galleryUrls: string[] | undefined = undefined;

//     try {
//         // 2. Only upload if a NEW file is provided
//         if (featureImage && featureImage.size > 0) {
//             const uploadFormData = new FormData();
//             uploadFormData.append('file', featureImage);

//             const uploadRes = await fetch(`${API_URL}/upload/single`, {
//                 method: 'POST',
//                 body: uploadFormData,
//             });

//             if (!uploadRes.ok) throw new Error('Image upload failed');
//             imageUrl = await uploadRes.json();
//         }

//         // Only upload gallery if NEW files are added
//         if (galleryFiles.length > 0 && galleryFiles[0] instanceof File && galleryFiles[0].size > 0) {
//             const multiUploadFormData = new FormData();
//             galleryFiles.forEach((file) => {
//                 multiUploadFormData.append('files', file);
//             });

//             const multiRes = await fetch(`${API_URL}/upload/multi`, {
//                 method: 'POST',
//                 body: multiUploadFormData,
//             });

//             if (!multiRes.ok) throw new Error('Gallery images upload failed');
//             const multiData = await multiRes.json();
//             galleryUrls = multiData.files;
//         }

//         // 3. Send PATCH request
//         const res = await fetch(`${API_URL}/products/${id}`, {
//             method: 'PATCH', // Or 'PUT' depending on your backend
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 name,
//                 price,
//                 sku,
//                 description,
//                 stockQuantity,
//                 // Only include images in payload if new ones were uploaded
//                 ...(imageUrl && { featureImage: imageUrl }),
//                 ...(galleryUrls && { galleryImages: galleryUrls }),
//                 isPublished,
//                 categories
//             }),
//         });

//         if (!res.ok) {
//             const errorData = await res.json();
//             throw new Error(errorData.message || 'Failed to update product');
//         }

//         return { success: true };
//     } catch (error) {
//         console.error("Update Action Error:", error);
//         return { success: false, error: (error as Error).message };
//     }
// }