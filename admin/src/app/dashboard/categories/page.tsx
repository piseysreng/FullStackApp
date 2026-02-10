import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import CategoryPage from '@/src/components/Dashboard/Catetories/CategoryPage'
import { AppSidebar } from '@/src/components/Dashboard/DashboardLayout/app-sidebar'
import { Separator } from '@radix-ui/react-separator'
import { SquarePlus } from 'lucide-react'
import Link from 'next/link'

export default function DashboardCategoriesPage() {
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
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Category</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className='flex justify-between items-center'>
                        <div><h1>List of Categories</h1></div>
                        <div>
                            <Button
                                asChild
                                variant="outline">
                                <Link href="/dashboard/categories/create"><SquarePlus /> Add Category</Link>

                            </Button>
                        </div>
                    </div>
                    <div>
                        <CategoryPage/>
                    </div>
                    {/* <OrdersTable/> */}

                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
