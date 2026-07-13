import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Iwacu Movies - Rwandan Stories, Streamed Everywhere",
  description:
    "Watch Rwandan and African films and series in Kinyarwanda, English, and French. Free and VIP content, Mobile Money payments.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://iwacumovies.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="rw">
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body bg-bg text-cream`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
