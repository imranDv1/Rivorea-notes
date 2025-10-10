"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";


const NoteCardSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <CardDescription>
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-3/5 mt-2" />
      </CardDescription>
    </CardHeader>
    <CardContent className="flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </CardContent>
    <CardFooter className="flex justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
      <Skeleton className="h-8 w-8 rounded-md" />
    </CardFooter>
  </Card>
);

const NotesLoadingSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="w-full flex flex-col gap-5">
    {/* Header */}
    <div className="w-full flex justify-between items-center">
      <Skeleton className="h-8 w-40" />
      <div className="hidden lg:flex w-7/12">
        <Skeleton className="h-10 w-full rounded" />
      </div>
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>

    {/* Mobile search */}
    <div className="flex lg:hidden w-full">
      <Skeleton className="h-10 w-full rounded" />
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-max">
      {Array.from({ length: count }).map((_, i) => (
        <NoteCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default NotesLoadingSkeleton;