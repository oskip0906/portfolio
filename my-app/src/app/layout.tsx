import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Oscar's Website",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <link rel="preload" as="image" href="https://unpkg.com/three-globe@2.29.0/example/img/earth-blue-marble.jpg" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="https://unpkg.com/three-globe@2.29.0/example/img/earth-topology.png" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}