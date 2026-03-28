'use client'
import CardsStudent from '@/components/CardsStudent'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TextAnimate } from '@/components/ui/text-animate'
import { Caravan, ArrowRightLeft, Clock, BadgeCheck, Funnel, SearchAlert, Info, CircleCheckBig, Calendar, ArrowRight, FileText, BookOpen, XCircle, CheckCircle2 } from 'lucide-react'
import TransferDialog from '@/components/TransferDialog'
import React, { useState } from 'react'
import { useGetMeQuery, useLazyTransfersByIdQuery, useMyTransfersQuery, useTransfersCancelMutation } from '@/api/api'
import { XIcon } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import toast, { Toaster } from 'react-hot-toast'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

export default function Page() {
    const [infoTransfersById, setInfoTransfersById] = useState<any>(null);
    const { data: DataMe, isLoading: isLoadingMe } = useGetMeQuery();
    const userRole = DataMe?.role;
    const { data: data, isLoading: isLoadingMyTransfers } = useMyTransfersQuery() as { data: { total: number; items: any[] } | undefined; isLoading: boolean }
    const [transfersCancel, { isLoading: isLoadingtransferscancel }] = useTransfersCancelMutation()
    const [triggerGetInfo, { isFetching }] = useLazyTransfersByIdQuery();
    const totalTransfers = data?.total || 0;
    const pendingCount = data?.items?.filter((item: any) => item.status === 'pending').length || 0;
    const completedCount = data?.items?.filter((item: any) => item.status === 'accepted' || item.status === 'completed').length || 0;
    const cancelledCount = data?.items?.filter((item: any) => item.status === 'cancelled').length || 0;


    const handleCancel = async (id: number) => {
        try {
            await transfersCancel({ IdTransfer: id }).unwrap();
            toast.success("Интиқол бекор карда шуд");
        } catch (error) {
            toast.error("Хатогӣ ҳангоми бекор кардан интиқоли китоб");
        }
    };

    const handleInfo = async (id: number) => {
        try {
            const res = await triggerGetInfo(id).unwrap();
            setInfoTransfersById(res);
        } catch (error) {
            toast.error("Хатогӣ ҳангоми дидани интиқол");
        }
    }

    return (
        <div className='md:px-0 px-3'>
            <Toaster />
            <div className='flex md:flex-row flex-col md:gap-0 gap-2 justify-between items-center'>
                <div>
                    <TextAnimate className='md:text-2xl text-xl font-bold' animation="slideUp" by="word">
                        Интиқоли китобҳо
                    </TextAnimate>
                    <TextAnimate className='text-foreground text-sm' animation="slideUp" by="word">
                        Фиристодани китобҳо аз як мактаб ба мактаби дигар
                    </TextAnimate>
                </div>
                <TransferDialog>
                    <Button className='bg-[#0950c3] dark:bg-[#2563eb] hover:bg-blue-700 dark:hover:bg-blue-600 flex gap-2 text-white md:py-5 py-2 px-4 md:w-50 w-full rounded-sm text-sm font-medium'>
                        <Caravan className='w-6 h-6' /> Равон кардан
                    </Button>
                </TransferDialog>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 my-5'>
                <CardsStudent Icons={<ArrowRightLeft className="text-blue-500 dark:text-blue-400" />} NameRole='Ҳамаи интиқолҳо' cnt={totalTransfers} />
                <CardsStudent
                    Icons={<Clock className="text-yellow-500 dark:text-yellow-400" />}
                    NameRole='Дар ҳоли интизорӣ'
                    cnt={pendingCount}
                />
                <CardsStudent Icons={<BadgeCheck className="text-green-500 dark:text-green-400" />} NameRole='Иҷрошуда' cnt={completedCount} />
                <CardsStudent Icons={<XCircle className="text-red-500 dark:text-red-400" />} NameRole='Рад Шуда' cnt={cancelledCount} />
            </div>
            <section className='py-5 px-3 bg-white dark:bg-[#1f1f1f] rounded-xl border shadow-sm dark:border-gray-700'>
                <h1 className='text-xl font-bold dark:text-gray-100'>Рӯйхати интиқолҳо</h1>
                <p className='text-muted-foreground text-sm mb-4 dark:text-gray-400'>Ҳамаи интиқолҳо бақайдгирифташуда</p>

                <div className='grid grid-cols-1 md:grid-cols-5 gap-3 mb-4'>
                    <input
                        className='md:col-span-4 rounded-xl px-4 py-2 border focus:cursor-progress bg-[#f9fafb] dark:bg-[#2d2d2d] dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all'
                        placeholder='Ҷустуҷӯи хонандагон...'
                        type="search"
                    />
                    <div className="relative md:col-span-1">
                        <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-gray-400 z-10" />
                        <Select>
                            <SelectTrigger className="w-full bg-[#f9fafb] cursor-pointer dark:bg-[#2d2d2d] dark:border-gray-600 dark:text-gray-200 pl-10 h-10 rounded-xl border-gray-200">
                                <SelectValue placeholder="Хама" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Ҳама</SelectItem>
                                <SelectItem value="10">Кабул Шуда</SelectItem>
                                <SelectItem value="11">Дар ҳоли интизорӣ</SelectItem>
                                <SelectItem value="12">Рад шуда</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Dialog
                    open={!!infoTransfersById}
                    onOpenChange={(open) => !open && setInfoTransfersById(null)}
                >
                    <DialogContent className="max-w-2xl border border-gray-600 shadow-2xl p-0 overflow-hidden rounded-3xl">
                        <div className="bg-gradient-to-r from-[#063888] to-blue-700 p-6 text-white">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <DialogTitle className="text-2xl font-bold tracking-tight">
                                        Интиқоли №{infoTransfersById?.id}
                                    </DialogTitle>
                                    <div className="flex items-center gap-2 opacity-90 text-xs">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(infoTransfersById?.created_at).toLocaleString('tg-TJ')}
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${infoTransfersById?.status === 'pending'
                                    ? 'bg-yellow-100/90 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30'
                                    : infoTransfersById?.status === 'cancelled'
                                        ? 'bg-red-100/90 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30'
                                        : 'bg-emerald-100/90 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'
                                    }`}>
                                    {infoTransfersById?.status === 'pending' && <Clock className="w-3 h-3 animate-pulse" />}
                                    {infoTransfersById?.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                    {infoTransfersById?.status !== 'pending' && infoTransfersById?.status !== 'cancelled' && <CheckCircle2 className="w-3 h-3" />}

                                    <span>
                                        {infoTransfersById?.status === 'pending'
                                            ? 'Дар интизорӣ'
                                            : infoTransfersById?.status === 'cancelled'
                                                ? 'Рад шуд'
                                                : 'Қабул шуд'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6 bg-white dark:bg-[#1a1a1a] max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <DialogDescription className="space-y-6">

                                <div className="relative flex items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-[#262626] border border-gray-100 dark:border-gray-800">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Аз мактаби</p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{infoTransfersById?.from_school_name}</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <ArrowRight className="w-4 h-4 text-[#0950c3]" />
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Ба мактаби</p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{infoTransfersById?.to_school_name}</p>
                                    </div>
                                </div>

                                {/* Сабаб */}
                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-400 uppercase">Сабаби интиқол</p>
                                        <p className="text-sm italic text-blue-900 dark:text-blue-300">"{infoTransfersById?.reason}"</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <h3 className="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                            <BookOpen className="w-4 h-4 text-blue-500" />
                                            Рӯйхати китобҳо
                                        </h3>
                                        <span className="text-[10px] font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md">
                                            Ҷамъ: {infoTransfersById?.items?.length} дона
                                        </span>
                                    </div>

                                    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50 dark:bg-[#212121] border-b border-gray-100 dark:border-gray-800">
                                                <tr>
                                                    <th className="px-4 py-3 font-bold text-gray-500 text-[11px] uppercase">Ном ва Синф</th>
                                                    <th className="px-4 py-3 font-bold text-gray-500 text-[11px] uppercase">Инв. №</th>
                                                    <th className="px-4 py-3 font-bold text-gray-500 text-[11px] uppercase">Ҳолат</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                                {infoTransfersById?.items?.map((item: any) => (
                                                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-[#252525] transition-colors">
                                                        <td className="px-4 py-3">
                                                            <p className="font-semibold text-gray-800 dark:text-gray-200 leading-tight">{item.textbook_title}</p>
                                                            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Синфи {item.grade} • {item.subject_name}</p>
                                                        </td>
                                                        <td className="px-4 py-3 font-mono text-xs text-blue-600 dark:text-blue-400">{item.inventory_number}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold border ${item.condition === 'new'
                                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                                : 'bg-orange-50 text-orange-600 border-orange-100'
                                                                }`}>
                                                                {item.condition === 'new' ? 'НАВ' : 'КӮҲНА'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </DialogDescription>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-[#1f1f1f] border-t border-gray-100 dark:border-gray-800 flex justify-end">
                            <Button onClick={() => setInfoTransfersById(null)} className="bg-[#0950c3] hover:bg-blue-700 text-white rounded-xl px-8 py-2 font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5">
                                Фаҳмо
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="overflow-x-auto md:max-w-full max-w-84 border rounded-lg dark:border-gray-700">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-[#2a2a2a] border-b dark:border-gray-700">
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">АЗ Мактаби</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Ба Мактаби</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Китоб</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 ">Синфи</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Сана</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Статус</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {isLoadingMyTransfers ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        <td className="p-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div></td>
                                        <td className="p-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div></td>
                                        <td className="p-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div></td>
                                        <td className="p-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div></td>
                                        <td className="p-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
                                        <td className="p-4"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div></td>
                                    </tr>
                                ))
                            ) : data?.items?.length === 0 ? (
                                <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                                    <td colSpan={8} className="p-10 text-center dark:text-gray-300">
                                        <div className="flex flex-col items-center justify-center gap-3 text-gray-400 w-full">
                                            <SearchAlert size={48} className="opacity-50" />
                                            <p className="text-lg font-medium">Ягон Трансфер ёфт нашуд!</p>
                                            <span className="text-sm">Рӯйхат ҳоло холӣ аст.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data?.items?.map((trans: any) => (
                                    <tr key={trans.id} onClick={() => handleInfo(trans.id)} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a]  transition-colors">
                                        <td className="p-4 text-sm dark:text-gray-300">{trans.from_school_name}</td>
                                        <td className="p-4 text-sm dark:text-gray-300">{trans.to_school_name}</td>
                                        <td className="p-4 text-sm dark:text-gray-300">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                                                    {trans.items?.[0]?.textbook_title}
                                                    {trans.items?.length > 1 && trans.items[0].textbook_title !== trans.items[1].textbook_title && (
                                                        `, ${trans.items[1].textbook_title}`
                                                    )}
                                                </span>

                                                {trans.items?.length > 1 ? (
                                                    <span className="text-[10px] text-blue-500 font-bold uppercase mt-0.5">
                                                        {trans.items[0].textbook_title === trans.items[1].textbook_title
                                                            ? `+ ${trans.items.length - 1} нусхаи дигар`
                                                            : trans.items.length > 2
                                                                ? `+ ${trans.items.length - 2} китоби дигар`
                                                                : null
                                                        }
                                                    </span>
                                                ) : null}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm dark:text-gray-300">
                                            <span className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                                                {trans.items?.length > 1 && trans.items[0].grade === trans.items[1].grade ? (
                                                    `Синфи ${trans.items[0].grade}`
                                                ) : (
                                                    <>
                                                        Синфи {trans.items?.[0]?.grade}
                                                        {trans.items?.length > 1 && `, Синфи ${trans.items?.[1]?.grade}`}
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm dark:text-gray-300">
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {new Date(trans.created_at).toLocaleDateString('tg-TJ')}
                                                </span>
                                                <span className="text-[10px] text-gray-500">
                                                    {new Date(trans.created_at).toLocaleTimeString('tg-TJ', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            {trans.status === 'pending' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full transition-colors">
                                                    {trans.status === 'pending' ? (
                                                        userRole === trans.to_entity_type ? (
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <div onClick={(e) => e.stopPropagation()} className="group inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-red-950/20 border border-yellow-200/80 dark:border-red-900/20 transition-all cursor-pointer">
                                                                        <div className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-[#fa7e6283] dark:bg-red-800/50 group-hover:bg-red-500 transition-colors">
                                                                            <XIcon className="w-3 h-3 text-red-700 dark:text-red-200 group-hover:text-white" />
                                                                        </div>
                                                                        <span className="text-xs font-semibold text-yellow-600 dark:text-red-400">
                                                                            Интизор
                                                                        </span>
                                                                    </div>
                                                                </AlertDialogTrigger>

                                                                <AlertDialogContent className="rounded-2xl">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Тасдиқ кунед</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Оё шумо мутмаин ҳастед, ки китобҳои равонкардаро возврат (бекор) мекунед?
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel className="rounded-xl">Не</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleCancel(trans.id)}
                                                                            className="bg-red-500 hover:bg-red-600 rounded-xl text-white"
                                                                        >
                                                                            Бале, возврат шавад
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100">
                                                                <Clock className="w-2.5 h-2.5" />
                                                                <span className="text-[10px] sm:text-xs font-semibold">Дар баррасӣ</span>
                                                            </div>
                                                        )
                                                    ) : trans.status === 'cancelled' ? (
                                                        <div className="group inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-300/50 dark:bg-red-950/20 border border-red-300/80 dark:border-red-900/20 transition-all ">
                                                            <div className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-red-400/30 dark:bg-red-800/50 group-hover:bg-red-500 transition-colors">
                                                                <Info className="w-3 h-3 text-red-700 cursor-pointer dark:text-red-200 group-hover:text-white" />
                                                            </div>
                                                            <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                                                                Рад шуд
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="group inline-flex items-center gap-2 px-2.5 py-1 cursor-pointer rounded-full bg-green-300/50 dark:bg-green-950/20 border border-green-300/80 dark:border-red-900/20 transition-all ">
                                                            <div className="flex items-center justify-center group-hover:bg-green-500 w-4.5 h-4.5 rounded-full bg-green-400/30 dark:bg-green-800/50 transition-colors">
                                                                <CircleCheckBig className="w-3 h-3 text-green-700 cursor-pointer dark:text-green-200 group-hover:text-white" />
                                                            </div>
                                                            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                                                Кабул Шуд
                                                            </span>
                                                        </div>
                                                    )}
                                                </span>
                                            ) : (
                                                <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full ${trans.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-600'
                                                    : 'bg-green-100 text-green-600'
                                                    }`}>
                                                    {trans.status === 'cancelled'
                                                        ? <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                        : <CircleCheckBig className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                    }
                                                    <span className="text-[10px] sm:text-xs font-semibold">
                                                        {trans.status === 'cancelled' ? 'Рад шуд' : 'Қабул шуд'}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 mt-4 border-t dark:border-gray-700 bg-gray-50/50 dark:bg-[#252525] rounded-b-xl">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        Нишон дода шудааст: <span className="font-bold text-gray-900 dark:text-gray-100">1-6</span> аз <span className="font-bold text-gray-900 dark:text-gray-100">12</span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            // onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                            // disabled={Page === 0}
                            className="px-4 py-2 text-sm font-medium border rounded-lg bg-white dark:bg-[#2d2d2d] dark:border-gray-600 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#3d3d3d] disabled:opacity-50 transition-all shadow-sm"
                        >
                            Пештара
                        </button>
                        <button
                            // onClick={() => setPage((prev) => prev + 1)}
                            // disabled={endItem >= totalItems}
                            className="px-4 py-2 text-sm font-medium border rounded-lg bg-white dark:bg-[#2d2d2d] dark:border-gray-600 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#3d3d3d] disabled:opacity-50 transition-all shadow-sm"
                        >
                            Баъдӣ
                        </button>
                    </div>
                </div>
            </section >
        </div >
    )
}