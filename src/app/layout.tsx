import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BookOpenText, LogOut, Search } from "lucide-react";
import AsideNavbarMaorif from "./components/AsideNavbarMaorif";
import { Input } from "@/components/ui/input";

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
    <html lang="tg">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <div className="flex min-h-screen">
          <aside className="w-64 bg-slate-900 text-white fixed h-full z-10">
            <div className="p-6 flex flex-col justify-between  h-screen">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-blue-500 rounded-sm flex items-center justify-center font-bold">
                    <BookOpenText />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold leading-none">E-KITOBXONA</h1>
                    <p className="text-xs text-slate-400 mt-1">Системаи идоракунӣ</p>
                  </div>
                </div>

                <AsideNavbarMaorif />
              </div>
              <footer className="space-y-2">
                <div className="flex items-center gap-3 border-b-gray-400 border-b py-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                    A
                  </div>
                  <div>
                    <h1 className=" font-bold leading-none">Muhsiddin Nazarov</h1>
                    <p className="text-xs text-slate-400 mt-1">Сатҳи Вазорат</p>
                  </div>
                </div>
                <div className="px-4 py-2 hover:bg-slate-800 rounded-md flex gap-1 cursor-pointer hover:text-red-600 duration-500 transition-colors"><LogOut /> Log out</div>
              </footer>
            </div>
          </aside>

          <main className="flex-1 ml-64 min-h-screen">
            <header className="h-16 bg-white border-b sticky top-0 z-5 px-8 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Сатҳи миллӣ</span>
              <div className="flex items-center ">
                <Search className="relative left-9 text-blue-500" />
                <Input
                  id="search"
                  type="search"
                  placeholder="Search"
                  className="pl-10 pr-3 h-10 w-90  rounded-xl"
                />
              </div>
            </header>

            <div className="">
              {children}
            </div>
          </main>
        </div>
      </body >
    </html >
  );
}