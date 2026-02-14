import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/src/components/LayoutWrapper";
import StoreProvider from "../ReduxProvider";
import { JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-KITOBXONA | Системаи идоракунии китобҳои дарсӣ",

  description: "Системаи давлатии автоматикунонидашудаи баҳисобгирии китобҳои дарсии мактабӣ дар Ҷумҳурии Тоҷикистон. Назорат ва тақсимоти рақамии захираҳои таълимӣ.",

  keywords: ["китоб", "мактаб", "е-китобхона", "маориф", "китобҳои дарсӣ", "Тоҷикистон", "маориф ва илм"],

  openGraph: {
    title: "E-KITOBXONA — Платформаи ягонаи маориф",
    description: "Назорат ва идоракунии захираи китобҳои дарсӣ дар сатҳи ҷумҳуриявӣ.",
    url: "https://e-kitobxona.vercel.app",
    siteName: "E-Kitobxona",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Намуди зоҳирии E-Kitobxona",
      },
    ],
    locale: "tg_TJ",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "E-KITOBXONA | Системаи рақамии маориф",
    description: "Системаи назорати китобҳои дарсии мактабӣ",
    images: ["/favicon.ico"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body

        className={`${geistSans.variable} ${geistMono.variable} antialiased  bg-gray-50`}
      >
        <StoreProvider>
          <LayoutWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster position="top-center" richColors />
            </ThemeProvider>
          </LayoutWrapper>
        </StoreProvider>
      </body >
    </html >
  );
}