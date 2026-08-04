"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Couldn't save that.");
      return;
    }

    setMessage("Saved.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div>
        <label className="block text-sm text-neutral-600 mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-neutral-300 rounded-md px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-neutral-900 text-white rounded-md text-sm disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
      {message && <span className="text-sm text-neutral-500">{message}</span>}
    </form>
  );
}
