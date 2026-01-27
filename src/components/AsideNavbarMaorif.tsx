import { Gauge, GraduationCap, SquareLibrary } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function AsideNavbarMaorif() {
    return (
        <nav className="space-y-2">
            <Link href="/dahsbo">
                <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                    <Gauge />
                    Дашборд
                </div>
            </Link>
            <Link href="/books">
                <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                    <SquareLibrary />
                    Китобҳо
                </div>
            </Link>
            <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                <GraduationCap />
                Хонандагон
            </div>
        </nav>
    )
}

export default AsideNavbarMaorif