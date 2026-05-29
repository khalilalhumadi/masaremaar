import type { ReactNode } from "react";

// Root pass-through layout. The <html>/<body> tags (with locale-aware
// lang/dir) live in app/[locale]/layout.tsx.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
