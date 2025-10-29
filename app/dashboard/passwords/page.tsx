/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import PassComponent from "./_components/PassComponent";
import { authClient } from "@/lib/auth-client";

const Page = () => {
  const [pass, setPass] = useState<any[]>([]);
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return; // لو مفيش user بعد ما يدخل

    const fetchNotes = async () => {
      try {
        const res = await fetch(`/api/passManGet`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId // or any variable that holds the user's ID
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch notes");

        const data = await res.json();
        setPass(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotes();
  }, [userId]);

  return (
    <div className="w-full min-h-screen mt-4 ">
      
      <PassComponent pass={pass} />
    </div>
  );
};

export default Page;
