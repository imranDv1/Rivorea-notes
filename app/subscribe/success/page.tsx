"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      alert("No session ID provided");
      router.push("/");
      return;
    }

    fetch("/api/subscribe/success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Subscription successful!");
          router.push("/dashboard");
        } else {
          alert(data.message || "Failed to save subscription");
          router.push("/");
        }
      })
      .finally(() => setLoading(false));
  }, [searchParams, router]);

  return <div>{loading ? "Processing your subscription..." : "Done!"}</div>;
}

