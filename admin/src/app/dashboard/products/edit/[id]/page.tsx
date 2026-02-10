// import { AppSidebar } from "@/components/app-sidebar";
// import { EditProductForm } from "@/components/EditProduct";
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// // Notice: params is a Promise, and we removed 'use client' because it's async
// export default async function DashboardEditProductPage({ 
//     params 
// }: { 
//     params: Promise<{ id: string }> 
// }) {
//     // Correctly awaiting the promise
//     const resolvedParams = await params;
//     const id = resolvedParams.id;

//     return (
//         <SidebarProvider>
//             <AppSidebar />
//             <SidebarInset>
//                 {/* ... existing header code ... */}
//                 <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//                     <div>
//                         {/* If EditProductForm expects a number, use Number(id).
//                           If it expects a string, id is fine.
//                         */}
//                         <EditProductForm /> 
//                     </div>
//                 </div>
//             </SidebarInset>
//         </SidebarProvider>
//     )
// }

// app/dashboard/products/edit/[id]/page.tsx
import { AppSidebar } from "@/src/components/Dashboard/DashboardLayout/app-sidebar";
import { EditProductForm } from "@/src/components/Dashboard/Products/EditProduct";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { fetchProductById } from "@/src/actions/productAction"; // Ensure this is imported

export default async function DashboardEditProductPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    const { id } = await params;
    
    // 1. Fetch the data on the server
    const product = await fetchProductById(Number(id));

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 items-center gap-2 px-4">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="h-4" />
                    <h1 className="font-semibold">Edit Product: {product.name}</h1>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="max-w-2xl mx-auto w-full">
                        {/* 2. Pass the product data to the Client Form */}
                        <EditProductForm id={id} fetchedProduct={product} /> 
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}