import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { MusicProvider } from "./contexts/music-context"
import { BackgroundProvider } from "./contexts/background-context"
import NavBar from "./components/navbar"
import ParticleBackground from "./components/particle-background"
import DynamicBackground from "./components/dynamic-background"
import Timeline from "./components/timeline"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BackgroundProvider>
          <MusicProvider>
            {/* Shared background across all pages */}
            <DynamicBackground />
            <ParticleBackground />

            {/* Vertical decorative patterns */}
            <div className="decorative-pattern-left" aria-hidden="true" />
            <div className="decorative-pattern-right" aria-hidden="true" />

            {/* Fixed Navigation - Always at top */}
            <NavBar />

            {/* Scrollable Page Content with padding for fixed navbar */}
            <main className="relative z-10 pt-20 min-h-screen flex justify-center overflow-y-auto">
              <div className="w-full px-4 pb-32 md:max-w-[90vw] lg:max-w-[75vw]">
                {children}
              </div>
            </main>

            {/* Fixed Timeline */}
            <Timeline />

            <Analytics />
          </MusicProvider>
        </BackgroundProvider>
      </body>
    </html>
  );
}
