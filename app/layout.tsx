import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Seb — Portfolio Fotográfico",
  description: "Portfolio personal de fotografía de Seb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-film-cream">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
