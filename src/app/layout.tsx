import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next 13 - Provenance (2.1.8)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
