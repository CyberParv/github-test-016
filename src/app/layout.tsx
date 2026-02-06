import "./globals.css";
import type { Metadata } from "next";
import Navigation from "@/components/layout/Navigation";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import Toaster from "@/components/ui/Toaster";

export const metadata: Metadata = {
  title: "Coffee Cloud | Fresh Brews & Bites",
  description: "A scalable, eye-catching coffee shop website with a responsive storefront, reservations, and admin management."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <Navigation />
            <main className="min-h-screen">{children}</main>
            <Toaster />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
