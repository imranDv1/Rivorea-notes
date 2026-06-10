"use client";

import { Skeleton } from "@/components/ui/skeleton";

const NOTE_SKELETON_COLORS = [
  { bg: "#FEF9C3", border: "#FDE047" },
  { bg: "#FEF3C7", border: "#FCD34D" },
  { bg: "#DCFCE7", border: "#86EFAC" },
  { bg: "#E0F2FE", border: "#7DD3FC" },
  { bg: "#F3E8FF", border: "#D8B4FE" },
  { bg: "#FCE7F3", border: "#F9A8D4" },
];

const NoteCardSkeleton = ({ index = 0 }: { index?: number }) => {
  const color = NOTE_SKELETON_COLORS[index % NOTE_SKELETON_COLORS.length];

  return (
    <div
      className="relative flex flex-col rounded-none shadow-sm overflow-hidden"
      style={{
        backgroundColor: color.bg,
        border: `1px solid ${color.border}`,
        borderTopWidth: "4px",
      }}
    >
      {/* Fold corner */}
      <div
        className="absolute top-0 right-0 w-6 h-6 opacity-30"
        style={{
          background: `linear-gradient(225deg, ${color.border} 50%, transparent 50%)`,
        }}
      />

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title + star */}
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-2/3 bg-black/10" />
          <Skeleton className="h-4 w-4 rounded-full shrink-0 bg-black/10" />
        </div>

        {/* Description lines */}
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-full bg-black/10" />
          <Skeleton className="h-3.5 w-full bg-black/10" />
          <Skeleton className="h-3.5 w-4/5 bg-black/10" />
        </div>

        {/* Tags */}
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14 bg-black/10" />
          <Skeleton className="h-5 w-16 bg-black/10" />
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-t"
        style={{ borderColor: color.border, backgroundColor: `${color.border}33` }}
      >
        <Skeleton className="h-3 w-10 bg-black/10" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-6 w-12 bg-black/10" />
          <Skeleton className="h-6 w-10 bg-black/10" />
          <Skeleton className="h-6 w-6 bg-black/10" />
        </div>
      </div>
    </div>
  );
};

const NotesLoadingSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="w-full flex flex-col gap-6 mt-4">
    {/* Header */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-3.5 w-16 mt-1.5" />
      </div>
      <Skeleton className="h-9 flex-1 max-w-xs" />
      <Skeleton className="h-9 w-28 shrink-0" />
    </div>

    {/* Cards grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <NoteCardSkeleton key={i} index={i} />
      ))}
    </div>
  </div>
);

export default NotesLoadingSkeleton;