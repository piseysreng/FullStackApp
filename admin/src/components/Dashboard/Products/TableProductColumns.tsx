'use client'

import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "../../../../components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../../../components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "../../../../components/ui/dialog"; // Ensure you have a Dialog component
import { Button } from "../../../../components/ui/button";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "../../../../components/ui/aspect-ratio";
import { EditProductForm } from "@/src/components/Dashboard/Products/EditProduct"; // Your client form
import { toast } from "sonner";
import { deleteProductById } from "@/src/actions/productAction";
import { Badge } from "@/components/ui/badge";
import { ProductWithRelations } from "@/src/types/types";

const columnHelper = createColumnHelper<ProductWithRelations>();

const ActionCell = ({ product }: { product: ProductWithRelations }) => {
    if (!product) return null;

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${product.name}?`)) return;

        setIsDeleting(true);
        try {
            const result = await deleteProductById(product.id);
            if (result.success) {
                toast.success("Product deleted successfully");
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast.error("Something went wrong while deleting");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" disabled={isDeleting}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className={isDeleting ? "animate-pulse" : ""} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setIsEditDialogOpen(true);
                        }}
                    >
                        <SquarePen className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                        disabled={isDeleting}
                        onSelect={(e) => {
                            e.preventDefault(); // Prevent menu from closing immediately
                            handleDelete();
                        }}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Product: {product.name}</DialogTitle>
                    </DialogHeader>

                    <EditProductForm
                        id={String(product.id)}
                        fetchedProduct={product}
                        onSuccess={() => setIsEditDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export const ProductColumns = [
    columnHelper.display({
        id: 'action',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
        />
    }),
    columnHelper.display({
        id: 'No',
        header: () => 'No',
        cell: ({ row }) => {
            const id = row.index + 1;
            return (<div>{id}</div>);
        }
    }),
    // columnHelper.accessor('featureImage', {
    //     header: () => 'Feature Image',
    //     cell: (info) => {
    //         return (<div className="w-25">
    //             <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg overflow-hidden">
    //                 <Image
    //                     src={info.getValue()}
    //                     alt="Picture of the author"
    //                     fill // This makes it fill the AspectRatio container
    //                     className="object-cover" // This ensures the image isn't stretched
    //                     sizes="200px" // Helps Next.js optimize the image size
    //                 />
    //             </AspectRatio>
    //         </div>);
    //     },
    // }),
    columnHelper.accessor('name', {
        header: () => 'Name',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('price', {
        header: () => 'Price',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('stockQuantity', {
        header: () => 'Max Quantity',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('sku', {
        header: () => 'SKU',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('categories', {
        header: () => 'Categories',
        cell: (info) => {
            const relations = info.getValue() || [];

            if (relations.length === 0) {
                return <span className="text-muted-foreground italic text-xs">Uncategorized</span>;
            }
            return (
                <div>
                    {/* {JSON.stringify(relations, null, 2)} */}
                    {relations.map((item : any, index) => {
                        // Access name directly since 'item' is the category object
                        const name = item?.name;

                        return (
                            <Badge key={item?.id || index} variant="outline">
                                {name || "Unnamed"}
                            </Badge>
                        );
                    })}
                </div>
            );
        },
    }),
    columnHelper.accessor('isPublished', {
        header: 'Published',
        cell: (info) => {
            const isPublished = info.getValue();
            return (
                <Badge variant={isPublished ? "default" : "secondary"}>
                    {isPublished ? "Published" : "Draft"}
                </Badge>
            );
        },
    }),
    columnHelper.accessor('slug', {
        header: () => 'Slug',
        cell: (info) => info.getValue(),
    }),
    // columnHelper.accessor('galleryImages', {
    //     header: () => 'Gallery Images',
    //     cell: (info) => {
    //         const images = info.getValue() || []; // Ensure it's an array

    //         return (
    //             <div className="w-37.5"> {/* Container width to fit 3 images + gaps */}
    //                 <div className="grid grid-cols-3 gap-2">
    //                     {images.map((src: string, index: number) => (
    //                         <AspectRatio
    //                             key={index}
    //                             ratio={1 / 1}
    //                             className="bg-muted rounded-md overflow-hidden border"
    //                         >
    //                             <Image
    //                                 src={src || "https://placehold.co/100x100?text=No+Image"}
    //                                 alt={`Gallery image ${index + 1}`}
    //                                 fill
    //                                 className="object-cover"
    //                                 sizes="(max-width: 768px) 33vw, 100px"
    //                             />
    //                         </AspectRatio>
    //                     ))}
    //                 </div>

    //                 {images.length === 0 && (
    //                     <span className="text-xs text-muted-foreground italic block mt-2">
    //                         No images
    //                     </span>
    //                 )}
    //             </div>
    //         );
    //     },
    // }),
    columnHelper.display({
        id: "actions",
        header: () => 'Action',
        enableHiding: false,
        cell: ({ row }) => {
            return <ActionCell product={row.original} />;
        },
    }),
];