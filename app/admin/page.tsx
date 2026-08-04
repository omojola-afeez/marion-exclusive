import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <main className="px-6 py-16 max-w-xl mx-auto w-full">
      <h1 className="text-2xl font-medium mb-2">Admin dashboard</h1>
      <p className="text-neutral-600">Signed in as {session.user.email} (ADMIN)</p>
      <p className="text-xs text-neutral-400 mt-8">
        Real product/order/customer management arrives in Milestone 7.
      </p>
    </main>
  );
}
