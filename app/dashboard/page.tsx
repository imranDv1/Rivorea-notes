
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/tiptap-utils";
import { FileKey2, Key, Notebook } from "lucide-react";
import { IconPassword } from "@tabler/icons-react";

export default function Page() {
  return (
    <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 items-center gap-3">
      <div>
        <Card >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Notebook className="size-5 text-primary" /> Notes
            </CardTitle>
            <CardDescription>Write All your notes and manage and share it with any one here </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/create"
              className={cn("w-full", buttonVariants())}
            >
              Notes
            </Link>
          </CardContent>
        </Card>

      
      </div>
      <div>
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" >
              <FileKey2  className="size-5 text-primary" />
              Password Management
            </CardTitle>
            <CardDescription>Manage all your passwords securely to not forget them again</CardDescription>
          </CardHeader>
          <CardContent>
                 <Link
              href="/dashboard/passwords"
              className={cn("w-full", buttonVariants())}
            >
              Password Management 
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
