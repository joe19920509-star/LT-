"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { activateSubscriptionAction } from "@/app/actions/subscribe";

export function SubscribeButton() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setErr(null);
    setLoading(true);
    const res = await activateSubscriptionAction();
    setLoading(false);
    if (res.error) setErr(res.error);
    else router.push("/account");
  }

  return (
    <div>
      {err && <p className="mb-2 text-sm text-red-700">{err}</p>}
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="rounded bg-accent px-6 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
      >
        {loading ? "处理中…" : "模拟支付并开通订阅（演示）"}
      </button>
    </div>
  );
}
