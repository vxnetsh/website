import type { Metadata } from "next";
import { Kode_Mono } from "next/font/google";
import "./globals.css";

const kodeMono = Kode_Mono({
  variable: "--font-kode-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "vxnet",
  description: "vxnet official homepage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <meta name="darkreader-lock" />
      <body
        className={`${kodeMono.variable} antialiased w-screen h-screen bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
