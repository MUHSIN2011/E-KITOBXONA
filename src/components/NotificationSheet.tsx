"use client";

import React from "react";
import { BellDot, BookCheck, Info, Calendar, ArrowRightCircle, Clock } from "lucide-react";
import {
    Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGetPendingBooksBySchoolQuery } from '@/src/api/api';

export function NotificationSheet({ user }: { user: any }) {
    const router = useRouter();
    const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);

    const { data: pendingData, isLoading: isPendingLoading } = useGetPendingBooksBySchoolQuery(
        user?.school_id ?? 0,
        {
            skip: !user?.school_id || user.role !== "school",
            refetchOnFocus: true,
        }
    );

    if (user?.role !== "school") return null;

    return (
        <Sheet open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
            <SheetTrigger asChild>
                <div className="relative cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                    <BellDot size={20} className="text-slate-600 dark:text-slate-400" />
                    {pendingData?.total_pending_items > 0 && (
                        <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                    )}
                </div>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-white dark:bg-[#0f1115] border-l-slate-200 dark:border-l-slate-800">
                <div className="flex flex-col h-full">
                    <SheetHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <SheetTitle className="text-xl font-black flex items-center gap-2">
                            <BellDot className="text-blue-600" size={20} /> Огоҳиномаҳо
                        </SheetTitle>
                        <SheetDescription>
                            {pendingData?.to_school_name || "Мактаби шумо"}: {pendingData?.total_pending_items || 0} китоби тасдиқнашуда
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {isPendingLoading ? (
                            <div className="flex h-[80vh] items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : pendingData?.by_textbook?.length > 0 ? (
                            pendingData.by_textbook.map((item: any) => (
                                <div key={item.textbook_id} className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-300 dark:hover:border-blue-900 transition-all group">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                                            <BookCheck size={20} />
                                        </div>

                                        <div className="flex-1 w-full">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-900 dark:text-slate-100 leading-none">
                                                    {item.textbook_title}
                                                </h4>
                                                <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded uppercase shrink-0">
                                                    Интизорӣ
                                                </span>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                                                    <Info size={12} /> Ҳамагӣ: <span className="font-bold text-slate-700 dark:text-slate-300">{item.pending_items} дона</span>
                                                </p>
                                                <p className="text-[11px] text-blue-600 font-semibold italic">
                                                    — {item.supplies?.length} бор равон карда шуд
                                                </p>
                                            </div>

                                            <div className="mt-4 space-y-2 border-t border-slate-200/50 dark:border-slate-800 pt-3">
                                                {item.supplies?.map((supply: any) => (
                                                    <div key={supply.supply_id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                                                                Партияи №{supply.supply_id}
                                                            </span>
                                                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar size={10} />
                                                                    {new Date(supply.created_at).toLocaleDateString('tj-TJ')}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock size={10} />
                                                                    {new Date(supply.created_at).toLocaleTimeString('tj-TJ', { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[11px] font-bold text-blue-600">{supply.pending_items} дона</span>
                                                            <Button
                                                                onClick={() => {
                                                                    setIsNotificationOpen(false);
                                                                    router.push(`/supplies/${supply.supply_id}`);
                                                                }}
                                                                variant="ghost" size="icon" className="h-8 w-8 text-blue-500 rounded-full"
                                                            >
                                                                <ArrowRightCircle size={18} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-500 text-sm">Огоҳиномаҳои нав нестанд</div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}