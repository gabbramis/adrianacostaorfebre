"use client";

import * as React from "react";
import {
  IconDashboard,
  IconPackage,
  IconMail,
  IconDiamond,
  IconBrandSupernova,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Panel Principal",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Productos",
      url: "/admin/products",
      icon: IconPackage,
    },
    {
      title: "Diseños Pendientes",
      url: "/admin/orders",
      icon: IconBrandSupernova,
    },
  ],
  navSecondary: [
    {
      title: "Mensajes Recibidos",
      url: "/admin/messages",
      icon: IconMail,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="flex items-center select-none">
                <IconDiamond className="!size-5" />
                <span className="text-base font-semibold">
                  Adrianacostaorfebre
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
