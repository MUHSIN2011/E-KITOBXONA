"use client";

import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, User, Calendar, Check, ArrowLeftRight, Loader2, Search as Searchs, User as Userr, Check as Checks, Sparkles, Bot, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useGetRentalsQuery,
    useGetStudentsQuery,
    useGetTextbooksQuery,
    useRentTextbookMutation,
    useReturnBookMutation,
    useAddDamageReportMutation,
    useCreateCompensationMutation,
    useGetReportsOverviewQuery,
    useGetActiveYearQuery,
    useGetBooksSchoolQuery,
    useEstimateCompensationMutation,
} from '@/api/api';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { toast, Toaster } from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Card from '@/components/Card';
import { Sheet, SheetContent, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import ReactMarkdown from 'react-markdown';

export default function RentalsPage() {
    const [open, setOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [selectedBookToReturn, setSelectedBookToReturn] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [selectedBookIds, setSelectedBookIds] = useState<number[]>([]);
    const [grade, setGrade] = useState<string>("");
    const [status, setStatus] = useState<string | null>(null);
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [description, setdescription] = useState("");
    const amountInputRef = useRef<HTMLInputElement>(null);
    const [isAdviceOpen, setIsAdviceOpen] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    const [returnCondition, setReturnCondition] = useState("good");
    const [compensationAmount, setCompensationAmount] = useState(0);

    const { data: rentals, isLoading: rentalsLoading, refetch: refetchRentals, isError: rentalsError } = useGetRentalsQuery({
        grade: grade ? Number(grade) : undefined,
        status_filter: (status === "all" || !status) ? undefined : status,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        limit: 50,
        skip: 0
    });

    const [damageType, setDamageType] = useState("minor");
    const [damageDescription, setDamageDescription] = useState("");
    const [aiAdvice, setAiAdvice] = useState<any>(null);


    const [estimateCompensation, { data: aiResult, isLoading: isAiLoading }] = useEstimateCompensationMutation();

    const { data: studentsData } = useGetStudentsQuery({ search: searchTerm, skip: 0, limit: 20 });
    const { data: booksSchool } = useGetBooksSchoolQuery();

    const [rentBook, { isLoading: isRentLoading }] = useRentTextbookMutation();
    const [returnBook, { isLoading: isReturnLoading }] = useReturnBookMutation();
    const [addDamageReport] = useAddDamageReportMutation();
    const [createCompensation] = useCreateCompensationMutation();
    const { data: activeYear } = useGetActiveYearQuery()
    const currentYearId = activeYear?.id

    const { data: items } = useGetReportsOverviewQuery(currentYearId, {
        skip: !currentYearId
    });

    const resetReturnForm = () => {
        setReturnCondition("good");
        setDamageType("minor");
        setDamageDescription("");
        setCompensationAmount(0);
        setSelectedBookToReturn(null);
    };

    const handleRent = async () => {
        if (!selectedStudentId || selectedBookIds.length === 0) {
            toast.error("Лутфан хонанда ва китобро интихоб кунед!");
            return;
        }
        try {
            await rentBook({
                student_id: selectedStudentId,
                copy_ids: selectedBookIds,
                notes: "Иҷораи нав"
            }).unwrap();
            setOpen(false);
            setSelectedBookIds([]);
            setSelectedStudentId(null);
            toast.success("Китоб бо муваффақият дода шуд!");
            refetchRentals();
        } catch (error: any) {
            toast.error(error.data?.detail || "Хатогӣ ҳангоми додани китоб");
        }
    };

    const handleConfirmReturn = async () => {
        if (!selectedBookToReturn) return;

        try {
            await returnBook({
                rental_id: selectedBookToReturn.rental_id,
                new_condition: returnCondition,
                notes: damageDescription || "Баргардонида шуд"
            }).unwrap();

            if (returnCondition === "damaged") {
                toast.loading("Сабти зарар...");

                const damageRes = await addDamageReport({
                    rental_id: selectedBookToReturn.rental_id,
                    damage_type: damageType,
                    description: damageDescription,
                    compensation_amount: Number(compensationAmount)
                }).unwrap();

                if (compensationAmount > 0) {
                    await createCompensation({
                        damage_report_id: damageRes.id,
                        amount_due: Number(compensationAmount),
                        due_date: new Date().toISOString().split('T')[0]
                    }).unwrap();
                }

                toast.dismiss();
                toast.success("Зарар ва ҷарима сабт шуд!");
            } else {
                toast.success("Китоб қабул шуд!");
            }

            setIsReturnModalOpen(false);
            refetchRentals();
            resetReturnForm();
        } catch (error: any) {
            console.log("Full API Error Details:", JSON.stringify(error, null, 2));

            toast.dismiss();

            const errorMessage =
                error.data?.detail?.[0]?.msg ||
                error.data?.detail ||
                error.message ||
                "Хатогӣ дар система";

            toast.error(errorMessage);
        }
    };

    const toggleBookSelection = (id: number) => {
        setSelectedBookIds(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const openReturnDialog = (book: any) => {
        setSelectedBookToReturn(book);
        setIsReturnModalOpen(true);
    };

    const extractAmountFromText = (text: string) => {
        const amountMatch = [...text.matchAll(/(?:сумма компенсации|Сумма компенсации|компенсация):?\s*([0-9]+(?:\.[0-9]+)?)/gi)];
        if (amountMatch.length > 0) {
            return Number(amountMatch[amountMatch.length - 1][1]);
        }

        const fallbackMatch = text.match(/([0-9]+(?:\.[0-9]+)?)/g);
        return fallbackMatch ? Number(fallbackMatch[fallbackMatch.length - 1]) : 0;
    };

    const handleAiConsult = async () => {
        if (!damageDescription) {
            toast.error("Лутфан, аввал сабаби зарарро нависед");
            return;
        }

        try {
            const result = await estimateCompensation({
                textbook_data: {
                    title: selectedBookToReturn?.textbook_title || "Китоб",
                    print_price: 50
                },
                copy_data: { inventory_number: "INV-001", years_in_use: 1 },
                damage_type: damageType,
                description: damageDescription
            }).unwrap();

            setAiAdvice(result);
        } catch (error) {
            toast.error("Хатогӣ ҳангоми пайваст бо AI");
        }
    };

    const handleUseAdvice = () => {
        const amount = extractAmountFromText(aiAdvice.answer);
        if (amount > 0) {
            setCompensationAmount(amount);
            setIsAdviceOpen(false);

            setTimeout(() => {
                amountInputRef.current?.focus();
            }, 100);
        } else {
            toast.error("Маблағ ёфт нашуд");
        }
    };


    const availableBooks = booksSchool?.items?.filter(book =>
        book.status !== "rented" && book.status !== "lost"
    );


    return (
        <div className="px-4 space-y-6 bg-[#f8fafc] dark:bg-gray-900">
            <Toaster />
            <div className="flex md:flex-row flex-col justify-between md:gap-0 gap-3 md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Иҷораи китобҳо</h1>
                    <p className="text-gray-500 text-sm dark:text-gray-400">Назорати китобҳои додашуда ва баргардонидашуда</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className='bg-[#0950c3] text-white  py-2 px-3 rounded-sm hover:bg-[#0a45a5] transition-colors duration-200'>
                            + Иҷораи нав
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-125 bg-white dark:bg-gray-900 rounded-2xl border-0 shadow-xl">
                        <DialogHeader className="space-y-3">
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Додани китоби нав</DialogTitle>
                            <DialogDescription>Маълумоти хонанда ва китобро интихоб кунед.</DialogDescription>
                            <div className="h-1 w-20 bg-[#0950c3] rounded-full"></div>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1">
                                    <Userr className="h-4 w-4 text-[#0950c3]" /> Хонанда:
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-between w-full border-gray-300 rounded-xl">
                                            {selectedStudentId
                                                ? (studentsData?.items?.find(s => s.id === selectedStudentId)?.first_name || "Интихоб...") + " " + (studentsData?.items?.find(s => s.id === selectedStudentId)?.last_name || "")
                                                : "Ҷустуҷӯи хонанда..."}
                                            <Searchs className="ml-2 h-4 w-4 text-gray-400" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[450px] p-0 rounded-xl shadow-lg" align="start">
                                        <Command>
                                            <CommandInput placeholder="Номи хонанда..." onValueChange={setSearchTerm} />
                                            <CommandEmpty>Хонанда ёфт нашуд.</CommandEmpty>
                                            <CommandGroup className="max-h-60 overflow-y-auto">
                                                {studentsData?.items?.map((student) => (
                                                    <CommandItem onWheel={(e) => e.stopPropagation()} key={student.id} onSelect={() => setSelectedStudentId(student.id)} className="py-3 px-4 cursor-pointer">
                                                        <Checks className={cn("mr-2 h-4 w-4 text-[#0950c3]", selectedStudentId === student.id ? "opacity-100" : "opacity-0")} />
                                                        <div>
                                                            <div className="font-medium">{student.first_name} {student.last_name}</div>
                                                            <div className="text-xs text-gray-500">{student.class_name}</div>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1">
                                    <BookOpen className="h-4 w-4 text-[#0950c3]" /> Китобҳо:
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-between w-full border-gray-300 rounded-xl">
                                            {selectedBookIds.length > 0 ? `${selectedBookIds.length} китоб интихоб шуд` : "Интихоби китобҳои дастрас..."}
                                            <Searchs className="ml-2 h-4 w-4 text-gray-400" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[450px] p-0 shadow-lg border-none rounded-2xl" align="start">
                                        <Command>
                                            <CommandInput placeholder="Ҷустуҷӯи китоб ё рақами инвентарӣ..." />
                                            <CommandGroup className="max-h-60 overflow-y-auto p-2">
                                                {availableBooks?.map((item) => {
                                                    const book = item.textbook;
                                                    const isSelected = selectedBookIds.includes(item.id);

                                                    const searchLabel = `${book?.title} ${item.inventory_number}`.toLowerCase();

                                                    return (
                                                        <CommandItem
                                                            key={item.id}
                                                            value={searchLabel}
                                                            onSelect={() => toggleBookSelection(item.id)}
                                                            onWheel={(e) => e.stopPropagation()}
                                                            className={cn(
                                                                "flex items-center justify-between p-3 rounded-xl cursor-pointer mb-1",
                                                                isSelected ? "bg-blue-50" : ""
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={cn(
                                                                    "w-5 h-5 border rounded flex items-center justify-center transition-all",
                                                                    isSelected ? "bg-[#0950c3] border-[#0950c3]" : "border-gray-300"
                                                                )}>
                                                                    {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                                        {book?.title || "Номи китоб нест"}
                                                                    </span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[11px] text-gray-500">
                                                                            Муаллиф: {book?.author}
                                                                        </span>
                                                                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 rounded">
                                                                            №{item.inventory_number}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-1">
                                                                <Badge variant="outline" className="text-[10px]">
                                                                    Синфи {book?.grade}
                                                                </Badge>
                                                            </div>
                                                        </CommandItem>
                                                    );
                                                })}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <DialogFooter className="gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl flex-1">Бекор кардан</Button>
                            <Button onClick={handleRent} disabled={isRentLoading} className="bg-[#0950c3] dark:hover:bg-[#0950c3b0] hover:bg-[#0950c3b0] text-white rounded-xl flex-1">
                                {isRentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Тасдиқ кардан"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='grid md:grid-cols-3 grid-cols-1 gap-3 my-7'>
                <div><Card NameRole={'Дар склад'} textColor='green-600' cnt={items?.total_books?.toString() || '0'} /></div>
                <div><Card NameRole={'Дар Ичора'} textColor='yellow-500' cnt={items?.rented_books?.toString() || '0'} /></div>
                <div><Card NameRole={'Гумшуда'} textColor='red-600' cnt={items?.lost_books?.toString() || '0'} /></div>
            </div>

            <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border shadow-sm">
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2'>
                    <div className="relative md:col-span-2 col-span-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Ҷустуҷӯ..." className="pl-10 bg-[#f9fafb] border-none rounded-xl h-11" />
                    </div>

                    <Select onValueChange={(value) => setGrade(value)}>
                        <SelectTrigger className="md:col-span-1 py-5 w-full rounded-xl bg-[#f9fafb] border-none">
                            <SelectValue placeholder="Синф" />
                        </SelectTrigger>
                        <SelectContent>
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'].map(g => (
                                <SelectItem key={g} value={g}>{g}-ум</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => setStatus(value)}>
                        <SelectTrigger className="md:col-span-1 py-5 w-full rounded-xl bg-[#f9fafb] border-none h-15">
                            <SelectValue placeholder="Статус" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Ҳама</SelectItem>
                            <SelectItem value="active">Дар ичора</SelectItem>
                            <SelectItem value="returned">Дар склад</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-xl bg-[#f9fafb] border-none h-11" />
                    <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-xl bg-[#f9fafb] border-none h-11" />
                </div>

                <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[500px] sm:min-w-full">
                            <TableHeader className="bg-gray-50/50 dark:bg-gray-900">
                                <TableRow className="border-b dark:border-gray-700">
                                    <TableHead className="font-bold py-3 sm:py-4 pl-3 sm:pl-4 text-xs sm:text-sm">
                                        Хонанда
                                    </TableHead>
                                    <TableHead className="font-bold text-xs sm:text-sm">
                                        Синф
                                    </TableHead>
                                    <TableHead className="font-bold text-xs sm:text-sm">
                                        Китоб
                                    </TableHead>
                                    <TableHead className="font-bold text-center text-xs sm:text-sm">
                                        Статус
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rentalsLoading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index} className="animate-pulse">
                                            <TableCell className="py-2 sm:py-3 pl-3 sm:pl-4">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                                    <div className="space-y-1">
                                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 sm:w-32"></div>
                                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 sm:w-20"></div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-2 sm:py-3">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 sm:w-16"></div>
                                            </TableCell>
                                            <TableCell className="py-2 sm:py-3">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 sm:w-16"></div>
                                            </TableCell>
                                            <TableCell className="py-2 sm:py-3">
                                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 sm:w-20 mx-auto"></div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : rentals?.items?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 sm:py-10 md:py-12">
                                            <div className="flex flex-col items-center justify-center">
                                                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mb-2" />
                                                <p className="text-sm text-gray-400 dark:text-gray-500">Ҳеҷ маълумоте нест</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : rentalsError ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 sm:py-10 md:py-12 hover:dark:bg-blue-500/10 duration-200 transition-colors">
                                            <div className="flex flex-col items-center justify-center">
                                                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mb-2" />
                                                <p className="text-sm text-gray-400 dark:text-gray-500">Ҳеҷ маълумоте нест</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rentals?.items?.map((rental: any) => (
                                        <TableRow
                                            key={rental.student_id}
                                            onClick={() => setSelectedStudent(rental)}
                                            className="hover:bg-gray-50/50 hover:dark:bg-blue-500/10 transition-colors cursor-pointer group"
                                        >

                                            <TableCell className="py-2 sm:py-3 pl-3 sm:pl-4">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[180px] md:max-w-[200px]">
                                                            {rental.student_name}
                                                        </div>
                                                        <div className="text-[9px] sm:text-[10px] text-gray-400">
                                                            ID: {rental.student_id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                                {rental.class_name}
                                            </TableCell>

                                            <TableCell className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                {rental.total_books_taken}
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={rental.status === 'active' ? 'default' : 'secondary'}
                                                    className={cn(
                                                        "text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full",
                                                        rental.status === 'active'
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                                    )}
                                                >
                                                    {rental.status === 'active' ? 'Дар даст' : 'Бозгашт'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <Sheet open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
                <SheetContent className="sm:max-w-[550px] w-full dark:bg-gray-900 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                    <SheetHeader className="border-b pb-3 sm:pb-4 mb-3 sm:mb-4">
                        <SheetTitle className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            Маълумоти пурра
                        </SheetTitle>
                    </SheetHeader>

                    {selectedStudent && (
                        <div className="space-y-4 sm:space-y-5 md:space-y-6">
                            {/* Student Info Card */}
                            <div className="flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/50 p-3 sm:p-4 rounded-xl">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md">
                                    {selectedStudent.student_name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white truncate">
                                        {selectedStudent.student_name}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                            Синфи: {selectedStudent.class_name}
                                        </p>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></span>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                            ID: {selectedStudent.student_id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {[
                                    { key: 'all', label: 'Ҳама', count: selectedStudent.rented_books?.length },
                                    { key: 'active', label: 'Дар даст', count: selectedStudent.rented_books?.filter((b: any) => b.status === 'active').length },
                                    { key: 'returned', label: 'Бозгашт', count: selectedStudent.rented_books?.filter((b: any) => b.status === 'returned').length },
                                    { key: 'damaged', label: 'Ваҳшуда', count: selectedStudent.rented_books?.filter((b: any) => b.status === 'damaged').length },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setStatusFilter(tab.key)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                                            statusFilter === tab.key
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        {tab.label} ({tab.count})
                                    </button>
                                ))}
                            </div>

                            {/* Books List */}
                            <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1">
                                {selectedStudent.rented_books
                                    ?.filter((book: any) => statusFilter === 'all' || book.status === statusFilter)
                                    .length === 0 ? (
                                    <div className="text-center py-8 sm:py-10">
                                        <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-400 dark:text-gray-500">Китобҳо бо ин статус ёфт нашуд</p>
                                    </div>
                                ) : (
                                    selectedStudent.rented_books
                                        ?.filter((book: any) => statusFilter === 'all' || book.status === statusFilter)
                                        .map((book: any, index: number) => {
                                            const statusConfig = {
                                                active: {
                                                    label: 'Дар даст',
                                                    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                                                    borderColor: 'from-green-500 to-emerald-600'
                                                },
                                                returned: {
                                                    label: 'Бозгашт',
                                                    color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
                                                    borderColor: 'from-gray-400 to-gray-500'
                                                },
                                                damaged: {
                                                    label: 'Ваҳшуда',
                                                    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                                                    borderColor: 'from-red-500 to-rose-600'
                                                }
                                            };

                                            const config = statusConfig[book.status as keyof typeof statusConfig] || statusConfig.active;

                                            return (
                                                <div
                                                    key={book.rental_id || index}
                                                    className="relative border rounded-xl shadow-sm overflow-hidden bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                                                >
                                                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${config.borderColor}`}></div>

                                                    <div className="p-3 sm:p-4">
                                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold tracking-wider">
                                                                    Номи китоб
                                                                </p>
                                                                <p className="text-sm sm:text-base font-bold text-gray-800 dark:text-white line-clamp-2">
                                                                    {book.textbook_title}
                                                                </p>
                                                            </div>
                                                            <span className={cn(
                                                                "px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase whitespace-nowrap self-start",
                                                                config.color
                                                            )}>
                                                                {config.label}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                                            <div>
                                                                <p className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold tracking-wider">
                                                                    Рақами инвентарӣ
                                                                </p>
                                                                <p className="text-xs sm:text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
                                                                    {book.inventory_number || '—'}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold tracking-wider">
                                                                    Санаи гирифтан
                                                                </p>
                                                                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                                                    {book.rent_start ? new Date(book.rent_start).toLocaleDateString('tg-TJ') : '—'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {book.status === 'active' && (
                                                            <div className="mt-3 pt-2 flex justify-end">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-8 sm:h-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-xs sm:text-sm"
                                                                    onClick={() => openReturnDialog(book)}
                                                                >
                                                                    <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                                                                    Гирифтан
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                )}
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            <Dialog open={isReturnModalOpen} onOpenChange={(val) => {
                setIsReturnModalOpen(val);
                if (!val) resetReturnForm();
            }}>
                <DialogContent className="sm:max-w-[460px]  dark:bg-gray-900 p-0 border-none shadow-lg max-h-[90vh] flex flex-col overflow-hidden">
                    <DialogHeader className="p-6 pb-4 flex-shrink-0 border-b border-slate-50 dark:border-gray-700">
                        <DialogTitle className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                            Қабули китоб
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-gray-100 pt-1">
                            Ҳолати китоби <span className="font-semibold text-slate-700 dark:text-gray-50 underline decoration-blue-200">
                                {selectedBookToReturn?.textbook_title}
                            </span>-ро ворид кунед.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6 space-y-6 overflow-y-auto flex-1  custom-scrollbar">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-slate-600 ml-1 dark:text-white">Ҳолати умумӣ:</p>
                            <Select value={returnCondition} onValueChange={setReturnCondition}>
                                <SelectTrigger className="h-11 w-full border-slate-200 focus:ring-slate-400  dark:border-gray-700">
                                    <SelectValue placeholder="Интихоб кунед" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="good">✨ Хуб (Good)</SelectItem>
                                    <SelectItem value="fair">👍 Миёна (Fair)</SelectItem>
                                    <SelectItem value="poor">⚠️ Заиф (Poor)</SelectItem>
                                    <SelectItem value="damaged">❌ Вайрон (Damaged)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {returnCondition === "damaged" && (
                            <div className="space-y-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-gray-800 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white">Тафсилоти зарар</span>
                                </div>

                                <div className="grid gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-600 ml-1 dark:text-gray-200">Намуди зарар:</label>
                                        <Select value={damageType} onValueChange={setDamageType}>
                                            <SelectTrigger className="h-9 bg-white border-slate-200 dark:border-gray-700">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="minor">Кам (Minor)</SelectItem>
                                                <SelectItem value="moderate">Миёна (Moderate)</SelectItem>
                                                <SelectItem value="severe">Ҷиддӣ (Severe)</SelectItem>
                                                <SelectItem value="total_loss">Корношоям (Total loss)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-600 ml-1  dark:text-gray-200">Маблағи ҷарима (сомонӣ):</label>
                                        <Input
                                            type="number"
                                            ref={amountInputRef}
                                            className="h-9 bg-white border-slate-200  dark:border-gray-700 focus-visible:ring-slate-400"
                                            value={compensationAmount}
                                            onChange={(e) => setCompensationAmount(Number(e.target.value))}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-600 ml-1  dark:text-gray-200">Тавсиф:</label>
                                        <Input
                                            className="h-9 bg-white border-slate-200  dark:border-gray-700 focus-visible:ring-slate-400"
                                            placeholder="Сабаби зарарро шарҳ диҳед..."
                                            value={damageDescription}
                                            onChange={(e) => setDamageDescription(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-gray-700">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleAiConsult}
                                            disabled={isAiLoading}
                                            className="w-full border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 gap-2 h-10 shadow-sm transition-all"
                                        >
                                            {isAiLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Sparkles className="h-4 w-4" />
                                            )}
                                            AI Help
                                        </Button>

                                        {aiAdvice && (
                                            <div className="mt-3 overflow-hidden rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-zinc-950 transition-all duration-300">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAdviceOpen(!isAdviceOpen)}
                                                    className="w-full flex items-center justify-between p-2.5 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-100/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1 bg-blue-600 rounded shadow-lg shadow-blue-500/20">
                                                            <Bot size={14} className="text-white" />
                                                        </div>
                                                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                                                            Машварати AI {!isAdviceOpen && "(Пинҳон)"}
                                                        </span>
                                                    </div>
                                                    {isAdviceOpen ? (
                                                        <ChevronUp size={16} className="text-blue-400" />
                                                    ) : (
                                                        <ChevronDown size={16} className="text-blue-400" />
                                                    )}
                                                </button>

                                                <div
                                                    className={`transition-all duration-500 ease-in-out overflow-hidden ${isAdviceOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                                                        }`}
                                                >
                                                    <div className="p-4 pt-2">
                                                        <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                                                            <ReactMarkdown
                                                                components={{
                                                                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1 text-slate-700 dark:text-zinc-300">{children}</ol>,
                                                                    li: ({ children }) => <li className="text-[13px] leading-relaxed">{children}</li>,
                                                                    p: ({ children }) => <p className="text-[13px] leading-snug mb-2 last:mb-0 text-slate-700 dark:text-zinc-300">{children}</p>
                                                                }}
                                                            >
                                                                {aiAdvice.answer.replace(/\\n/g, '\n').replace(/^(\d+)\.(?!\s)/gm, '$1. ')}
                                                            </ReactMarkdown>
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            onClick={handleUseAdvice}
                                                            className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold gap-2 shadow-sm transition-all active:scale-[0.98]"
                                                        >
                                                            <Check size={14} />
                                                            Истифода бурдани машварат
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-6 pt-4 bg-slate-50/80 dark:bg-gray-900 border-t border-slate-100 dark:border-gray-700/50 gap-2 sm:gap-0 shrink-0">
                        <Button
                            variant="ghost"
                            onClick={() => setIsReturnModalOpen(false)}
                            className="text-slate-500 hover:bg-slate-200"
                        >
                            Бекор кардан
                        </Button>
                        <Button
                            onClick={handleConfirmReturn}
                            disabled={isReturnLoading}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-6 shadow-md transition-all active:scale-95"
                        >
                            {isReturnLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                            Тасдиқ ва қабул
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}