'use client'

import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "./ui/data-table";
import { Checkbox } from "./ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { CreditCard, MoreHorizontal, PackageSearch, SquarePen, Trash2, TruckElectric, UserRoundSearch } from "lucide-react";
import { Category, Customers } from "@/assets/TYPES";
import { categories } from "@/assets/Categories";
import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";

const columnHelper = createColumnHelper<Category>();
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
    columnHelper.accessor('image', {
        header: () => 'Image',
        cell: (info) => {
            return (<div>
                <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                    <Image
                        src={info.getValue()}
                        width={500}
                        height={500}
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

export default function CategoryPage() {
    return (
        <div className="">
            <div className="">
                <DataTable<Category, any> columns={columns} data={categories} />
            </div>
        </div>
    )
}