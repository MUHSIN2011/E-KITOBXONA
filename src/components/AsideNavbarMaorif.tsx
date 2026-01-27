import { TextAnimate } from '@/components/ui/text-animate'
import { Gauge, GraduationCap, SquareLibrary } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function AsideNavbarMaorif() {
    return (
        <nav className="space-y-2">
            <Link href="/dashboard">
                <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                    <Gauge />
                    <TextAnimate animation="slideUp" by="word" >
                        Дашборд
                    </TextAnimate>
                </div>
            </Link>
            <Link href="/books">
                <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                    <SquareLibrary />
                    <TextAnimate animation="slideUp" by="word" >
                        Китобҳо
                    </TextAnimate>
                </div>
            </Link>
            <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                <GraduationCap />
                <TextAnimate animation="slideUp" by="word" >
                    Хонандагон
                </TextAnimate>
            </div>
        </nav>
    )
}

export default AsideNavbarMaorif