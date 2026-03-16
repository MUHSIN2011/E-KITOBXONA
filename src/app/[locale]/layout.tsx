import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import StoreProvider from "@/ReduxProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
        url: "https://e-kitobxona.vercel.app/favicon.img",
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
    title: "E-KITOBXONA | Системаи Вазорати Маориф",
    description: "Системаи назорати китобҳои дарсии мактабӣ",
    images: ["/favicon.ico"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  let resolvedParams: any;
  try {
    resolvedParams = await params;
  } catch (error) {
    console.error('Error awaiting params:', error);
    notFound();
  }

  const locale = resolvedParams?.locale;


  if (!locale) {
    console.error('No locale found in params');
    notFound();
  }

  const locales = ['en', 'ru', 'tj'];
  if (!locales.includes(locale)) {
    notFound();
  }

  let messages: any = {};
  if (locale === 'en') {
    messages = (await import('@/messages/en.json')).default;
  } else if (locale === 'ru') {
    messages = (await import('@/messages/ru.json')).default;
  } else if (locale === 'tj') {
    messages = (await import('@/messages/tj.json')).default;
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}