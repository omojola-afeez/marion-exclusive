import type { NextAuthConfig } from "next-auth";

// Edge-safe config only. NO Prisma adapter, NO bcrypt, NO other Node-only
// APIs here — middleware.ts imports this file and runs on the Edge runtime,
// which will silently break in production if this transitively imports
// something Node-only.
//
// jwt/session callbacks live here (not just in auth.ts) because middleware
// uses ONLY this config to decode the session — if role-attaching logic
// only existed in auth.ts, middleware would never see the user's role and
// every admin check would silently fail.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [], // real providers are added in auth.ts, not here
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const path = request.nextUrl.pathname;

      const isAdminRoute = path.startsWith("/admin");
      const isAccountRoute = path.startsWith("/account");
      const isCheckoutRoute = path.startsWith("/checkout");
      const isCartRoute = path.startsWith("/cart");
      const isWishlistRoute = path.startsWith("/wishlist");

      if (isAdminRoute) {
        return isLoggedIn && auth?.user?.role === "ADMIN";
      }
      if (isAccountRoute || isCheckoutRoute || isCartRoute || isWishlistRoute) {
        return isLoggedIn;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
