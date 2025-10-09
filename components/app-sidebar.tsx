"use client";

import * as React from "react";
import {
  IconCamera,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ClipboardCheck, Files, FileText, LayoutDashboard } from "lucide-react";
import { Logo } from "./logo";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useNotificationStore } from "@/context/notificationStore";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "All Notes",
      url: "/dashboard/create",
      icon: Files,
    },

    {
      title: "Tasks",
      url: "/dashaboard/tasks",
      icon: ClipboardCheck,
    },
    {
      title: "Workspaces",
      url: "#",
      icon: IconFolder,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
 const refreshSignal = useNotificationStore((state) => state.refreshSignal);
  const { data: session } = authClient.useSession();
  const [userData, setUserData] = React.useState({
    name: session?.user.name || "",
    email: session?.user.email || "",
    avatar: session?.user.image || "/images/userefult.jpeg",
  });

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user.id) return;

      try {
        const res = await fetch(`/api/user/profile?userId=${session.user.id}`);
        const data = await res.json();
        if (data.success) {
          setUserData({
            name: data.user.name,
            email: data.user.email,
            avatar: data.user.image || "/Images/userefult.jpeg",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    fetchUserData();
  }, [refreshSignal, session?.user.id]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/" className="flex item-center justify-start">
                <Logo />
                <span className="text-base font-semibold">Rivorea</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments
          userId={session?.user.id as string}
          items={data.documents}
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
