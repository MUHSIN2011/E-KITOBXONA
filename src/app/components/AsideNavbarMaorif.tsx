import { Gauge, GraduationCap, SquareLibrary } from 'lucide-react'
import React from 'react'

function AsideNavbarMaorif() {
    return (
        <nav className="space-y-2">
            <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                <Gauge />
                Дашборд
            </div>
            <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                <SquareLibrary />
                Китобҳо
            </div>
            <div className="px-4 py-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                <GraduationCap />
                Хонандагон
            </div>
        </nav>
    )
}

export default AsideNavbarMaorif