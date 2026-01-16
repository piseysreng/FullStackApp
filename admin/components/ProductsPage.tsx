'use client'

import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "./ui/data-table";
import { Checkbox } from "./ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { CreditCard, MoreHorizontal, PackageSearch, SquarePen, Trash2, TruckElectric, UserRoundSearch } from "lucide-react";
import { Category, Customers, Product } from "@/assets/TYPES";
import { categories } from "@/assets/Categories";
import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";
import { products } from "@/assets/Products";

const columnHelper = createColumnHelper<Product>();
const columns = [
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

    columnHelper.accessor('name', {
        header: () => 'Name',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('price', {
        header: () => 'Price',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('quantity', {
        header: () => 'Max Quantity',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('kilos', {
        header: () => 'Weight',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('category_id', {
        header: () => 'Category',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('image', {
        header: () => 'Image',
        cell: (info) => {
            return (<div>
                <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg overflow-hidden">
                    <Image
                        src={info.getValue()}
                        sizes="100vw" 
                        fill
                        style={{ objectFit: 'cover' }} 
                        alt="Picture of the author"
                    />
                </AspectRatio>
            </div>);
        },
    }),

    columnHelper.display({
        id: "actions",
        header: () => 'Action',
        enableHiding: false,
        cell: ({ row }) => {
            const orderID = row.original.id;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { console.log(orderID) }}>
                            <SquarePen />
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { console.log(orderID) }}>
                            <Trash2 />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }),

];

export default function ProductsPage() {
    return (
        <div className="">
            <div className="">
                <DataTable<Product, any> columns={columns} data={products} />
            </div>
        </div>
    )
}