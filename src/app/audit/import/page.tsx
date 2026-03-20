"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Waiting for data from extension...");

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        event.data &&
        event.data.type === "A11Y_ACCESS4U_IMPORT" &&
        event.data.violations
      ) {
        // Store in sessionStorage for the audit page to pick up
        sessionStorage.setItem(
          "a11y-import",
          JSON.stringify({
            violations: event.data.violations,
            passes: event.data.passes || 0,
            html: event.data.html || "",
            scannedUrl: event.data.scannedUrl || "",
          })
        );
        setStatus("Data received! Redirecting...");
        router.push("/audit");
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-dim">
      <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
        <div className="mb-4 text-4xl">🔄</div>
        <h1 className="text-lg font-semibold text-slate-800">
          Importing Audit Data
        </h1>
        <p className="mt-2 text-sm text-slate-500">{status}</p>
      </div>
    </div>
  );
}
