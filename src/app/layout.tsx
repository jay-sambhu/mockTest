

import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnalyticsProvider from "@/components/AnalyticsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quiz-master.local"),
  title: {
    default: "Quiz Master",
    template: "%s | Quiz Master",
  },
  description:
    "Create, share, and take interactive quizzes with instant scoring and clean reporting.",
  keywords: [
    "quiz app",
    "online quiz builder",
    "interactive quiz platform",
    "Prisma Next.js quiz",
  ],
  openGraph: {
    title: "Quiz Master",
    description:
      "Create, share, and take interactive quizzes with instant scoring.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz Master",
    description:
      "Create, share, and take interactive quizzes with instant scoring.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="app-shell gradient-bg">
        <a href="#main" className="skip-link">Skip to content</a>
        <AnalyticsProvider>
          <main id="main">{children}</main>
        </AnalyticsProvider>
        <Analytics />
      </body>
    </html>
  );
}
