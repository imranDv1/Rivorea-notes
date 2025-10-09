
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}

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
    </>
  );
}
