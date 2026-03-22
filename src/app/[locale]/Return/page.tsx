'use client'
import CardsStudent from '@/components/CardsStudent'
import { Button } from '@/components/ui/button'
import { TextAnimate } from '@/components/ui/text-animate'
import { Caravan, ArrowRightLeft, Clock, BadgeCheck, CircleCheckBig, XCircle, SearchAlert, BookOpen, FileText, Calendar, Info, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useGetReturnsSchoolByIdQuery, useGetReturnsSchoolQuery, useReturnsSchoolCancelMutation } from '@/api/api'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function Page() {
    const router = useRouter()
    const [selectedReturnId, setSelectedReturnId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const { data: infoTransfersById, isLoading: isLoadingInfo } = useGetReturnsSchoolByIdQuery(selectedReturnId as number, {
        skip: selectedReturnId === null,
    });
    const { data, isLoading: isLoadingReturn } = useGetReturnsSchoolQuery()
    const [transfersCancel] = useReturnsSchoolCancelMutation()

    const totalTransfers = data?.total || 0;
    const pendingCount = data?.items?.filter((item: { status: string }) => item.status === 'pending').length || 0;
    const completedCount = data?.items?.filter((item: { status: string }) => item.status === 'accepted' || item.status === 'completed').length || 0;
    const cancelledCount = data?.items?.filter((item: { status: string }) => item.status === 'cancelled').length || 0;

    const handleCancel = async (id: number) => {
        try {
            await transfersCancel({ return_id: id }).unwrap();
            toast.success("Интиқол бекор карда шуд");
        } catch {
            toast.error("Хатогӣ ҳангоми бекор кардан");
        }
    };

    const handleInfo = (id: number) => {
        setSelectedReturnId(id);
        setIsDialogOpen(true);
    }

    return (
        <div className='px-3 md:px-0'>
            <Toaster />

            <div className='flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0'>
                <div className='text-center md:text-left'>
                    <TextAnimate
                        className='text-xl md:text-2xl font-bold'
                        animation="slideUp"
                        by="word"
                    >
                        Баргардонидани китобҳо
                    </TextAnimate>
                    <p className='text-foreground text-xs sm:text-sm'>
                        Баргардонидани китобҳо ба мақомотҳои болоӣ
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/Return/Table')}
                    className='bg-blue-600 hover:bg-blue-700 text-white flex gap-2 py-2 sm:py-3 md:py-5 px-4 w-full md:w-auto rounded-lg sm:rounded-md'
                >
                    <Caravan className='w-5 h-5 sm:w-6 sm:h-6' />
                    Баргардонидан
                </Button>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-4 sm:my-5'>
                <CardsStudent
                    Icons={<ArrowRightLeft className="text-blue-500" />}
                    NameRole='Ҳамаи интиқолҳо'
                    cnt={totalTransfers}
                />
                <CardsStudent
                    Icons={<Clock className="text-yellow-500" />}
                    NameRole='Дар интизорӣ'
                    cnt={pendingCount}
                />
                <CardsStudent
                    Icons={<BadgeCheck className="text-green-500" />}
                    NameRole='Иҷрошуда'
                    cnt={completedCount}
                />
                <CardsStudent
                    Icons={<XCircle className="text-red-500" />}
                    NameRole='Рад Шуда'
                    cnt={cancelledCount}
                />
            </div>

            <section className='py-4 sm:py-5 px-3 sm:px-4 bg-white dark:bg-[#1f1f1f] rounded-xl border shadow-sm'>
                <h1 className='text-lg sm:text-xl font-bold'>
                    Рӯйхати баргардонидаҳо
                </h1>

                <div className="overflow-x-auto mt-3 sm:mt-4 border rounded-lg">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-[#2a2a2a] border-b">
                                <th className="p-3 sm:p-4 text-xs font-bold uppercase text-gray-500">ID</th>
                                <th className="p-3 sm:p-4 text-xs font-bold uppercase text-gray-500">Китоб (Инв. №)</th>
                                <th className="p-3 sm:p-4 text-xs font-bold uppercase text-gray-500 hidden sm:table-cell">Сабаб</th>
                                <th className="p-3 sm:p-4 text-xs font-bold uppercase text-gray-500">Сана</th>
                                <th className="p-3 sm:p-4 text-xs font-bold uppercase text-gray-500">Статус</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {isLoadingReturn ? (
                                <tr className="animate-pulse">
                                    <td colSpan={5} className="p-8 sm:p-10 text-center text-sm">Боргирӣ...</td>
                                </tr>
                            ) : data?.items?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 sm:p-10 text-center text-gray-400 text-sm">Рӯйхат холӣ аст</td>
                                </tr>
                            ) : (
                                data?.items?.map((item: any) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => handleInfo(item.id)}
                                        className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] cursor-pointer transition-colors"
                                    >
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm font-bold">#{item.id}</td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm">
                                            <div className="flex flex-col">
                                                <span className="font-medium truncate max-w-[150px] sm:max-w-none">
                                                    {item.items?.[0]?.textbook_title || `Китоби №${item.items?.[0]?.textbook_copy_id}`}
                                                </span>
                                                <span className="text-[9px] sm:text-[10px] text-blue-500 font-bold">
                                                    Инв: {item.items?.[0]?.inventory_number}
                                                    {item.items?.length > 1 && ` (+${item.items.length - 1} дигар)`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm italic hidden sm:table-cell">
                                            «{item.notes || item.reason}»
                                        </td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm whitespace-nowrap">
                                            {new Date(item.created_at).toLocaleDateString('tg-TJ')}
                                        </td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm" onClick={(e) => e.stopPropagation()}>
                                            {item.status === 'pending' ? (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full bg-yellow-100 border border-yellow-200 cursor-pointer">
                                                            <XIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-600 animate-pulse" />
                                                            <span className="text-[10px] sm:text-xs font-semibold text-yellow-600">Интизор</span>
                                                        </div>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Бекор кардани интиқол</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Оё шумо мутмаин ҳастед, ки интиқоли №{item.id}-ро бекор кардан мехоҳед?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Не</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleCancel(item.id)} className="bg-red-500 text-white">
                                                                Бале, бекор шавад
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            ) : (
                                                <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full ${item.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-600'
                                                    : 'bg-green-100 text-green-600'
                                                    }`}>
                                                    {item.status === 'cancelled'
                                                        ? <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                        : <CircleCheckBig className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                    }
                                                    <span className="text-[10px] sm:text-xs font-semibold">
                                                        {item.status === 'cancelled' ? 'Рад шуд' : 'Қабул шуд'}
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
            </section>

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) setSelectedReturnId(null);
            }}>
                <DialogContent className="max-w-[95%] sm:max-w-lg rounded-2xl overflow-hidden border-none p-0 bg-white dark:bg-[#1f1f1f]">
                    <DialogHeader className="p-6 bg-[#0950c3] text-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Info className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold">
                                    Маълумоти интиқол #{selectedReturnId}
                                </DialogTitle>
                                <DialogDescription className="text-blue-100 text-xs">
                                    {isLoadingInfo ? 'Дар ҳоли ҷустуҷӯ...' : 'Тафсилоти пурраи дархости баргардонидан'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-6">
                        {isLoadingInfo ? (
                            <div className="flex justify-center p-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : infoTransfersById ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#2a2a2a] border">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Статус</p>
                                        <div className="flex items-center gap-2">
                                            {infoTransfersById.status === 'pending' ? (
                                                <span className="flex items-center gap-1 text-yellow-600 font-bold text-sm">
                                                    <Clock className="w-4 h-4" /> Интизор
                                                </span>
                                            ) : infoTransfersById.status === 'cancelled' ? (
                                                <span className="flex items-center gap-1 text-red-600 font-bold text-sm">
                                                    <XCircle className="w-4 h-4" /> Рад шуд
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-green-600 font-bold text-sm">
                                                    <BadgeCheck className="w-4 h-4" /> Қабул шуд
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#2a2a2a] border">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Санаи дархост</p>
                                        <div className="flex items-center gap-2 text-sm font-semibold">
                                            <Calendar className="w-4 h-4 text-blue-500" />
                                            {new Date(infoTransfersById.created_at).toLocaleDateString('tg-TJ')}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5" /> Сабаби баргардонидан
                                    </h4>
                                    <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 text-sm italic text-gray-700 dark:text-gray-300">
                                        "{infoTransfersById.notes || infoTransfersById.reason || 'Сабаб қайд нашудааст'}"
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                        <BookOpen className="w-3.5 h-3.5" /> Рӯйхати китобҳо ({infoTransfersById.items?.length || 0})
                                    </h4>
                                    <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {infoTransfersById.items?.map((item: any) => (
                                            <div key={item.id || item.textbook_copy_id} className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-[#252525] hover:border-blue-300 transition-colors">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold">
                                                        {item.textbook_title || `Китоби №${item.textbook_copy_id}`}
                                                    </span>
                                                    <span className="text-[11px] text-blue-500 font-medium">
                                                        Инвентар: {item.inventory_number || '---'}
                                                    </span>
                                                </div>
                                                <div className="p-1.5 bg-gray-100 dark:bg-[#333] rounded-md">
                                                    <ArrowRightLeft className="w-3.5 h-3.5 text-gray-500" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <SearchAlert className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                Маълумот ёфт нашуд
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-4 bg-gray-100 dark:bg-[#2a2a2a] border-t">
                        <DialogClose asChild>
                            <Button variant="ghost" className="w-full sm:w-auto bg-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold">
                                Пӯшидан
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}