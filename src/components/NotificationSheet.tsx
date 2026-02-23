"use client";

import React, { useState } from "react";
import { Bell, BookCheck, Info, Calendar, ArrowRightCircle, Clock, XCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
    Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useRejectBookRequestMutation, useBookRequestsQuery, useGetPendingBooksBySchoolQuery } from '@/src/api/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

    const { data: bookRequestsData, isLoading: isLoadingRequests } = useBookRequestsQuery();
    const [rejectBookRequest, { isLoading: isRejecting }] = useRejectBookRequestMutation();
    console.log(user);
    const IsMinistry = user?.role === "ministry";
    const IsSchool = user?.role === "school";


    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const handleOpenRejectDialog = (e: React.MouseEvent, requestId: number) => {
        e.stopPropagation();
        setSelectedRequestId(requestId);
        setIsRejectDialogOpen(true);
    };

    return (
        <>
            <Sheet open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                <SheetTrigger asChild>
                    <div className="relative cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                        <Bell size={20} className="text-slate-600 dark:text-slate-400" />
                        {IsSchool ? pendingData?.total_pending_items > 0 && (
                            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                        ) : IsMinistry ? (bookRequestsData?.length ?? 0) > 0 && (
                            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                        ) : null}
                    </div>
                </SheetTrigger>

                <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-white dark:bg-[#0f1115] border-l-slate-200 dark:border-l-slate-800">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <SheetTitle className="text-xl font-black flex items-center gap-2">
                                <Bell className="text-blue-600" size={20} /> Огоҳиномаҳо
                            </SheetTitle>
                            <SheetDescription>
                                {
                                    IsMinistry ? `Шумо ${bookRequestsData?.length || 0} дархости нави китоб доред` :
                                        IsSchool ? `Мактаби шумо: ${pendingData?.total_pending_items || 0} китоби тасдиқнашуда дорад` :
                                            "Шумо огоҳиномаҳои нав надоред"
                                }
                            </SheetDescription>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {IsMinistry ? (
                                isRejecting ? (
                                    <div className="flex h-[80vh] items-center justify-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : bookRequestsData && bookRequestsData.length > 0 ? (
                                    bookRequestsData?.map((request: any) => (
                                        <div
                                            key={request.id}
                                            className="relative p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-300 dark:hover:border-blue-900 transition-all group cursor-pointer mb-3"
                                        >
                                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                                                {
                                                    request.status !== 'fulfilled' && request.status !== 'rejected' && (
                                                        <button
                                                            onClick={() => {
                                                                setIsNotificationOpen(false);
                                                                router.push(`/schools?region_id=${request.region_id}&district_id=${request.district_id}&school_id=${request.school_id}&textbook_id=${request.textbook_id}&quantity=${request.quantity}&request_id=${request.id}`);
                                                            }}
                                                            className="p-1.5 text-green-500 hover:bg-green-100 dark:hover:bg-blue-900/40 cursor-pointer rounded-lg transition-colors"
                                                            title="Иҷро кардан"
                                                        >
                                                            <CheckCircle2 size={22} />
                                                        </button>
                                                    )
                                                }

                                                {request.status !== 'fulfilled' && request.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedRequestId(request.id);
                                                            setIsRejectDialogOpen(true);
                                                        }}
                                                        className="p-1.5 text-red-500 hover:bg-red-100 cursor-pointer dark:hover:bg-red-900/40 rounded-lg transition-colors"
                                                        title="Рад кардан"
                                                    >
                                                        <XCircle size={22} />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                                                    <BookCheck size={20} />
                                                </div>

                                                <div className="flex-1 w-full overflow-hidden">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-bold text-slate-900 dark:text-slate-100 leading-none truncate pr-16">
                                                            {request.textbook_title}
                                                        </h4>
                                                        <span className="text-[10px] relative top-11 font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded uppercase shrink-0">
                                                            {request.status === 'pending' ? 'Интизорӣ' : request.status === 'fulfilled' ? 'Кабул шуда' : 'Радшуда'}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                                                                Синфи {request.textbook_grade}-10
                                                            </span>
                                                            <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                                                                {request.textbook_subject}
                                                            </span>
                                                        </div>

                                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                            <span className="text-slate-400">Мактаб:</span> {request.school_name}
                                                        </p>

                                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                                <Calendar size={12} />
                                                                {new Date(request.created_at).toLocaleDateString('tj-TJ')}
                                                            </div>
                                                            <div className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
                                                                {request.quantity} дона
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-slate-500 text-sm">Дархостҳои нави китоб нестанд</div>
                                )
                            ) : IsSchool ? (
                                isPendingLoading ? (
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
                                )
                            ) : (
                                <div className="flex h-[75vh] items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            )
                            }
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <Dialog
                open={isRejectDialogOpen}
                onOpenChange={(open) => {
                    setIsRejectDialogOpen(open);
                    if (!open) {
                        setRejectionReason(""); // Вақте ки пӯшида мешавад, сабабро тоза кун
                        setSelectedRequestId(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-red-600">Рад кардани дархост</DialogTitle>
                        <DialogDescription>
                            Лутфан сабаби рад кардани ин дархостро зикр кунед. Ин маълумот ба мактаб фиристода мешавад.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Сабаб / Эзоҳ</Label>
                            <Textarea
                                id="reason"
                                placeholder="Масалан: Ин китоб дар анбор мавҷуд нест..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                            Баргаштан
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={!rejectionReason || isRejecting}
                            onClick={async () => {
                                if (selectedRequestId) {
                                    try {
                                        await rejectBookRequest({
                                            requestId: selectedRequestId,
                                            comment: rejectionReason
                                        }).unwrap();

                                        setIsRejectDialogOpen(false);
                                        setRejectionReason("");
                                        setSelectedRequestId(null);
                                        // Истифодаи toast беҳтар аст, агар дошта бошед
                                        alert("Дархост рад шуд");
                                    } catch (err) {
                                        alert("Хатогӣ ҳангоми рад кардан");
                                    }
                                }
                            }}
                        >
                            {isRejecting ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={18} />
                                    Дар ҳоли иҷро...
                                </>
                            ) : (
                                "Тасдиқи радкунӣ"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}