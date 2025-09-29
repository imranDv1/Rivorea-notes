/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import { FilePlus2, Loader2, Star, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(5),
  category: z
    .array(z.string())
    .min(1, "Enter at least 1 tag")
    .max(3, "Max 3 tags allowed"),
});

type Note = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  title: string;
  description: string;
  category: string[];
};

type CreateNotesProps = {
  notes: Note[];
};

// ✅ Confirm Delete Dialog Component
const ConfirmDeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Delete</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Are you sure you want to delete this note? This action cannot be undone.
      </DialogDescription>
      <DialogFooter className="flex gap-2 justify-end mt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          size="lg"
          onClick={onConfirm}
          disabled={loading}
          className="bg-red-500 hover:bg-red-500"
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const CreateNotes = ({ notes }: CreateNotesProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const maxTags = 3;
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", category: [] },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const data = { ...values, userId };
    try {
      await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      toast.success("Note created successfully");
      setIsOpen(false);
      window.location.reload();
    } catch  {
      toast.error("Failed to create note");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && tags.length < maxTags && !tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        form.setValue("category", updatedTags);
        editForm.setValue("category", updatedTags); // ✅ sync edit form too
        setInputValue("");
      }
    }
  };

  const removeTag = (tag: string) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
    form.setValue("category", updatedTags);
    editForm.setValue("category", updatedTags); // ✅ sync edit form too
  };

  const handleDeleteClick = (noteId: string) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    setDeleteLoading(noteToDelete);
    try {
      const res = await fetch(`/api/create/${noteToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete note");
      toast.success("Note deleted successfully");
      window.location.reload();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDeleteLoading(null);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  const [favoriteStatus, setFavoriteStatus] = useState<Record<string, boolean>>(
    {}
  );
  const [favoriteLoading, setFavoriteLoading] = useState<
    Record<string, boolean>
  >({});

  const handleFavoriteToggle = async (noteId: string) => {
    if (!userId) return;

    setFavoriteLoading((prev) => ({ ...prev, [noteId]: true }));

    try {
      const isFavorite = favoriteStatus[noteId] ?? false;
      const res = await fetch("/api/favorite", {
        method: isFavorite ? "DELETE" : "POST", // ← toggle بين إضافة وحذف
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, noteId }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Request failed");

      setFavoriteStatus((prev) => ({ ...prev, [noteId]: !isFavorite }));
      toast.success(
        isFavorite ? "Removed from favorites!" : "Added to favorites!"
      );
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setFavoriteLoading((prev) => ({ ...prev, [noteId]: false }));
    }
  };

  useEffect(() => {
    if (!userId) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`/api/favorite?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch favorites");

        const favorites = await res.json();
        const favMap: Record<string, boolean> = {};
        favorites.forEach((fav: any) => {
          favMap[fav.noteId] = true;
        });

        setFavoriteStatus(favMap);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [userId]);

  const [isOpen, setIsOpen] = useState(false);

  // ✅ Edit Dialog States
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", category: [] },
  });

  const handleEditClick = (note: Note) => {
    setNoteToEdit(note);
    editForm.reset({
      title: note.title,
      description: note.description,
      category: note.category,
    });
    setTags(note.category);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
      title: values.title,
      description: values.description,
      category: values.category,
      id: noteToEdit?.id,
      userId,
    };
    if (!noteToEdit) return;
    setLoading(true);
    try {
      //  fix it the user id and noteIdd  make the put request in [id] fuildder

      const res = await fetch(`/api/create/editNote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update note");

      toast.success("Note updated successfully");
      setEditDialogOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Create Note Button & Dialog */}
      <div className="w-full flex justify-between">
        <h1 className="text-3xl font-bold">Notebooks</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            className={cn("flex items-center gap-2", buttonVariants())}
          >
            <FilePlus2 /> Create Note
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Notebook</DialogTitle>
              <DialogDescription>
                Create a new notebook to store your notes.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Note Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write a short description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add tag and press Enter"
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          disabled={tags.length >= maxTags}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="flex items-center gap-3 px-2 py-1"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        <X />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Loading...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-max">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{note.title}</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 hover:cursor-pointer"
                      disabled={favoriteLoading[note.id]}
                      onClick={() => handleFavoriteToggle(note.id)}
                    >
                      {favoriteLoading[note.id] ? (
                        <Loader2 className="animate-spin size-4" />
                      ) : (
                        <Star
                          className="size-4"
                          fill={favoriteStatus[note.id] ? "gold" : "none"}
                          color={favoriteStatus[note.id] ? "gold" : "gray"}
                        />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {favoriteStatus[note.id]
                        ? "Remove from Favorite"
                        : "Add to Favorite"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>{note.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              {note.category.map((tag, index) => (
                <Badge
                  variant="outline"
                  className="p-2"
                  key={`${note.id}-${index}`}
                >
                  {tag}
                </Badge>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Link href={`notes/${note.id}`} className={buttonVariants()}>
                  View
                </Link>
                <Button
                  variant="ghost"
                  className="hover:cursor-pointer"
                  onClick={() => handleEditClick(note)}
                >
                  Edit
                </Button>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteClick(note.id)}
                    disabled={deleteLoading === note.id}
                    className="hover:cursor-pointer"
                  >
                    {deleteLoading === note.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash2 />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete the notes</p>
                </TooltipContent>
              </Tooltip>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading !== null}
      />

      {/* ✅ Edit Note Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notebook</DialogTitle>
            <DialogDescription>Update your note details.</DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleEditSubmit)}
              className="space-y-6"
            >
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Note Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a short description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="category"
                render={() => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add tag and press Enter"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={tags.length >= maxTags}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="flex items-center gap-2 px-2 py-1"
                  >
                    {tag}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              <DialogFooter>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateNotes;
