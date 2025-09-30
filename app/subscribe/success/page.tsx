"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // استرجاع sessionId مرة واحدة فقط
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      alert("No session ID provided");
      router.push("/");
      return;
    }

    const saveSubscription = async () => {
      try {
        const res = await fetch("/api/subscribe/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (data.success) {
          alert("Subscription successful!");
          router.push("/dashboard");
        } else {
          alert(data.message || "Failed to save subscription");
          router.push("/");
        }
      } catch (err) {
        console.error("Subscription error:", err);
        alert("Network error, please try again.");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    saveSubscription();
    // نزيل searchParams من الـ dependency array لتجنب إعادة التشغيل غير الضرورية
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      {loading ? "Processing your subscription..." : "Done!"}
    </div>
  );
}
