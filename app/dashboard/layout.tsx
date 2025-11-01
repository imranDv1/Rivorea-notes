import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Analytics } from "@vercel/analytics/next"
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { DialogProvider } from "@/context/CreateDialogContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <Analytics/>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="w-full max-w-[77rem] mx-auto px-4">
          <DialogProvider>{children}</DialogProvider>

          <Toaster
            richColors // enables success=green, error=red, warning=yellow, info=blue
            closeButton // adds a close button on each toast
            expand // makes stacked toasts expand instead of overlap
            toastOptions={{
              style: {
                background: "#111", // custom background
                color: "#fff", // text color
                border: "1px solid #333",
              },
              className: "rounded-2xl shadow-lg", // apply Tailwind classes
            }}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
