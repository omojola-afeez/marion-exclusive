import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toPlainNumber } from "@/lib/serialize";
import ProfileForm from "@/components/ProfileForm";
import AddressManager from "@/components/AddressManager";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [user, orders, addresses] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: "desc" },
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="px-6 py-16 max-w-2xl mx-auto w-full space-y-12">
      <div>
        <h1 className="text-2xl font-medium mb-6">Your account</h1>
        <p className="text-neutral-500 text-sm mb-4">{user.email} — {user.role}</p>
        <ProfileForm initialName={user.name ?? ""} />

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          className="mt-4"
        >
          <button type="submit" className="text-sm underline text-neutral-500">
            Log out
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Order history</h2>
        {orders.length === 0 ? (
          <p className="text-neutral-500 text-sm">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order: (typeof orders)[number]) => (
              <Link
                key={order.id}
                href={`/order/${order.orderNumber}`}
                className="flex justify-between items-center border border-neutral-200 rounded-md p-3 text-sm hover:bg-neutral-50"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-neutral-500">
                    {order.items.length} item{order.items.length === 1 ? "" : "s"} ·{" "}
                    {order.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${toPlainNumber(order.total).toFixed(2)}</p>
                  <p
                    className={
                      order.status === "PAID" ? "text-green-700" : "text-amber-600"
                    }
                  >
                    {order.status}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Saved addresses</h2>
        <AddressManager addresses={addresses} />
      </div>
    </main>
  );
}
