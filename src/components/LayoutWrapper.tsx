"use client";

import { usePathname, useRouter } from "next/navigation";
import { BookOpenText, LogOut, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AsideNavbarMaorif from "@/src/components/AsideNavbarMaorif";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/";
    const isRegisterPage = pathname === "/register";
    const Logout = () => {
        localStorage.clear()
        router.push('/')
    }

    return (
        <div className="flex min-h-screen">
            {!isLoginPage && !isRegisterPage && (
                <aside className="w-64 bg-slate-900 text-white fixed h-full z-10">
                    <div className="p-6 flex flex-col justify-between h-screen">
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
                                    <h1 className="font-bold leading-none">Muhsiddin Nazarov</h1>
                                    <p className="text-xs text-slate-400 mt-1">Сатҳи Вазорат</p>
                                </div>
                            </div>
                            <div onClick={() => Logout()} className="px-4 py-2 hover:bg-slate-800 rounded-md flex gap-1 cursor-pointer hover:text-red-600 duration-500 transition-colors">
                                <LogOut /> Log out
                            </div>
                        </footer>
                    </div>
                </aside>
            )}

            <main className={`flex-1 min-h-screen flex flex-col ${!isLoginPage && !isRegisterPage ? "ml-64" : "justify-center items-center"}`}>

                {!isLoginPage && !isRegisterPage && (
                    <header className="h-16 bg-white border-b sticky top-0 z-5 px-8 flex items-center justify-between w-full">
                        <span className="text-sm font-medium text-gray-500">Сатҳи миллӣ</span>
                        <div className="flex items-center">
                            <Search className="relative left-9 text-blue-500" />
                            <Input
                                id="search"
                                type="search"
                                placeholder="Search"
                                className="pl-10 pr-3 h-10 w-90 rounded-xl"
                            />
                        </div>
                    </header>
                )}

                <div className={!isLoginPage && !isRegisterPage ? "p-4" : "w-full flex justify-center"}>
                    {children}
                </div>
            </main>
        </div>
    );
}