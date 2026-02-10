'use client'

import { AppSidebar } from '@/src/components/Dashboard/DashboardLayout/app-sidebar'
import { CreateCategoryForm } from '@/src/components/Dashboard/Catetories/CreateCategory'
import { CreateProductForm } from '@/src/components/Dashboard/Products/CreateProduct'
import { OrdersTable } from '@/src/components/Dashboard/Orders/ordersPage'
import ProductsPage from '@/src/components/Dashboard/Products/ProductsPage'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import { ArrowUpIcon, SquarePlus } from 'lucide-react'
import React from 'react'

export default function DashboardCreateProductPage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 z-10 w-full bg-background">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard/categories">
                                        Categories
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Create Category</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    
                    <div>
                        <CreateCategoryForm/>
                    </div>
                    {/* <OrdersTable/> */}

                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
