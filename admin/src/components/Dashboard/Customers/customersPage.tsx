'use client'

import { createColumnHelper } from "@tanstack/react-table";
import { CreditCard, MoreHorizontal, PackageSearch, SquarePen, Trash2, TruckElectric, UserRoundSearch } from "lucide-react";
import { Customers } from "@/assets/TYPES";
import { customers } from "@/assets/Customer";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

const columnHelper = createColumnHelper<Customers>();
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
        header: ()=>  'No',
        cell: ({row})=>{
            const id = row.index + 1;
            return (<div>{id}</div>);
        }
    }),
    
    columnHelper.accessor('customer_id', {
        header: () => 'Customer ID',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
        header: () => 'Name',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('phone', {
        header: () => 'Phone Number',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('order_count', {
        header: () => 'Order Counts',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('total_spend', {
        header: () => 'Amount Spend',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('status', {
        header: () => 'Status',
        cell: (info) => info.getValue(),
    }),
    columnHelper.display({
        id: "actions",
        header: () => 'Action',
        enableHiding: false,
        cell: ({ row }) => {
            const orderID = row.original.customer_id;

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

export default function CustomersPage() {
    return (
        <div className="">
            <div className="">
                {/* <DataTable<Customers, any> columns={columns} data={customers} /> */}
            </div>
        </div>
    )
}