import { cn } from "@/lib/utils";
import Image from "next/image";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/icons/logo.png" // place your svg/png file in public/ directory
      alt="Logo"
      width={100}
      height={100}
      className={cn("h-12 w-auto", className)}
    />
  );
};

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/icons/logo.png"
      alt="Logo Icon"
      className={cn("size-12", className)}
      width={100}
      height={100}
    />
  );
};

export const LogoStroke = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/icons/logo.png"
      alt="Logo Stroke"
      className={cn("w-10 h-10", className)}
      width={100}
      height={100}
    />
  );
};