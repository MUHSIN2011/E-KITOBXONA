import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/src/components/LayoutWrapper";
import StoreProvider from "../ReduxProvider";
import { JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-KITOBXONA | Системаи идоракунӣ",
  description: "Государственная система учёта школьных учебников",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body

        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <StoreProvider>
          <LayoutWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </LayoutWrapper>
        </StoreProvider>
      </body >
    </html >
  );
}