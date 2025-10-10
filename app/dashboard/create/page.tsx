"use client";
import React, { useEffect, useState } from "react";
import CreateNotes from "./createNotes";
import { authClient } from "@/lib/auth-client";
import { useNoteNotificationStore } from "@/context/notesUpateStore";
import NotesLoadingSkeleton from "./_components/NotesLoadingSkeleton ";

const Page = () => {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notes, setNotes] = useState<any[]>([]); // حالة لحفظ الملاحظات
  const [loading, setLoading] = useState(true);

 const refreshSignal = useNoteNotificationStore((state) => state.refreshNoteSignal);

  useEffect(() => {
    if (!userId) return; // لو مفيش user بعد ما يدخل

    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }), // <-- صح
        });

        if (!res.ok) throw new Error("Failed to fetch notes");

        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [userId,refreshSignal]);

  if (loading) return <NotesLoadingSkeleton/>

  return <CreateNotes notes={notes} />;
};

export default Page;
