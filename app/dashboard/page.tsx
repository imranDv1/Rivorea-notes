import Link from "next/link";
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
    <div className="mt-6 grid gap-6 sm:grid-cols-2">
      {tools.map(
        ({ href, icon: Icon, title, description, features }) => (
          <Link
            key={href}
            href={href}
            className="group relative"
          >
            {/* Folder Tab */}
            <div className="absolute -top-3 left-5 h-4 w-24 rounded-t-xl border border-b-0 border-primary/20 bg-primary/10 backdrop-blur-sm" />

            <div
              className="
                relative h-full overflow-hidden
                rounded-2xl rounded-tl-md
                border border-border/60
                bg-card
                p-6 pt-7
                shadow-sm
                transition-all duration-300
                hover:border-primary/40
                hover:shadow-xl
              "
            >
              {/* Glow */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
              </div>

              {/* Icon */}
              <div
                className="
                  relative mb-5 flex h-12 w-12 items-center justify-center
                  rounded-xl border border-primary/15
                  bg-primary/10
                "
              >
                <Icon className="size-6 text-primary" />
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-base font-semibold tracking-tight">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>

                <ul className="mt-5 space-y-3">
                  {features.map(({ icon: FeatureIcon, text }) => (
                    <li
                      key={text}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <FeatureIcon className="size-4 text-primary/70" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="relative mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                <span className="text-sm font-medium text-primary">
                  Open Tool
                </span>

                <ArrowRight
                  className="
                    size-4 text-primary
                    transition-transform duration-300
                    group-hover:translate-x-1
                  "
                />
              </div>
            </div>
          </Link>
        )
      )}
    </div>
  );
}