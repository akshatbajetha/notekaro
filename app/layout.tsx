import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TopNavbar } from "@/components/TopNavbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import AuthComponent from "@/components/AuthComponent";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NoteKaro - Notes, Sketches & Tasks in One Place",
  description:
    "NoteKaro: Your all-in-one workspace for notes, sketches, and todos with reminders. Start creating instantly!",
  metadataBase: new URL("https://notekaro.com"),
  openGraph: {
    title: "NoteKaro - Notes, Sketches & Tasks in One Place",
    description:
      "NoteKaro: Your all-in-one workspace for notes, sketches, and todos with reminders. Start creating instantly!",
    url: "https://notekaro.com",
    siteName: "NoteKaro",
    images: [
      {
        url: "/og-image.png", // optional, but recommended
        width: 1200,
        height: 630,
        alt: "NoteKaro",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoteKaro - Notes, Sketches & Tasks in One Place",
    description:
      "NoteKaro: Your all-in-one workspace for notes, sketches, and todos with reminders. Start creating instantly!",
    images: ["/og-image.png"],
    creator: "@akshatbajetha", // optional
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-E6Q5M4X2VH"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-E6Q5M4X2VH');
            `}
          </Script>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-[#1E1E1E] bg-[#F5F5F5]`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <TopNavbar />
            <AuthComponent />
            {children}
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
