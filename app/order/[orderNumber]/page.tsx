import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toPlainNumber } from "@/lib/serialize";

type OrderPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const { orderNumber } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: { include: { product: true, variant: true } }, address: true },
  });

  if (!order) {
    notFound();
  }

  if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/account");
  }

  return (
    <main className="px-6 py-16 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-medium mb-2">Thank you</h1>
      <p className="text-neutral-600 mb-8">
        Order <span className="font-medium">{order.orderNumber}</span> —{" "}
        <span className={order.status === "PAID" ? "text-green-700" : "text-amber-600"}>
          {order.status}
        </span>
      </p>

      {order.status === "PENDING" && (
        <p className="text-sm text-neutral-500 mb-8">
          Payment is still confirming — refresh this page in a few seconds if the status doesn&apos;t update.
        </p>
      )}

      <div className="space-y-4">
        {order.items.map((item: (typeof order.items)[number]) => (
          <div key={item.id} className="flex justify-between text-sm border-b border-neutral-200 pb-3">
            <span>
              {item.product.name}
              {item.variant && ` (${item.variant.color ?? item.variant.size})`} × {item.quantity}
            </span>
            <span>${(toPlainNumber(item.unitPrice) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <p className="text-right font-medium mt-6">Total: ${toPlainNumber(order.total).toFixed(2)}</p>

      {order.address && (
        <div className="mt-8 text-sm text-neutral-500">
          <p className="font-medium text-neutral-700 mb-1">Shipping to</p>
          <p>{order.address.fullName}</p>
          <p>{order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}</p>
          <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
          <p>{order.address.country}</p>
        </div>
      )}
    </main>
  );
}
