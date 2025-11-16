import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AstroGems B2B Marketplace",
  description:
    "A secure B2B marketplace for astrologers to browse and purchase crystals, gemstones, and jewelry products, and place orders for themselves or their customers with flexible pricing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-text-main font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
