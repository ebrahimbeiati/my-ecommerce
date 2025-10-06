"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getCurrentUser, signOut } from "@/lib/auth/actions";

const NAV_LINKS = [
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "Kids", href: "/products?gender=unisex" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
] as const;

interface User {
  name?: string;
  email?: string;
  id: string;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        setUser(null);
        window.location.href = '/';
      } else {
        console.error('Sign out failed:', result.error);
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-light-100/70 backdrop-blur-md border-b border-light-300/50 shadow-sm">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Logo */}
        <Link href="/" aria-label="Home" className="flex items-center">
          <div className="w-8 h-8 bg-dark-900 rounded-full flex items-center justify-center">
            <span className="text-light-100 font-bold text-lg">N</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-body text-dark-900 transition-colors hover:text-dark-700 font-medium"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side - Search, Account, and Cart */}
        <div className="hidden items-center gap-6 md:flex">
          {/* Search */}
          <button className="text-body text-dark-900 transition-colors hover:text-dark-700">
            <span className="sr-only">Search</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Account - Sign In/User */}
          {isLoading ? (
            <div className="flex items-center space-x-2 text-dark-500">
              <div className="w-5 h-5 border-2 border-dark-300 border-t-dark-900 rounded-full animate-spin" />
            </div>
          ) : user ? (
            <div className="flex items-center space-x-3">
              <Link
                href="/account"
                className="flex items-center space-x-2 text-dark-900 hover:text-dark-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <span className="text-sm font-medium">{user.name || user.email}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="text-xs text-dark-700 hover:text-dark-900 underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="flex items-center space-x-2 text-dark-900 hover:text-dark-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <span className="text-sm font-medium">Sign In</span>
            </Link>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="text-dark-900 hover:text-dark-700 transition-colors flex items-center space-x-2 relative"
          >
            <span className="sr-only">Shopping cart</span>
            <div className="relative">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              {/* Cart count badge - you can make this dynamic later */}
              <span className="absolute -top-2 -right-2 bg-red text-light-100 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              My Cart
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-dark-900 hover:text-dark-700 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {open && (
        <div className="md:hidden border-t border-light-300">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-dark-900 hover:text-dark-700 hover:bg-light-200 rounded-md transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="border-t border-light-300 mt-2 pt-3 space-y-1">
              {user ? (
                <>
                  <Link
                    href="/account"
                    className="block px-3 py-2 text-dark-900 hover:text-dark-700 hover:bg-light-200 rounded-md transition-colors font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {user.name || user.email}
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-dark-700 hover:text-dark-900 hover:bg-light-200 rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/sign-in"
                  className="block px-3 py-2 text-dark-900 hover:text-dark-700 hover:bg-light-200 rounded-md transition-colors font-medium"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}