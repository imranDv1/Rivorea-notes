"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useFavNotificationStore } from "@/context/updateFavorite";
import NotesLoadingSkeleton from "../create/_components/NotesLoadingSkeleton ";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type FavoriteNote = {
  id: string;
  userId: string;
  noteId: string;
  createdAt: Date;
  note: {
    id: string;
    title: string;
    description: string;
    category: string[];
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  };
};

const FavoritesPage = () => {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const [favorites, setFavorites] = useState<FavoriteNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState<
    Record<string, boolean>
  >({});

  const refreshSignal = useFavNotificationStore(
    (state) => state.refreshFavSignal
  );

  const triggerFavRefresh = useFavNotificationStore(
    (state) => state.triggerFavRefresh
  );

  useEffect(() => {
    if (!userId) return;

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/favorite?userId=${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-cache",
        });

        if (!res.ok) throw new Error("Failed to fetch favorites");

        const data = await res.json();
        setFavorites(data);
      } catch (err: any) {
        console.error("Error fetching favorites:", err);
        toast.error(err.message || "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId, refreshSignal]);

  const handleRemoveFavorite = async (noteId: string) => {
    if (!userId) return;

    setFavoriteLoading((prev) => ({ ...prev, [noteId]: true }));

    try {
      const res = await fetch("/api/favorite", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, noteId }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Request failed");

      // Remove from local state
      setFavorites((prev) => prev.filter((fav) => fav.noteId !== noteId));
      toast.success("Removed from favorites!");
      triggerFavRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove favorite");
    } finally {
      setFavoriteLoading((prev) => ({ ...prev, [noteId]: false }));
    }
  };

  if (loading) {
    return <NotesLoadingSkeleton count={6} />;
  }

  return (
    <div className="w-full min-h-screen mt-4">
      <div className="w-full flex flex-col gap-5">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <h1 className="text-2xl font-bold">Favorite Notes</h1>
          <p className="text-sm text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? "note" : "notes"}
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {favorites.map((favorite) => (
              <Card key={favorite.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="line-clamp-2">
                      {favorite.note.title}
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="p-0 hover:cursor-pointer"
                          disabled={favoriteLoading[favorite.noteId]}
                          onClick={() => handleRemoveFavorite(favorite.noteId)}
                        >
                          {favoriteLoading[favorite.noteId] ? (
                            <Loader2 className="animate-spin size-4" />
                          ) : (
                            <Star className="size-4" fill="gold" color="gold" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove from Favorites</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {favorite.note.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2 flex-wrap">
                  {favorite.note.category.length > 0 ? (
                    favorite.note.category.map((tag, index) => (
                      <Badge
                        variant="outline"
                        className="p-2"
                        key={`${favorite.noteId}-${index}`}
                      >
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No categories
                    </span>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link
                    href={`/dashboard/notes/${favorite.noteId}`}
                    className={buttonVariants()}
                  >
                    View Note
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {new Date(favorite.createdAt).toLocaleDateString()}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-10 min-h-[400px]">
            <Star className="size-16 text-muted-foreground mb-4 opacity-50" />
            <p className="text-gray-400 text-lg mb-2">No favorite notes yet</p>
            <p className="text-gray-500 text-sm text-center max-w-md">
              Start adding notes to your favorites by clicking the star icon on
              any note.
            </p>
            <Link
              href="/dashboard/create"
              className={buttonVariants({ className: "mt-4" })}
            >
              Go to Notes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
