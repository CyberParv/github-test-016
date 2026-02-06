"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/cart", label: "Cart" },
  { href: "/reservations", label: "Reservations" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" }
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-background">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold" aria-label="Go to homepage">
          Coffee Cloud
        </Link>
        <button
          className="rounded-md border border-border p-2 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="block h-0.5 w-5 bg-foreground" />
          <span className="mt-1 block h-0.5 w-5 bg-foreground" />
          <span className="mt-1 block h-0.5 w-5 bg-foreground" />
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground hover:text-primary">
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/account" className="text-sm font-medium text-foreground hover:text-primary">
                Account
              </Link>
              <Button variant="outline" onClick={logout} aria-label="Log out">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-sm font-medium text-foreground hover:text-primary">
                Login
              </Link>
              <Link href="/auth/signup" aria-label="Sign up">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
      <div className={cn("md:hidden", open ? "block" : "hidden")}>
        <div className="flex flex-col gap-2 border-t border-border px-4 py-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground hover:text-primary" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-2 pt-2">
              <Link href="/account" className="text-sm font-medium text-foreground hover:text-primary" onClick={() => setOpen(false)}>
                Account
              </Link>
              <Button variant="outline" onClick={logout} aria-label="Log out">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-2">
              <Link href="/auth/login" className="text-sm font-medium text-foreground hover:text-primary" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link href="/auth/signup" aria-label="Sign up" onClick={() => setOpen(false)}>
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
