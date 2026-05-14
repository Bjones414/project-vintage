import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AlphaBanner } from "@/components/chrome/AlphaBanner";
import { MobileGate } from "@/components/chrome/MobileGate";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Project Vintage — Collector Car Intelligence",
  description:
    "Auction analytics and originality verification for serious Porsche collectors.",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: Add Sentry and PostHog providers here once configured
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AlphaBanner />
        <MobileGate />
        {children}
      </body>
    </html>
  );
}
