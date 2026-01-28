'use client'
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react"; // Фақат як бор импорт кунед
import { TextAnimate } from '@/components/ui/text-animate'
import { Gauge, GraduationCap, SquareLibrary, School, Landmark, ReceiptText } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface DecodedToken {
    role: 'ministry' | 'school';
    email: string;
}

function AsideNavbarMaorif() {
    const [role, setRole] = useState<string | null>(null);

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

    return (
        <nav className="space-y-2">
            <Link href="/dashboard">
                <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                    <Gauge className="w-5 h-5 text-blue-400" />
                    <TextAnimate animation="slideUp" by="word">Дашборд</TextAnimate>
                </div>
            </Link>

            <Link href="/books">
                <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                    <SquareLibrary className="w-5 h-5 text-green-400" />
                    <TextAnimate animation="slideUp" by="word">Китобҳо</TextAnimate>
                </div>
            </Link>

            {role === 'school' && (
                <>
                    <Link href="/students">
                        <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                            <GraduationCap className="w-5 h-5 text-yellow-400" />
                            <TextAnimate animation="slideUp" by="word">Хонандагон</TextAnimate>
                        </div>
                    </Link>
                    <Link href="/finance">
                        <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                            <ReceiptText className="w-5 h-5 text-purple-400" />
                            <TextAnimate animation="slideUp" by="word">Молия</TextAnimate>
                        </div>
                    </Link>
                </>
            )}

            {role === 'ministry' && (
                <>
                    <Link href="/schools">
                        <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                            <School className="w-5 h-5 text-orange-400" />
                            <TextAnimate animation="slideUp" by="word">Мактабҳо</TextAnimate>
                        </div>
                    </Link>
                    <Link href="/regions">
                        <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                            <Landmark className="w-5 h-5 text-red-400" />
                            <TextAnimate animation="slideUp" by="word">Минтақаҳо</TextAnimate>
                        </div>
                    </Link>
                </>
            )}
        </nav>
    )
}

export default AsideNavbarMaorif