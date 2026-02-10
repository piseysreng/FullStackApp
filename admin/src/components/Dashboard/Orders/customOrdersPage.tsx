'use client'

import { createColumnHelper } from "@tanstack/react-table";
import { ordersNew } from "@/assets/NewOrder";
import { CreditCard, MoreHorizontal, PackageSearch, SquarePen, Trash2, TruckElectric, UserRoundSearch } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Orders } from "@/assets/TYPES";

const columnHelper = createColumnHelper<Orders>();
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
            const id = row.index;
            return (<div>{id}</div>);
        }
    }),
    
    columnHelper.accessor('order_id', {
        header: () => 'Order ID',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('customer_id', {
        header: () => 'Customer ID',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('total_amount', {
        header: () => 'Total Amount',
        cell: (info) => {
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(info.getValue())
            return (<div>{formatted}</div>)
        },
    }),
    columnHelper.accessor('total_quantity', {
        header: () => 'Quantity',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('current_status', {
        header: () => 'Status',
        cell: (info) => info.getValue(),
    }),
    columnHelper.display({
        id: 'payment',
        header: ()=> 'Payment',
        cell: ()=> 'Unpaid'
    }),
    columnHelper.display({
        id: "actions",
        header: () => 'Action',
        enableHiding: false,
        cell: ({ row }) => {
            const orderID = row.original.order_id;

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
                            <PackageSearch />
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { console.log(orderID) }}>
                            <UserRoundSearch />
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { console.log(orderID) }}>
                            <CreditCard />
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => { console.log(orderID) }}>
                            <TruckElectric />
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

export default function CustomOrderPage() {
    return (
        <div className="">
            <div className="">
                {/* <DataTable<Orders, any> columns={columns} data={ordersNew} /> */}
            </div>
        </div>
    )
}