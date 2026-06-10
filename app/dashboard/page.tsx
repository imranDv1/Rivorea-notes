import Link from "next/link";
import { cn } from "@/lib/tiptap-utils";
import {
  FileKey2,
  Notebook,
  PenLine,
  Share2,
  Tag,
  ShieldCheck,
  Copy,
  Lock,
  ArrowRight,
} from "lucide-react";

const tools = [
  {
    href: "/dashboard/create",
    icon: Notebook,
    label: "Notes",
    title: "Notes",
    description: "Write, organise, and share your notes — all in one place.",
    features: [
      { icon: PenLine, text: "Rich text editor" },
      { icon: Share2, text: "Share via public link" },
      { icon: Tag, text: "Tags and folders" },
    ],
  },
  {
    href: "/dashboard/passwords",
    icon: FileKey2,
    label: "Passwords",
    title: "Password Manager",
    description: "One encrypted vault for every credential you own.",
    features: [
      { icon: ShieldCheck, text: "End-to-end encrypted" },
      { icon: Copy, text: "Copy without revealing" },
      { icon: Lock, text: "Auto-locks when idle" },
    ],
  },
];

export default function Page() {
  return (
    <div className="mt-5 flex flex-wrap gap-6">
      {tools.map(({ href, icon: Icon, title, description, features }) => (
        <Link
          key={href}
          href={href}
          className="group relative min-w-sm focus:outline-none"
        >
          {/* Folder tab */}
          <div className="absolute -top-3 left-0 h-4 w-24 rounded-t-lg bg-primary/50 border border-b-0 border-primary/30" />

          {/* Folder body */}
          <div className="relative  rounded-tl-none border border-primary/50 bg-primary/13 hover:bg-primary/10 transition-colors duration-200 p-5 pt-6">
            <div className="mb-3 w-10 h-10  bg-primary/15 flex items-center justify-center">
              <Icon className="size-5 text-primary" />
            </div>

            <p className="text-sm font-semibold text-foreground mb-1">
              {title}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              {description}
            </p>

            <ul className="space-y-1.5 mb-4">
              {features.map(({ icon: FIcon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <FIcon className="size-3 shrink-0 text-primary/70" />
                  {text}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-3 border-t border-primary/20">
              <span className="text-xs font-medium text-primary">Open</span>
              <ArrowRight className="size-3.5 text-primary transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
