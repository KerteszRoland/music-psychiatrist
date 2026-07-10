import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Music Psychiatrist",
  description:
    "Analyze song lyrics for schema therapy patterns, modes, and psychological signals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans`}>
        <Providers>
          <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
