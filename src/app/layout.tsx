import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AIChat from "@/components/AIChat";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HuntHive — Find Your Perfect Hunting Adventure",
  description:
    "Connect with elite hunting outfitters across North America. AI-powered recommendations, interactive maps, verified guides, and everything you need for the hunt of a lifetime.",
  keywords: ["hunting", "outfitters", "elk hunting", "deer hunting", "guided hunts", "hunting guides"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>
        <Navbar />
        {children}
        <AIChat />
      </body>
    </html>
  );
}
