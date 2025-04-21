import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TopNavbar } from "@/components/TopNavbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import AuthComponent from "@/components/AuthComponent";

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
  title: "NoteKaro - All-in-One Productivity App",
  description:
    "NoteKaro is an open-source all-in-one productivity app with note-taking, sketching, and task management.",
  metadataBase: new URL("https://notekaro.com"),
  openGraph: {
    title: "NoteKaro - All-in-One Productivity App",
    description:
      "Take notes, sketch ideas, and manage your tasks in one beautiful, open-source app.",
    url: "https://notekaro.com",
    siteName: "NoteKaro",
    images: [
      {
        url: "/og-image.png", // optional, but recommended
        width: 1200,
        height: 630,
        alt: "NoteKaro - Productivity App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoteKaro - All-in-One Productivity App",
    description:
      "Take notes, sketch ideas, and manage your tasks in one beautiful, open-source app.",
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
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
