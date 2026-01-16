"use client"

import * as React from "react"
import {
  AudioWaveform,
  BadgePercent,
  BookOpen,
  Bot,
  Boxes,
  Command,
  CreditCard,
  GalleryVerticalEnd,
  House,
  PackagePlus,
  Settings2,
  ShoppingCart,
  SquareTerminal,
  Star,
  Image,
  Users,
  ClipboardList,
  SquareStar,
  ShieldUser,
  UserRoundCog,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./dark-mode-icon"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: House,
    },
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: House,
    },
    {
      name: "Order Management",
      url: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      name: "Customer",
      url: "/dashboard/customers",
      icon: Users,
    },
    {
      name: "Coupon Code",
      url: "#",
      icon: BadgePercent,
    },
    {
      name: "Categories",
      url: "/dashboard/categories",
      icon: Boxes,
    },
    {
      name: "Transaction",
      url: "#",
      icon: CreditCard,
    },
    {
      name: "Brand",
      url: "#",
      icon: Star,
    },
  ],
  products: [
    {
      name: "Add Products",
      url: "/dashboard/products/create",
      icon: PackagePlus,
    },
    {
      name: "Product Media",
      url: "#",
      icon: Image,
    },
    {
      name: "Product List",
      url: "/dashboard/products",
      icon: ClipboardList,
    },
    {
      name: "Product Reviews",
      url: "#",
      icon: SquareStar,
    },    
  ],
  adminData: [
    {
      name: "Admin Role",
      url: "#",
      icon: ShieldUser,
    },
    {
      name: "Control Authority",
      url: "#",
      icon: UserRoundCog,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} title="Main Menu"/>
        <NavProjects projects={data.products} title="Product"/>
        <NavProjects projects={data.adminData} title="Admin"/>
        {/* <NavMain items={data.navMain} /> */}
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle/>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
