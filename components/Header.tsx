"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-neutral-200 sticky top-0 bg-white/95 backdrop-blur z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-lg font-semibold text-neutral-900 hover:text-neutral-700 transition-colors">
            Marion Exclusive
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Side - Account, Cart */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/cart"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10-9l2 9m-6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden sm:inline">Cart</span>
            </Link>

            {session ? (
              <div className="flex items-center gap-4">
                <Link href="/account" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                  Account
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-4">
                <Link href="/login" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4 space-y-4">
            <Link href="/shop" className="block text-sm text-neutral-600 hover:text-neutral-900">
              Shop
            </Link>
            <Link href="/about" className="block text-sm text-neutral-600 hover:text-neutral-900">
              About
            </Link>
            <Link href="/contact" className="block text-sm text-neutral-600 hover:text-neutral-900">
              Contact
            </Link>
            {!session && (
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="flex-1 text-center text-sm text-neutral-600 hover:text-neutral-900 py-2 border border-neutral-200 rounded-md">
                  Log in
                </Link>
                <Link href="/signup" className="flex-1 text-center text-sm bg-neutral-900 text-white rounded-md py-2 hover:bg-neutral-800">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
