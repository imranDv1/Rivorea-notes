import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import data from "./data.json";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/tiptap-utils";
import { Notebook } from "lucide-react";

export default function Page() {
  return (
    <div className="grid grid-cols-3 items-center">
      <div >
<Card>
<CardHeader>
  <CardTitle className="flex items-center gap-2"><Notebook className="size-5 text-primary"/> Notes</CardTitle>
  <CardDescription>You can find all your notes here</CardDescription>
</CardHeader>
<CardContent>
  <Link href='/dashboard/create' className={cn("w-full",buttonVariants())}>
  Notes
  </Link>
</CardContent>
</Card>
      </div>
    </div>
  );
}
