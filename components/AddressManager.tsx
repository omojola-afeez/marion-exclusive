"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AddressType = {
  id: string;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export default function AddressManager({ addresses }: { addresses: AddressType[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    isDefault: addresses.length === 0,
  });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Couldn't save that address.");
      return;
    }

    setShowForm(false);
    router.refresh();
  }

  async function setDefault(id: string) {
    await fetch(`/api/account/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      {addresses.length === 0 && !showForm && (
        <p className="text-neutral-500 text-sm mb-4">No saved addresses yet.</p>
      )}

      <div className="space-y-3 mb-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="border border-neutral-200 rounded-md p-3 text-sm flex justify-between items-start"
          >
            <div>
              <p className="font-medium">
                {address.fullName} {address.isDefault && <span className="text-xs text-neutral-400">(default)</span>}
              </p>
              <p className="text-neutral-500">
                {address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state}{" "}
                {address.postalCode}, {address.country}
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              {!address.isDefault && (
                <button onClick={() => setDefault(address.id)} className="underline text-neutral-500">
                  Set default
                </button>
              )}
              <button onClick={() => remove(address.id)} className="underline text-neutral-400">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm ? (
        <form onSubmit={handleAdd} className="space-y-3 border border-neutral-200 rounded-md p-4">
          <input
            required
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Address line 1"
            value={form.line1}
            onChange={(e) => setForm({ ...form, line1: e.target.value })}
            className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            placeholder="Address line 2 (optional)"
            value={form.line2}
            onChange={(e) => setForm({ ...form, line2: e.target.value })}
            className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
          />
          <div className="flex gap-3">
            <input
              required
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="flex-1 border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="w-24 border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-3">
            <input
              required
              placeholder="Postal code"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              className="flex-1 border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-24 border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            />
            Make this my default address
          </label>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-neutral-900 text-white rounded-md text-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save address"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-neutral-300 rounded-md text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="text-sm underline text-neutral-600"
        >
          + Add a new address
        </button>
      )}
    </div>
  );
}
