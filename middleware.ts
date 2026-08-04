import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// This actually enforces access control on protected route groups.
// Access control implemented only inside page components is not enough —
// middleware is the first line of defense.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*", "/cart/:path*", "/wishlist/:path*"],
};
