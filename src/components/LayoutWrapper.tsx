"use client";

import { usePathname, useRouter } from "next/navigation";
import { BookOpenText, LogOut, Menu, PanelRightClose, PanelLeftClose, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AsideNavbar from "@/src/components/AsideNavbar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menubar, MenubarContent, MenubarGroup, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

interface UserToken {
    full_name: string;
    role: string;
    district_id: number;
    email: string;
    exp: number;
    region_id: number;
    school_id: number;
    sub: string;
    type: string;
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<UserToken | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const isLoginPage = pathname === "/";
    const isRegisterPage = pathname === "/register";

    useEffect(() => {
        setIsSheetOpen(false);
    }, [pathname]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode<UserToken>(token);
                setUser(decoded);
            } catch (error) {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [pathname]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token && !isLoginPage && !isRegisterPage) {
            router.push('/');
        } else {
            setIsLoading(false);
        }
    }, [pathname, isLoginPage, isRegisterPage, router]);

    const Logout = () => {
        localStorage.clear();
        router.push('/');
    };

    if (isLoading && !isLoginPage && !isRegisterPage) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full overflow-hidden">
            {!isLoginPage && !isRegisterPage && (
                <>
                    <div className="lg:hidden fixed top-3.5 left-4 z-50">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 dark:border-slate-800">
                                    <Menu size={20} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72 bg-slate-900 dark:bg-black border-r-slate-800 text-white">
                                <div className="flex flex-col h-full">
                                    <div className="px-4 py-6">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center font-bold">
                                                <BookOpenText color="white" size={24} />
                                            </div>
                                            <div>
                                                <h1 className="text-lg font-bold leading-none">E-KITOBXONA</h1>
                                                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Системаи идоракунӣ</p>
                                            </div>
                                        </div>
                                        <AsideNavbar />
                                    </div>
                                    <footer className="mt-auto px-4 py-4 space-y-2 border-t border-slate-800">
                                        <div onClick={() => router.push('/profile')} className="flex cursor-pointer hover:bg-slate-800 p-2 rounded-lg items-center gap-3 transition-colors">
                                            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center font-bold uppercase">
                                                {user?.email ? user.email[0] : "U"}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-bold text-sm truncate">{user?.email?.split('@')[0]}</p>
                                                <p className="text-[10px] text-slate-400 uppercase">{user?.role}</p>
                                            </div>
                                        </div>
                                        <button onClick={Logout} className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-red-400 transition-colors">
                                            <LogOut size={18} /> <span className="text-sm font-medium">Баромад</span>
                                        </button>
                                    </footer>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <aside className={`hidden lg:block bg-slate-900 dark:bg-[#0f1115] text-white fixed h-full z-30 border-r border-slate-800 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"}`}>
                        <div className={`p-6 flex flex-col h-full transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-900/20">
                                    <BookOpenText size={24} />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold tracking-tight">E-KITOBXONA</h1>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-tighter">Системаи идоракунӣ</p>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <AsideNavbar />
                            </div>
                            <footer className="pt-4 border-t border-slate-800 space-y-4">
                                <div className="flex items-center justify-between group">
                                    <div onClick={() => router.push('/profile')} className="flex items-center gap-3 cursor-pointer overflow-hidden">
                                        <div className="w-9 h-9 min-w-[36px] bg-blue-600 rounded-full flex items-center justify-center font-bold uppercase border border-blue-400/30">
                                            {user?.email ? user.email[0] : "U"}
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-bold truncate">{user?.email?.split('@')[0]}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{user?.role === "ministry" ? "Сатҳи Миллӣ" : "Сатҳи Мактабӣ"}</p>
                                        </div>
                                    </div>
                                    <Menubar className="border-none bg-transparent">
                                        <MenubarMenu>
                                            <MenubarTrigger className="p-1 cursor-pointer"><Settings size={18} className="text-slate-500 hover:text-white transition-colors" /></MenubarTrigger>
                                            <MenubarContent className="bg-slate-900 border-slate-800 text-white min-w-[120px]">
                                                <MenubarItem onClick={() => router.push('/profile')}>Профил</MenubarItem>
                                                <MenubarItem>Танзимот</MenubarItem>
                                            </MenubarContent>
                                        </MenubarMenu>
                                    </Menubar>
                                </div>
                                <button onClick={Logout} className="flex items-center gap-3 cursor-pointer hover:bg-red-500/10 p-3 rounded-sm text-slate-400 hover:text-red-500 transition-all text-sm font-semibold w-full px-1">
                                    <LogOut size={18} /> Баромад
                                </button>
                            </footer>
                        </div>
                    </aside>
                </>
            )}

            <main className={`flex-1 min-h-screen bg-slate-50 dark:bg-black transition-all duration-300 ease-in-out ${!isLoginPage && !isRegisterPage ? (isSidebarOpen ? "lg:ml-64" : "ml-0") : ""}`}>
                {!isLoginPage && !isRegisterPage && (
                    <header className={`fixed top-0 right-0 z-20 h-16 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between transition-all duration-300 ease-in-out ${isSidebarOpen ? "lg:left-64" : "left-0"}`}>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:flex items-center justify-center size-9 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
                                {isSidebarOpen ? <PanelRightClose size={20} /> : <PanelLeftClose size={20} />}
                            </button>
                            <div className="ml-10 lg:ml-0 flex items-center gap-2">
                                {user?.role === "ministry" ? (
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Вазорати маориф</span>
                                ) : (
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Сатҳи мактабӣ: {user?.email?.split('@')[0] || ""}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <AnimatedThemeToggler />
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <Input
                                    placeholder="Ҷустуҷӯ..."
                                    className="pl-9 h-9 w-48 md:w-64 bg-slate-100/50 dark:bg-slate-900/50 border-transparent focus:bg-white dark:focus:bg-slate-900 rounded-lg text-sm transition-all"
                                />
                            </div>
                        </div>
                    </header>
                )}

                <div className={`w-full ${!isLoginPage && !isRegisterPage ? "pt-20 px-4 md:px-8 pb-8" : "h-full flex items-center justify-center"}`}>
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}