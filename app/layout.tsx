import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter, Assistant } from "next/font/google";
import "./globals.css";
import { TopNavbar } from "@/components/TopNavbar";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import AuthComponent from "@/components/AuthComponent";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import TimezoneDetector from "@/components/TimezoneDetector";

const inter = Inter({
  subsets: ["latin"],
});

const assistant = Assistant({
  subsets: ["latin"],
  variable: "--font-assistant",
});

export const metadata: Metadata = {
  title: "NoteKaro - Notes, Sketches & Tasks in One Place",
  description:
    "NoteKaro: Your all-in-one workspace for notes, sketches, and todos with reminders. Start creating instantly!",
  metadataBase: new URL("https://notekaro.com"),
  keywords: [
    "NoteKaro",
    "note-taking app",
    "todo app",
    "productivity tool",
    "sketch app",
    "free productivity tool",
    "Notion alternative",
    "Excalidraw alternative",
    "Task manager",
    "note app with todo list",
    "note app with reminders",
    "all in one productivity app",
  ],
  openGraph: {
    title: "NoteKaro - Notes, Sketches & Tasks in One Place",
    description:
      "NoteKaro: Your all-in-one workspace for notes, sketches, and todos with reminders. Start creating instantly!",
    url: "https://notekaro.com",
    siteName: "NoteKaro",
    images: [
      {
        url: "/link-preview.png",
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
    images: ["/link-preview.png"],
    creator: "@akshatbajetha",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
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
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
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
    <html
      lang="en"
      className={`${inter.className} ${assistant.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />

        <meta name="theme-color" content="#ffffff" />

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
      <body className=" antialiased dark:bg-[#1E1E1E] bg-[#F5F5F5]">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <SessionProvider>
            <TopNavbar />
            <AuthComponent />
            <TimezoneDetector />
            {children}
            <Toaster />
            <Analytics />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
