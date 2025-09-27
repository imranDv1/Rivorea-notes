import { authClient } from "@/lib/auth-client";
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { UserDropdown } from "./UserDropdown";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LeftHeaderui = () => {
  const { data: sessiom, isPending } = authClient.useSession();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {sessiom ? (
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserDropdown
            email={sessiom.user.email}
            image={`${sessiom.user.image}`}
            name={sessiom.user.name}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
       
            className={cn(isScrolled && "lg:hidden")}
          >
            <Link href="/login">
              <span>Login</span>
            </Link>
          </Button>
          <Button asChild size="sm" className={cn(isScrolled && "lg:hidden")}>
            <Link href="#">
              <span>Sign Up</span>
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
          >
            <Link href="#">
              <span>Get Started</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeftHeaderui;
