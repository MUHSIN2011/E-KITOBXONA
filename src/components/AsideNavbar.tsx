'use client'
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { TextAnimate } from '@/components/ui/text-animate'
import { Gauge, GraduationCap, SquareLibrary, School, Landmark, FolderPen } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { usePathname } from "next/navigation";

interface DecodedToken {
    role: 'ministry' | 'school';
    email: string;
}

function AsideNavbar() {
    const [role, setRole] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setRole(decoded.role);
            } catch (error) {
                console.error("Токен нодуруст аст");
            }
        }
    }, []);

    // Функсия барои муайян кардани стили линк
    const getLinkStyle = (href: string) => {
        const isActive = pathname === href;
        return `px-4 py-2 flex gap-3 rounded-md cursor-pointer transition-colors ${isActive
                ? "bg-blue-600 text-white"  
                : "hover:bg-slate-800 text-slate-300" 
            }`;
    };

    return (
        <nav className="space-y-2">
            {role === 'school' && (
                <>
                    <Link href="/dashboard-school">
                        <div className={getLinkStyle("/dashboard-school")}>
                            <Gauge className="w-5 h-5" />
                            <TextAnimate animation="slideUp" by="word">Дашборд</TextAnimate>
                        </div>
                    </Link>
                    <Link href="/books-school">
                        <div className={getLinkStyle("/books-school")}>
                            <SquareLibrary className="w-5 h-5" />
                            <TextAnimate animation="slideUp" by="word">Китобҳо</TextAnimate>
                        </div>
                    </Link>
                    <Link href="/students">
                        <div className={getLinkStyle("/students")}>
                            <GraduationCap className="w-5 h-5" />
                            <TextAnimate animation="slideUp" by="word">Хонандагон</TextAnimate>
                        </div>
                    </Link>
                    <Link href="/rentals">
                        <div className={getLinkStyle("/rentals")}>
                            <FolderPen className="w-5 h-5" />
                            <TextAnimate animation="slideUp" by="word">Иҷораи китобҳо</TextAnimate>
                        </div>
                    </Link>
                </>
            )}

            {role === 'region' && (
                <>
                    <Link href="/dashboard-region">
                        <div className={getLinkStyle("/dashboard")}>
                            <Gauge className="w-5 h-5" />
                            <TextAnimate animation="slideUp" by="word">Дашборд</TextAnimate>
                        </div>
                    </Link>
                    <Link href="/books">
                        <div className={getLinkStyle("/books")}>
                            <SquareLibrary className="w-5 h-5" />
                            <TextAnimate animation="slideUp" by="word">Китобҳо</TextAnimate>
                        </div>
                    </Link>
                    <Link href="/schools">
                        <div className={getLinkStyle("/schools")}>
                            <School className="w-5 h-5" />
                            <TextAnimate animation="slideUp" by="word">Мактабҳо</TextAnimate>
                        </div>
                    </Link>
                    <Link href="/ministry">
                        <div className={getLinkStyle("/ministry")}>
                            <Landmark className="w-5 h-5" />
                            <TextAnimate animation="slideUp" by="word">Минтақаҳо</TextAnimate>
                        </div>
                    </Link>
                </>
            )}

            {role === 'ministry' && (
                <>
                    <Link href="/dashboard">
                        <div className={getLinkStyle("/dashboard")}>
                            <Gauge className="w-5 h-5" />
                            <TextAnimate animation="slideUp" by="word">Дашборд</TextAnimate>
                        </div>
                    </Link>
                    <Link href="/books">
                        <div className={getLinkStyle("/books")}>
                            <SquareLibrary className="w-5 h-5" />
                            <TextAnimate animation="slideUp" by="word">Китобҳо</TextAnimate>
                        </div>
                    </Link>
                    <Link href="/schools">
                        <div className={getLinkStyle("/schools")}>
                            <School className="w-5 h-5" />
                            <TextAnimate animation="slideUp" by="word">Мактабҳо</TextAnimate>
                        </div>
                    </Link>
                    <Link href="/ministry">
                        <div className={getLinkStyle("/ministry")}>
                            <Landmark className="w-5 h-5" />
                            <TextAnimate animation="slideUp" by="word">Минтақаҳо</TextAnimate>
                        </div>
                    </Link>
                </>
            )}
        </nav>
    )
}

export default AsideNavbar;