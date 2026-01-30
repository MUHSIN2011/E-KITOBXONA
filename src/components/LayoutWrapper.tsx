"use client";

import { usePathname, useRouter } from "next/navigation";
import { BookOpenText, LogOut, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AsideNavbar from "@/src/components/AsideNavbar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface UserToken {
    full_name: string;
    role: string;
    district_id: number
    email: string
    exp: number
    region_id: number
    school_id: number
    sub: string
    type: string
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<UserToken | null>(null);
    console.log(user);



    const isLoginPage = pathname === "/";
    const isRegisterPage = pathname === "/register";

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode<UserToken>(token);
                setUser(decoded);
            } catch (error) {
                console.error("Хатогӣ дар хондани токен");
            }
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token && !isLoginPage && !isRegisterPage) {
            router.push('/');
        }
    }, [pathname]);

    const Logout = () => {
        localStorage.clear();
        router.push('/');
    };

    return (
        <div className="flex md:min-h-screen">
            {!isLoginPage && !isRegisterPage && (
                <>
                    <div className="lg:hidden fixed top-4 left-4 z-50">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className=" ">
                                    <Menu size={24} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72 bg-slate-900 border-r-slate-800 text-white">
                                <div className="flex flex-col h-full text-white">
                                    <div className="px-4 py-5">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-10 h-10 bg-blue-500 rounded-sm flex items-center justify-center font-bold">
                                                <BookOpenText color="white" />
                                            </div>
                                            <div>
                                                <h1 className="text-lg font-bold leading-none">E-KITOBXONA</h1>
                                                <p className="text-xs text-slate-400 mt-1">Системаи идоракунӣ</p>
                                            </div>
                                        </div>
                                        <AsideNavbar />
                                    </div>

                                    <footer className="mt-auto px-4 py-4 space-y-2 border-t border-slate-800">
                                        <div onClick={() => router.push('/profile')} className="flex cursor-pointer hover:bg-slate-800 p-2 duration-300 rounded-t-xl items-center gap-3 border-b border-slate-700 pb-4">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold uppercase border-2 border-blue-400">
                                                {user?.email ? user.email[0] : "U"}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h1 className="font-bold leading-none truncate">
                                                    {user?.email ? user.email.split('@')[0] : "User"}
                                                </h1>
                                                <p className="text-[10px] text-slate-400 mt-1 uppercase">
                                                    {user?.role === "ministry" ? "Вазорат" : "Мактаб"}
                                                </p>
                                            </div>
                                        </div>
                                        <div onClick={Logout} className="px-4 py-2 hover:bg-slate-800 rounded-md flex gap-2 items-center cursor-pointer hover:text-red-500 duration-300 text-slate-300">
                                            <LogOut size={20} /> <span className="font-medium">Log out</span>
                                        </div>
                                    </footer>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <aside className="hidden lg:block w-64 bg-slate-900 text-white fixed h-full z-10 border-r border-slate-800 shadow-2xl">
                        <div className="p-6 flex flex-col justify-between h-screen">
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-blue-500 rounded-sm flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
                                        <BookOpenText />
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold leading-none tracking-tight">E-KITOBXONA</h1>
                                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Системаи идоракунӣ</p>
                                    </div>
                                </div>
                                <AsideNavbar />
                            </div>

                            <footer className="space-y-3 pt-4 border-t border-slate-800">
                                <div onClick={() => router.push('/profile')} className="flex cursor-pointer hover:bg-slate-800/50 p-2 duration-300 rounded-xl items-center gap-3 transition-all border border-transparent hover:border-slate-700">
                                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-bold uppercase shadow-md border border-blue-400">
                                        {user?.email ? user.email[0] : "U"}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h1 className="font-bold text-sm leading-none truncate">
                                            {user?.email ? user.email.split('@')[0] : "User"}
                                        </h1>
                                        <p className="text-[10px] text-slate-500 mt-1 font-medium">
                                            {user?.role === "ministry" ? "Сатҳи Миллӣ" : "Сатҳи Мактабӣ"}
                                        </p>
                                    </div>
                                </div>
                                <div onClick={Logout} className="px-4 py-2 hover:bg-red-500/10 rounded-xl flex gap-3 items-center cursor-pointer text-slate-400 hover:text-red-500 duration-300 transition-all group">
                                    <LogOut size={18} className="group-hover:-translate-x-1 duration-300" />
                                    <span className="text-sm font-semibold">Log out</span>
                                </div>
                            </footer>
                        </div>
                    </aside>
                </>
            )}

            <main className={`md:flex-1 min-h-screen flex flex-col ${!isLoginPage && !isRegisterPage ? "md:ml-64" : "justify-center items-center"}`}>
                {!isLoginPage && !isRegisterPage && (
                    <header className="h-16 bg-white border-b sticky top-0 z-49 md:px-8 pr-3 pl-15 flex items-center justify-between w-full">
                        <span className="text-sm font-medium text-gray-500">
                            {user?.role === "ministry" ? "Маориф" : `Сатҳи мактабӣ ${user?.email.split('@')[0]}`}
                        </span>
                        <div className="flex items-center">
                            <Search className="relative left-9 text-blue-500" />
                            <Input
                                id="search"
                                type="search"
                                placeholder="Search"
                                className="pl-10 pr-3 h-10 md:w-90 w-45 rounded-xl"
                            />
                        </div>
                    </header>
                )}

                <div className={!isLoginPage && !isRegisterPage ? "md:p-4" : "w-full flex justify-center"}>
                    {children}
                </div>
            </main>
        </div>
    );
}