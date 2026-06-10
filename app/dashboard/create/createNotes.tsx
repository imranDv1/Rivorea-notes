/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import { FilePlus2, Loader2, Search, Star, Trash2, X, BookOpen, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import Link from "next/link";
import { useDialog } from "@/context/CreateDialogContext";
import { useNoteNotificationStore } from "@/context/notesUpateStore";
import { useFavNotificationStore } from "@/context/updateFavorite";
import { CreateNote } from "./action";

// ─── Constants & Types ────────────────────────────────────────────────────────

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(3),
  category: z
    .array(z.string())
    .min(0, "Enter at least 1 tag")
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

// ─── Note card color palette (paper tones) ────────────────────────────────────
const NOTE_COLORS = [
  { bg: "#FEF9C3", border: "#FDE047", accent: "#CA8A04" }, // yellow
  { bg: "#FEF3C7", border: "#FCD34D", accent: "#D97706" }, // amber
  { bg: "#DCFCE7", border: "#86EFAC", accent: "#16A34A" }, // mint
  { bg: "#E0F2FE", border: "#7DD3FC", accent: "#0284C7" }, // sky
  { bg: "#F3E8FF", border: "#D8B4FE", accent: "#9333EA" }, // purple
  { bg: "#FCE7F3", border: "#F9A8D4", accent: "#DB2777" }, // pink
];

function getNoteColor(id: string) {
  const idx =
    id
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0) % NOTE_COLORS.length;
  return NOTE_COLORS[idx];
}

// ─── Tag color mapping ────────────────────────────────────────────────────────
const TAG_COLORS = [
  "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
  "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
  "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
  "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200",
  "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200",
  "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200",
];

function getTagColor(tag: string) {
  const idx =
    tag
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0) % TAG_COLORS.length;
  return TAG_COLORS[idx];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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
    <DialogContent className="max-w-sm ">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold ">
          Delete this note?
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-500 mt-1">
          This action cannot be undone. The note will be permanently removed.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex gap-2 mt-4">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="flex-1 "
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1  bg-red-500 hover:bg-red-600 text-white"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" /> Deleting…
            </span>
          ) : (
            "Delete"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// ─── Sticky Note Card ─────────────────────────────────────────────────────────
const NoteCard = ({
  note,
  favoriteStatus,
  favoriteLoading,
  deleteLoading,
  onFavorite,
  onDelete,
  onEdit,
  onTagClick,
  clickableTags = false,
}: {
  note: Note;
  favoriteStatus: Record<string, boolean>;
  favoriteLoading: Record<string, boolean>;
  deleteLoading: string | null;
  onFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
  onTagClick?: (tag: string) => void;
  clickableTags?: boolean;
}) => {
  const color = getNoteColor(note.id);

  return (
    <div
      className="group relative flex flex-col rounded-none shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
      style={{
        backgroundColor: color.bg,
        borderTop: `4px solid ${color.border}`,
        border: `1px solid ${color.border}`,
        borderTopWidth: "4px",
      }}
    >
      {/* Fold corner decoration */}
      <div
        className="absolute top-0 right-0 w-6 h-6 opacity-30"
        style={{
          background: `linear-gradient(225deg, ${color.border} 50%, transparent 50%)`,
        }}
      />

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Header: title + star */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-base font-semibold leading-snug text-gray-700  line-clamp-2 flex-1"
           
          >
            {note.title}
          </h3>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="shrink-0 mt-0.5 transition-transform hover:scale-110 focus:outline-none"
                disabled={favoriteLoading[note.id]}
                onClick={() => onFavorite(note.id)}
                aria-label={
                  favoriteStatus[note.id]
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                {favoriteLoading[note.id] ? (
                  <Loader2 className="animate-spin size-4 text-gray-400" />
                ) : (
                  <Star
                    className="size-4 transition-colors"
                    fill={favoriteStatus[note.id] ? "#FBBF24" : "none"}
                    color={favoriteStatus[note.id] ? "#F59E0B" : "#9CA3AF"}
                  />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {favoriteStatus[note.id] ? "Remove from favorites" : "Add to favorites"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
          {note.description}
        </p>

        {/* Tags */}
        {note.category.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {note.category.map((tag, index) => (
              <span
                key={`${note.id}-${index}`}
                onClick={() => clickableTags && onTagClick?.(tag)}
                className={`text-xs px-2 py-0.5  border font-medium transition-colors ${getTagColor(
                  tag
                )} ${clickableTags ? "cursor-pointer" : ""}`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: date + actions */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-t"
        style={{ borderColor: color.border, backgroundColor: `${color.border}33` }}
      >
        <span className="text-xs text-gray-500">
          {new Date(note.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>

        <div className="flex items-center gap-1">
          <Link
            href={`notes/${note.id}`}
            className="text-xs font-medium px-2.5 py-1  transition-colors hover:bg-white/70"
            style={{ color: color.accent }}
          >
            Open
          </Link>

          <button
            onClick={() => onEdit(note)}
            className="text-xs font-medium px-2.5 py-1  transition-colors hover:bg-white/70 text-gray-500 hover:"
          >
            Edit
          </button>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onDelete(note.id)}
                disabled={deleteLoading === note.id}
                className="p-1.5  transition-colors hover:bg-red-50 text-gray-400 hover:text-red-500"
                aria-label="Delete note"
              >
                {deleteLoading === note.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>Delete note</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

// ─── Tag Input shared component ───────────────────────────────────────────────
const TagInput = ({
  tags,
  inputValue,
  maxTags,
  onInputChange,
  onKeyDown,
  onRemove,
}: {
  tags: string[];
  inputValue: string;
  maxTags: number;
  onInputChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemove: (tag: string) => void;
}) => (
  <div className="space-y-2">
    <Input
      placeholder={
        tags.length >= maxTags ? "Max tags reached" : "Type a tag, press Enter"
      }
      type="text"
      value={inputValue}
      onChange={(e) => onInputChange(e.target.value)}
      onKeyDown={onKeyDown}
      disabled={tags.length >= maxTags}
      className=" text-sm"
    />
    {tags.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className={`flex items-center gap-1 text-xs px-2.5 py-0.5  border font-medium ${getTagColor(
              tag
            )}`}
          >
            #{tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="hover:opacity-70 transition-opacity ml-0.5"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
    )}
    <p className="text-xs text-gray-400">
      {tags.length}/{maxTags} tags used
    </p>
  </div>
);

// ─── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ onOpen }: { onOpen: () => void }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
    <div className="relative">
      <div className="w-20 h-20  bg-yellow-100 border-2 border-yellow-200 flex items-center justify-center rotate-3 absolute -top-1 -left-1" />
      <div className="w-20 h-20  bg-amber-50 border-2 border-amber-200 flex items-center justify-center relative z-10">
        <BookOpen className="size-9 text-amber-400" />
      </div>
    </div>
    <div className="text-center mt-2">
      <p className="text-lg font-semibold ">No notes yet</p>
      <p className="text-sm text-gray-400 mt-1">
        Create your first note to get started
      </p>
    </div>
    <Button
      onClick={onOpen}
      className=" bg-amber-400 hover:bg-amber-500 text-amber-900 font-medium shadow-sm"
    >
      <FilePlus2 className="size-4 mr-1.5" /> Create your first note
    </Button>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
const CreateNotesPage = ({ notes }: CreateNotesProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [searchValue, setSearch] = useState("");
  const [favoriteStatus, setFavoriteStatus] = useState<Record<string, boolean>>({});
  const [favoriteLoading, setFavoriteLoading] = useState<Record<string, boolean>>({});
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [categorysearchResults, setcategorySearchResults] = useState<Note[]>([]);
  const [hasCategorySearched, setHasCategorySearched] = useState(false);

  const { isDialogOpen, openDialog, closeDialog } = useDialog();
  const maxTags = 3;
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;

  const triggerRefresh = useNoteNotificationStore((s) => s.triggerRefresh);
  const triggerFavRefresh = useFavNotificationStore((s) => s.triggerFavRefresh);

  // ── Forms ──────────────────────────────────────────────────────────────────

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", category: [] },
  });

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", category: [] },
  });

  // ── Tag helpers ────────────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && tags.length < maxTags && !tags.includes(newTag)) {
        const updated = [...tags, newTag];
        setTags(updated);
        form.setValue("category", updated);
        editForm.setValue("category", updated);
        setInputValue("");
      }
    }
  };

  const removeTag = (tag: string) => {
    const updated = tags.filter((t) => t !== tag);
    setTags(updated);
    form.setValue("category", updated);
    editForm.setValue("category", updated);
  };

  // ── Create ─────────────────────────────────────────────────────────────────

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const newTag = inputValue.trim();
    if (newTag && tags.length < maxTags && !tags.includes(newTag)) {
      const updated = [...tags, newTag];
      setTags(updated);
      values.category = updated;
      setInputValue("");
    }
    const result = await CreateNote({ ...values, userId });
    if (result.success) {
      toast.success("Note created");
      form.reset();
      setTags([]);
      closeDialog();
      triggerRefresh();
    } else {
      toast.error("Failed to create note");
    }
    setLoading(false);
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDeleteClick = (noteId: string) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    setDeleteLoading(noteToDelete);
    try {
      const res = await fetch(`/api/create/${noteToDelete}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
      toast.success("Note deleted");
      triggerRefresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDeleteLoading(null);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  // ── Favorites ──────────────────────────────────────────────────────────────

  const handleFavoriteToggle = async (noteId: string) => {
    if (!userId) return;
    setFavoriteLoading((p) => ({ ...p, [noteId]: true }));
    try {
      const isFav = favoriteStatus[noteId] ?? false;
      const res = await fetch("/api/favorite", {
        method: isFav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, noteId }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setFavoriteStatus((p) => ({ ...p, [noteId]: !isFav }));
      toast.success(isFav ? "Removed from favorites" : "Added to favorites");
      triggerFavRefresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setFavoriteLoading((p) => ({ ...p, [noteId]: false }));
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/favorite?userId=${userId}`)
      .then((r) => r.json())
      .then((favs: any[]) => {
        const map: Record<string, boolean> = {};
        favs.forEach((f) => (map[f.noteId] = true));
        setFavoriteStatus(map);
      })
      .catch(console.error);
  }, [userId]);

  // ── Edit ───────────────────────────────────────────────────────────────────

  const handleEditClick = (note: Note) => {
    setNoteToEdit(note);
    editForm.reset({ title: note.title, description: note.description, category: note.category });
    setTags(note.category);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (values: z.infer<typeof formSchema>) => {
    const newTag = inputValue.trim();
    if (newTag && tags.length < maxTags && !tags.includes(newTag)) {
      const updated = [...tags, newTag];
      setTags(updated);
      values.category = updated;
      setInputValue("");
    }
    if (!noteToEdit) return;
    setLoading(true);
    try {
      const res = await fetch("/api/create/editNote", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, id: noteToEdit.id, userId }),
      });
      if (!res.ok) throw new Error("Failed to update note");
      toast.success("Note updated");
      setEditDialogOpen(false);
      triggerRefresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ── Search ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) {
      setHasSearched(false);
      setHasCategorySearched(false);
      setSearchResults([]);
      return;
    }
    setHasSearched(true);
    setHasCategorySearched(false);
    setSearchResults(
      notes.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.description?.toLowerCase().includes(q) ||
          (n.category || []).some((t) => t.toLowerCase().includes(q))
      )
    );
  }, [searchValue, notes]);

  const handleCategorySearch = (category: string) => {
    if (!userId) return;
    setHasCategorySearched(true);
    setHasSearched(false);
    setSearch("");
    setcategorySearchResults(
      notes.filter((n) =>
        (n.category || []).some((t) => t.toLowerCase() === category.toLowerCase())
      )
    );
  };

  const handleBackToNotes = () => {
    setHasSearched(false);
    setHasCategorySearched(false);
    setSearchResults([]);
    setcategorySearchResults([]);
    setSearch("");
  };

  // ── Decide which notes to render ───────────────────────────────────────────
  const displayedNotes = hasSearched
    ? searchResults
    : hasCategorySearched
    ? categorysearchResults
    : notes;

  const isFiltered = hasSearched || hasCategorySearched;

  // ── Shared dialog form fields ──────────────────────────────────────────────
  const NoteFormFields = ({
    currentForm,
    submitLabel,
  }: {
    currentForm: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
    submitLabel: string;
  }) => (
    <div className="space-y-4">
      <FormField
        control={currentForm.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium ">Title</FormLabel>
            <FormControl>
              <Input
                placeholder="What's this note about?"
                {...field}
                className=""
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={currentForm.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium ">Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Jot down your thoughts…"
                {...field}
                rows={4}
                className=" resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={currentForm.control}
        name="category"
        render={() => (
          <FormItem>
            <FormLabel className="text-sm font-medium ">Tags</FormLabel>
            <FormControl>
              <TagInput
                tags={tags}
                inputValue={inputValue}
                maxTags={maxTags}
                onInputChange={setInputValue}
                onKeyDown={handleKeyDown}
                onRemove={removeTag}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="submit"
        disabled={loading}
        className="w-full  bg-primary cursor-pointer font-semibold"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" /> Saving…
          </span>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col gap-6 mt-4">

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold " >
            My Notebooks
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes…"
            value={searchValue}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border focus:ring-0 focus:outline-0"
          />
          {searchValue && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <Button
          onClick={openDialog}
          className=" bg-primary font-semibold shrink-0 shadow-sm"
        >
          <FilePlus2 className="size-4 mr-1.5" /> New Note
        </Button>
      </div>

      {/* ── Filter banner ────────────────────────────────────────────────── */}
      {isFiltered && (
        <div className="flex items-center justify-between bg-orange-500/10 border border-primary  px-4 py-2.5">
          <p className="text-sm t">
            {hasSearched ? (
              <>
                <span className="font-semibold">{searchResults.length}</span> result
                {searchResults.length !== 1 ? "s" : ""} for{" "}
                <span className="font-semibold">&ldquo;{searchValue}&rdquo;</span>
              </>
            ) : (
              <>
                <span className="font-semibold">{categorysearchResults.length}</span> note
                {categorysearchResults.length !== 1 ? "s" : ""} in this category
              </>
            )}
          </p>
          <button
            onClick={handleBackToNotes}
            className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900 font-medium transition-colors"
          >
            <ArrowLeft className="size-3.5" /> All notes
          </button>
        </div>
      )}

      {/* ── Notes grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedNotes.length === 0 && !isFiltered ? (
          <EmptyState onOpen={openDialog} />
        ) : displayedNotes.length === 0 && isFiltered ? (
          <div className="col-span-full text-center py-16 text-gray-400 text-sm">
            No notes match your search.
          </div>
        ) : (
          displayedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              favoriteStatus={favoriteStatus}
              favoriteLoading={favoriteLoading}
              deleteLoading={deleteLoading}
              onFavorite={handleFavoriteToggle}
              onDelete={handleDeleteClick}
              onEdit={handleEditClick}
              onTagClick={handleCategorySearch}
              clickableTags={!isFiltered}
            />
          ))
        )}
      </div>

      {/* ── Create Note Dialog ────────────────────────────────────────────── */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
            form.reset();
            setTags([]);
            setInputValue("");
          }
        }}
      >
        <DialogContent className="max-w-md ">
          <DialogHeader>
            <DialogTitle
              className="text-xl font-bold"
             
            >
              New Note
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              Capture your thoughts, ideas, or reminders.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2">
              <NoteFormFields currentForm={form} submitLabel="Create Note" />
            </form>
          </Form>

          <button
            onClick={() => {
              closeDialog();
              form.reset();
              setTags([]);
            }}
            className="w-full text-sm text-gray-400 hover:text-gray-600 mt-1 transition-colors"
          >
            Cancel
          </button>
        </DialogContent>
      </Dialog>

      {/* ── Edit Note Dialog ──────────────────────────────────────────────── */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditDialogOpen(false);
            setTags([]);
            setInputValue("");
          }
        }}
      >
        <DialogContent className="max-w-md ">
          <DialogHeader>
            <DialogTitle
              className="text-xl font-bold "
             
            >
              Edit Note
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              Update your note details.
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="mt-2">
              <NoteFormFields currentForm={editForm} submitLabel="Save Changes" />
            </form>
          </Form>

          <button
            onClick={() => setEditDialogOpen(false)}
            className="w-full text-sm text-gray-400 hover:text-gray-600 mt-1 transition-colors"
          >
            Cancel
          </button>
        </DialogContent>
      </Dialog>

      {/* ── Confirm Delete Dialog ─────────────────────────────────────────── */}
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading !== null}
      />
    </div>
  );
};

export default CreateNotesPage;