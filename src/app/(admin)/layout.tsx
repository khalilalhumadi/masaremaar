import "../globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "CMS Admin — Masar Emaar",
  robots: "noindex, nofollow",
};

// Admin routes use their own minimal layout — no public site Header/Footer.
// lang is always "en"; the admin UI is English-only.
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
