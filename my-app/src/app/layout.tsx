import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { MusicProvider } from "./contexts/music-context"
import MusicPlayerFooter from "./components/music-player-footer"
import NavBar from "./components/navbar"
import ParticleBackground from "./components/particle-background"
import PageLoader from "./components/page-loader"

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
        <PageLoader>
          <MusicProvider>
            {/* Shared background across all pages */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-20" />
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
            <MusicPlayerFooter />

            <Analytics />
          </MusicProvider>
        </PageLoader>
      </body>
    </html>
  );
}
