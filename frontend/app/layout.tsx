import type { Metadata } from "next";
import { Geist, Geist_Mono, Pixelify_Sans, Jersey_15 } from "next/font/google";
import './globals.css';
import { ThemeProvider } from "../components/ThemeProvider";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import RandomFavicon from "@/components/RandomFavicon";
import TeamSidebar from '../components/TeamSidebar';
import Navigation from "../components/Navigation"
import Footer from '../components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify",
});

const jersey = Jersey_15({
  weight: "400",
  variable: "--font-jersey",
});

export const metadata: Metadata = {
  title: "PokePick",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${pixelify.variable} ${jersey.variable}`}
      >
      <body className="bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <BackgroundWrapper>
        <RandomFavicon />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey={undefined}
          >
            <div className="flex flex-col min-h-screen overflow-x-hidden">
              <Navigation />
              <div className="flex flex-1 overflow-x-hidden">
                <main className="flex-1 overflow-x-hidden">{children}</main>
                <TeamSidebar />
              </div>
            </div>
            <Footer />
          </ThemeProvider>
        </BackgroundWrapper>
      </body>
    </html>
  );
}
