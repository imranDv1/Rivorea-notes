// components/UserDropdown.tsx
"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  ChevronDownIcon,
  CircuitBoard,
  FileImage,
  LogOut,
  User,
  User2,
  UserCheck2,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface iAppProps {
  name: string;
  email: string;
  image: string;
}

export function UserDropdown({ email, name, image,  }: iAppProps) {
  const router = useRouter();

  async function SignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload()
          router.push("/"); 
          toast.success("Signout Successfuly");
        },
        onError: () => {
          toast.error("Faild to SignOut");
        },
      },
    });
  }
  return (
    <DropdownMenu >
      <DropdownMenuTrigger  asChild>
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <Avatar>
            <AvatarImage src={`${image}`} alt="Profile image" />
            <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon size={16} className="opacity-60" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent  align="end" className="w-48 bg-card">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span>{name}</span>
          <span className="text-muted-foreground text-sm">{email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Account</span>
          </Link>
        </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <User className="mr-2 h-4 w-4" />
              <span>Dahboard</span>
            </Link>
          </DropdownMenuItem>
      
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={SignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
