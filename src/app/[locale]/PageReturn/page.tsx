'use client'
import CardsStudent from '@/components/CardsStudent'
import { Button } from '@/components/ui/button'
import { TextAnimate } from '@/components/ui/text-animate'
import { Caravan, ArrowRightLeft, Clock, BadgeCheck, CircleCheckBig, XCircle, SearchAlert, BookOpen, FileText, Calendar, Info, XIcon, SearchAlertIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useGetReturnsSchoolByIdQuery, useGetReturnsQuery, useReturnsSchoolCancelMutation, useApproveReturnMutation, useGetMeQuery } from '@/api/api'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function Page() {
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const router = useRouter()
    const [selectedReturnId, setSelectedReturnId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const { data: DataMe, isLoading: isLoadingMe } = useGetMeQuery();
    const userRole = DataMe?.role;
    const { data: infoTransfersById, isLoading: isLoadingInfo } = useGetReturnsSchoolByIdQuery(selectedReturnId as number, {
        skip: selectedReturnId === null,
    });
    const { data, isLoading: isLoadingReturn } = useGetReturnsQuery({
        page: currentPage,
        limit: limit
    });
    const totalPages = data?.totalPages || 1;

    const [transfersCancel] = useReturnsSchoolCancelMutation()
    const [approveReturn] = useApproveReturnMutation();
    console.log(DataMe);

    const handleApprove = async (id: number) => {
        try {
            await approveReturn({ return_id: id }).unwrap();
            toast.success("Интиқол бо муваффақият қабул шуд");
            setIsDialogOpen(false);
        } catch {
            toast.error("Хатогӣ ҳангоми қабул кардан");
        }
    }


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
    }
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
                {userRole == "school" && (
                    <Button
                        onClick={() => router.push('/PageReturn/Return')}
                        className='bg-blue-600 hover:bg-blue-800 text-white cursor-pointer flex gap-2 py-2 sm:py-3 md:py-5 px-4 w-full md:w-auto rounded-lg sm:rounded-md'
                    >
                        <Caravan className='w-5 h-5 sm:w-6 sm:h-6' />
                        Баргардонидан
                    </Button>
                )}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-4 sm:my-5'>
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

                <div className="overflow-x-auto mt-3 sm:mt-4 border rounded-xl shadow-sm bg-white dark:bg-[#1a1a1a]">
                    <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-[#2a2a2a] border-b">
                                {/* <th className="p-3 sm:p-4 text-xs font-bold uppercase text-gray-500">ID</th> */}
                                <th className="p-3 sm:p-4 text-xs font-bold uppercase text-gray-500">Китоб, Синфи , (Инв. №)</th>
                                <th className="p-3 sm:p-4 text-xs font-bold uppercase text-gray-500">Равон кунанда</th>
                                <th className="p-3 sm:p-4 text-xs font-bold uppercase text-gray-500">Қабулкунанда</th>
                                <th className="p-3 sm:p-4 text-xs font-bold uppercase text-gray-500">Сана</th>
                                <th className="p-3 sm:p-4 text-xs font-bold uppercase text-gray-500 hidden sm:table-cell">Сабаб</th>
                                <th className="p-3 sm:p-4 text-xs font-bold uppercase text-gray-500">Статус</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {isLoadingReturn ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="p-3"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-25"></div></td>
                                        <td className="p-3"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-25"></div></td>
                                        <td className="p-3"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-25"></div></td>
                                        <td className="p-3"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-25"></div></td>
                                        <td className="p-3"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-25"></div></td>
                                        <td className="p-3"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-25"></div></td>
                                    </tr>
                                ))
                            ) : data?.items?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 sm:p-10 hover:bg-gray-50 duration-300 transition-colors">
                                        <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                            <SearchAlertIcon className="w-10 h-10 mb-2 opacity-50" />
                                            <span className="text-sm font-medium">Рӯйхат холӣ аст</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data?.items?.map((item: any) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => handleInfo(item.id)}
                                        className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] cursor-pointer transition-colors"
                                    >

                                        {/* <td className="p-3 sm:p-4 text-xs sm:text-sm font-bold">#{item.id}</td> */}
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm">
                                            <div className="flex flex-col gap-y-1">
                                                {item.items.length > 0 && (
                                                    <>
                                                        <div className={`flex flex-col pb-1 ${item.items.length > 1 ? 'border-b border-gray-200' : ''}`}>
                                                            <span className="font-medium text-gray-900">
                                                                {item.items[0].textbook_title} <span className="text-gray-500 font-normal">- Синфи {item.items[0].textbook_grade}</span>
                                                            </span>
                                                            <span className="text-[10px] text-blue-500 font-bold">
                                                                Инв: {item.items[0].inventory_number}
                                                            </span>
                                                        </div>

                                                        {item.items.length > 1 && (
                                                            <div className="flex flex-col pt-1">
                                                                {(() => {
                                                                    const differentBook = item.items.find(
                                                                        (book: any) => book.textbook_title !== item.items[0].textbook_title
                                                                    );
                                                                    const secondToShow = differentBook || item.items[1];

                                                                    return (
                                                                        <>
                                                                            <span className="font-medium text-gray-900">
                                                                                {secondToShow.textbook_title} <span className="text-gray-500 font-normal">- Синфи {secondToShow.textbook_grade}</span>
                                                                            </span>
                                                                            <span className="text-[10px] text-blue-500 font-bold">
                                                                                Инв: {secondToShow.inventory_number}
                                                                                {item.items.length > 2 && ` (+${item.items.length - 2} дигар)`}
                                                                            </span>
                                                                        </>
                                                                    );
                                                                })()}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3 font-sans sm:p-4  sm:text-sm whitespace-nowrap">
                                            {item.from_school_title}
                                        </td>
                                        <td className="p-3 font-sans sm:p-4  sm:text-sm whitespace-nowrap">
                                            Ба {item.to_entity_type == 'ministry' ? 'Маориф' : item.to_entity_type == 'district' ? 'Ноҳия' : item.to_entity_type == 'region' ? 'Вилоят' : item.to_entity_type}
                                        </td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm whitespace-nowrap">
                                            {new Date(item.created_at).toLocaleDateString('tg-TJ')}
                                        </td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm italic hidden sm:table-cell">
                                            «{item.notes
                                                ? (item.notes.length > 20 ? item.notes.slice(0, 20) + "..." : item.notes)
                                                : (item.reason || "Сабаб зикр нашудааст")}»
                                        </td>

                                        <td className="p-3 sm:p-4 text-xs sm:text-sm" onClick={(e) => e.stopPropagation()}>
                                            {item.status === 'pending' ? (
                                                userRole === item.to_entity_type ? (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full bg-yellow-100 border border-yellow-200 cursor-pointer">
                                                                <div className='hover:bg-yellow-200 rounded-full w-5 h-5 p-1 duration-200 transition-colors hover:animate-pulse'>
                                                                    <XIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-600 " />
                                                                </div>
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
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100">
                                                        <Clock className="w-2.5 h-2.5" />
                                                        <span className="text-[10px] sm:text-xs font-semibold">Дар баррасӣ</span>
                                                    </div>
                                                )
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
                <div className='my-6 border-t pt-4'>
                    <Pagination>
                        <PaginationContent className="cursor-pointer">
                            <PaginationPrevious
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
                            />

                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                if (pageNumber <= 3 || pageNumber === totalPages) {
                                    return (
                                        <PaginationLink
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            isActive={currentPage === pageNumber}
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    );
                                }
                                if (pageNumber === 4) return <PaginationEllipsis key="ellipsis" />;
                                return null;
                            })}

                            <PaginationNext
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationContent>
                    </Pagination>

                    <p className="text-center text-xs text-gray-500 mt-2">
                        Саҳифаи {currentPage} аз {totalPages}
                    </p>
                </div>
            </section >

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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#2a2a2a] border">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Равон Кунанда</p>
                                        <div className="flex items-center gap-2">
                                            {infoTransfersById?.from_school_title}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#2a2a2a] border">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Кабул Кунанда</p>
                                        <div className="flex items-center gap-2 text-sm font-semibold">
                                            Ба {infoTransfersById?.to_entity_type == 'ministry' ? 'Маориф' : infoTransfersById?.to_entity_type == 'district' ? 'Ноҳия' : infoTransfersById?.to_entity_type == 'region' ? 'Вилоят' : infoTransfersById?.to_entity_type}
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

                    <DialogFooter className="p-4 bg-gray-100 dark:bg-[#2a2a2a] border-t gap-2">
                        {infoTransfersById?.status === 'pending' &&
                            userRole === infoTransfersById.to_entity_type && (
                                <Button
                                    onClick={() => handleApprove(infoTransfersById.id)}
                                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold"
                                >
                                    <BadgeCheck className="w-4 h-4 mr-2" />
                                    Қабул кардан
                                </Button>
                            )}
                        {infoTransfersById?.status === 'pending' && (
                            <DialogClose asChild>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto font-semibold border-red-500 duration-300 cursor-pointer text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            Бекор кардани интиқол
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Бекор кардани интиқол</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Оё шумо мутмаин ҳастед, ки интиқоли №{infoTransfersById?.id}-ро бекор кардан мехоҳед?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Не</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleCancel(infoTransfersById?.id)}
                                                className="bg-red-500 text-white">
                                                Бале, бекор шавад
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DialogClose>
                        )}

                        <DialogClose asChild>
                            <Button variant="default" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 font-semibold">
                                Пӯшидан
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}