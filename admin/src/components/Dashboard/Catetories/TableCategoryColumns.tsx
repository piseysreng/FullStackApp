'use client'

import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "sonner";
import { EditCategoryForm } from "./EditCategory";
import { deleteCategoryById } from "@/src/actions/categoryAction";
import { CategoryType } from "@/src/db/schema";

const columnHelper = createColumnHelper<CategoryType>();

const ActionCell = ({ category }: { category: CategoryType }) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete the category "${category.name}"?`)) return;

        setIsDeleting(true);
        try {
            const result = await deleteCategoryById(category.id);
            if (result.success) {
                toast.success("Category deleted successfully");
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
                            e.preventDefault();
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
                        <DialogTitle>Edit Category: {category.name}</DialogTitle>
                    </DialogHeader>

                    <EditCategoryForm
                        id={String(category.id)}
                        fetchedCategory={category}
                        onSuccess={() => setIsEditDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export const CategoryColumns = [
    columnHelper.display({
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    }),
    columnHelper.display({
        id: 'No',
        header: 'No',
        cell: ({ row }) => row.index + 1
    }),
    // columnHelper.accessor('image', {
    //     header: 'Image',
    //     cell: (info) => (
    //         <div className="w-16">
    //             <AspectRatio ratio={1 / 1} className="bg-muted rounded-md overflow-hidden border">
    //                 <Image
    //                     src={info.getValue() || "https://placehold.co/400x400?text=No+Image"}
    //                     alt="Category"
    //                     fill
    //                     className="object-cover"
    //                     sizes="64px"
    //                 />
    //             </AspectRatio>
    //         </div>
    //     ),
    // }),
    columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('slug', {
        header: 'Slug',
        cell: (info) => <code className="text-xs bg-muted px-1 rounded">{info.getValue()}</code>,
    }),
    columnHelper.accessor('description', {
        header: 'Description',
        cell: (info) => (
            <span className="text-sm text-muted-foreground line-clamp-1 max-w-50">
                {info.getValue() || "No description"}
            </span>
        ),
    }),
    columnHelper.accessor('parentId', {
        header: 'Parent ID',
        cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
        id: "actions",
        header: 'Action',
        cell: ({ row }) => <ActionCell category={row.original} />,
    }),
];