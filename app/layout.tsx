import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "3D Slicer - AI-Powered 3D Model Creator",
  description: "Create, refine, and slice 3D models with AI assistance. Voice and chat interface for intuitive 3D modeling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
