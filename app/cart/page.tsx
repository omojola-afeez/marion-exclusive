import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toPlainNumber } from "@/lib/serialize";
import CartItemControls from "@/components/CartItemControls";

export default async function CartPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: { include: { images: { orderBy: { position: "asc" }, take: 1 } } },
          variant: true,
        },
      },
    },
  });

  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (sum: number, item: (typeof items)[number]) =>
      sum + toPlainNumber(item.product.price) * item.quantity,
    0
  );

  return (
    <main className="px-6 py-16 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-medium mb-8">Your cart</h1>

      {items.length === 0 ? (
        <p className="text-neutral-500">
          Your cart is empty. <Link href="/shop" className="underline">Go shopping</Link>.
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {items.map((item: (typeof items)[number]) => (
              <div key={item.id} className="flex items-center gap-4 border-b border-neutral-200 pb-6">
                <div className="w-20 h-20 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                  {item.product.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  {item.variant && (
                    <p className="text-sm text-neutral-500">
                      {item.variant.color ?? item.variant.size ?? item.variant.sku}
                    </p>
                  )}
                  <p className="text-sm text-neutral-500">
                    ${toPlainNumber(item.product.price).toFixed(2)}
                  </p>
                </div>
                <CartItemControls itemId={item.id} quantity={item.quantity} />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200">
            <p className="text-lg font-medium">Subtotal: ${subtotal.toFixed(2)}</p>
            <Link
              href="/checkout"
              className="px-6 py-2 bg-neutral-900 text-white rounded-md text-sm"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
