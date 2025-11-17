"use client";

import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: React.ComponentType<any>;
    badge?: string;
  }[];
}) {
  const pathname = usePathname(); // current URL

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create Note"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <Link
                href="/dashboard/create"
                className="flex items-center gap-3"
              >
                <IconCirclePlusFilled />
                <span>Create Note</span>
              </Link>
            </SidebarMenuButton>
     
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url; // check if this item is active
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={`flex items-center gap-2 duration-200 p-2${
                    isActive
                      ? " text-primary"
                      : "hover:bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    {item.icon && <item.icon />}
                    <span className="flex items-center gap-2">
                      {item.title}
                      {item.badge && (
                        <span className="text-[10px] leading-none uppercase rounded px-1.5 py-0.5 bg-primary/10 text-primary">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
