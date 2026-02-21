import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { MusicProvider } from "./contexts/music-context"
import { BackgroundProvider } from "./contexts/background-context"
import Footer from "./components/footer"
import NavBar from "./components/navbar"
import ParticleBackground from "./components/particle-background"
import DynamicBackground from "./components/dynamic-background"

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

            {/* Fixed Navigation - Always at top */}
            <NavBar />

            {/* Scrollable Page Content with padding for fixed navbar and footer */}
            <main className="relative z-10 pt-20 pb-8 min-h-screen flex justify-center overflow-y-auto">
              <div className="w-full max-w-7xl px-4">
                {children}
              </div>
            </main>

            {/* Fixed Music Player Footer - Always at bottom */}
            <Footer />

            <Analytics />
          </MusicProvider>
        </BackgroundProvider>
      </body>
    </html>
  );
}
