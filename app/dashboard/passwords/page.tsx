/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import PassComponent from "./_components/PassComponent";
import { authClient } from "@/lib/auth-client";
import { useAddPassNotificationStore } from "@/context/addPass";

const Page = () => {
  const [pass, setPass] = useState<any[]>([]);
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const refreshAddPassSignal = useAddPassNotificationStore(
    (state) => state.refreshAddPassSignal
  );
  useEffect(() => {
    if (!userId) return; // لو مفيش user بعد ما يدخل

    const fetchPasses = async () => {
      try {
        const res = await fetch(`/api/passManGet`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId, // or any variable that holds the user's ID
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch pass");

        const data = await res.json();
        setPass(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPasses();
  }, [userId, refreshAddPassSignal]);

  return (
    <div className="w-full min-h-screen mt-4 ">
      <PassComponent pass={pass} />
    </div>
  );
};

export default Page;
