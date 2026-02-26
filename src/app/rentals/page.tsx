"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, User, Calendar, Check, ArrowLeftRight, Loader2, Search as Searchs, User as Userr, Check as Checks } from "lucide-react";
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
} from '@/src/api/api';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { toast } from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Card from '@/src/components/Card';
import { Sheet, SheetContent, SheetTitle, SheetHeader } from '@/components/ui/sheet';

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

    const [returnCondition, setReturnCondition] = useState("good");
    const [damageType, setDamageType] = useState("minor");
    const [damageDescription, setDamageDescription] = useState("");
    const [compensationAmount, setCompensationAmount] = useState(0);

    const { data: rentals, isLoading: rentalsLoading, refetch: refetchRentals } = useGetRentalsQuery({
        grade: grade ? Number(grade) : undefined,
        status_filter: (status === "all" || !status) ? undefined : status,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        limit: 50,
        skip: 0
    });

    const { data: studentsData } = useGetStudentsQuery({ search: searchTerm, skip: 0, limit: 20 });
    const { data: booksSchool } = useGetBooksSchoolQuery({
        skip: 0,
        limit: 20
    });
    const [rentBook, { isLoading: isRentLoading }] = useRentTextbookMutation();
    const [returnBook, { isLoading: isReturnLoading }] = useReturnBookMutation();
    const [addDamageReport] = useAddDamageReportMutation();
    const [createCompensation] = useCreateCompensationMutation();

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
                textbook_ids: selectedBookIds,
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
    const { data: activeYear } = useGetActiveYearQuery()
    const currentYearId = activeYear?.id

    const { data: items } = useGetReportsOverviewQuery(currentYearId, {
        skip: !currentYearId
    });

    console.log('alo', items);


    return (
        <div className="px-4 space-y-6 bg-[#f8fafc] dark:bg-black">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Иҷораи китобҳо</h1>
                    <p className="text-gray-500 text-sm dark:text-gray-400">Назорати китобҳои додашуда ва баргардонидашуда</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className='bg-[#0950c3] text-white py-2 px-3 rounded-sm hover:bg-[#0a45a5] transition-colors duration-200'>
                            + Иҷораи нав
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-125 bg-white dark:bg-[#1a1a1a] rounded-2xl border-0 shadow-xl">
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
                                                    <CommandItem key={student.id} onSelect={() => setSelectedStudentId(student.id)} className="py-3 px-4 cursor-pointer">
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
                                                {booksSchool?.items?.map((item) => {
                                                    const book = item.textbook;
                                                    const isSelected = selectedBookIds.includes(item.id);

                                                    // Ин сатр барои ҷустуҷӯ истифода мешавад
                                                    const searchLabel = `${book?.title} ${item.inventory_number}`.toLowerCase();

                                                    return (
                                                        <CommandItem
                                                            key={item.id}
                                                            value={searchLabel} // Акнун поиск ҳам ном ва ҳам рақамро мебинад
                                                            onSelect={() => toggleBookSelection(item.id)}
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

            <div className="flex flex-col gap-4 bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border shadow-sm">
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

                <div className="rounded-2xl overflow-hidden overflow-x-auto bg-white dark:bg-[#1a1a1a]">
                    <Table>
                        <TableHeader className="bg-gray-50/50 dark:bg-black">
                            <TableRow className="border-b">
                                <TableHead className="font-bold py-4 pl-4">Хонанда</TableHead>
                                <TableHead className="font-bold">Синфи</TableHead>
                                <TableHead className="font-bold">Китоб</TableHead>
                                <TableHead className="font-bold text-center">Статус</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rentalsLoading ? (
                                <TableRow><TableCell colSpan={4} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                            ) : rentals?.items?.map((rental: any) => (
                                <TableRow onClick={() => setSelectedStudent(rental)} key={rental.student_id} className="hover:bg-gray-50/50 hover:dark:bg-blue-500/50 transition-colors cursor-pointer">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#0950c3]"><User className="w-4 h-4" /></div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">{rental.student_name}</div>
                                                <div className="text-[10px] text-gray-400">ID: {rental.student_id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{rental.class_name}</TableCell>
                                    <TableCell>{rental.total_books_taken}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={rental.status === 'active' ? 'default' : 'secondary'} className={rental.status === 'active' ? "bg-green-100 text-green-700" : ""}>
                                            {rental.status === 'active' ? 'Дар даст' : 'Бозгашт'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Sheet open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
                <SheetContent className="sm:max-w-[550px] overflow-y-auto px-4">
                    <SheetHeader className="border-b pb-4">
                        <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                            <User className="w-6 h-6 text-blue-600" /> Маълумоти пурра
                        </SheetTitle>
                    </SheetHeader>

                    {selectedStudent && (
                        <div className="py-6 space-y-6">
                            <div className="flex items-center gap-4 bg-blue-50 dark:bg-[#1a1a1a] p-4 rounded-xl">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {selectedStudent.student_name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{selectedStudent.student_name}</h3>
                                    <p className="text-sm text-gray-500">Синфи: {selectedStudent.class_name}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold">Китобҳои фаъол</h4>
                                {selectedStudent.rented_books?.map((book: any, index: number) => (
                                    <div key={index} className="grid grid-cols-2 gap-4 border p-4 rounded-xl shadow-sm items-center relative overflow-hidden bg-white dark:bg-black mb-2">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-400 uppercase font-semibold">Номи китоб</p>
                                            <p className="text-sm font-bold text-gray-800">{book.textbook_title}</p>
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                                    book.status === 'active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                                )}>
                                                    {book.status === 'active' ? 'Дар даст' : 'Бозгашт'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="absolute right-2 top-10">
                                            {book.status === 'active' && (
                                                <Button size="sm" variant="ghost" className="h-8 text-blue-600" onClick={() => openReturnDialog(book)}>
                                                    <ArrowLeftRight className="w-4 h-4 mr-1" /> Гирифтан
                                                </Button>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-400 uppercase font-semibold">Рақами инвентарӣ</p>
                                            <p className="text-sm font-mono font-bold text-blue-600">{book.inventory_number}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            <Dialog open={isReturnModalOpen} onOpenChange={(val) => {
                setIsReturnModalOpen(val);
                if (!val) resetReturnForm();
            }}>
                <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden border-none shadow-lg">
                    {/* Сарлавҳа бо заминаи сабук */}
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-xl font-bold text-slate-800 tracking-tight">
                            Қабули китоб
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 pt-2">
                            Ҳолати китоби <span className="font-semibold text-slate-700 underline decoration-blue-200">
                                {selectedBookToReturn?.textbook_title}
                            </span>-ро ворид кунед.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6 space-y-6">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-slate-600 ml-1">Ҳолати умумӣ:</p>
                            <Select value={returnCondition} onValueChange={setReturnCondition}>
                                <SelectTrigger className="h-11 w-full border-slate-200 focus:ring-slate-400">
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

                        {/* Сексияи зарар бо дизайни тоза ва мулоим */}
                        {returnCondition === "damaged" && (
                            <div className="space-y-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Тафсилоти зарар</span>
                                </div>

                                <div className="grid gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-600 ml-1">Намуди зарар:</label>
                                        <Select value={damageType} onValueChange={setDamageType}>
                                            <SelectTrigger className="h-9 bg-white border-slate-200">
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
                                        <label className="text-xs font-medium text-slate-600 ml-1">Маблағи ҷарима (сомонӣ):</label>
                                        <Input
                                            type="number"
                                            className="h-9 bg-white border-slate-200 focus-visible:ring-slate-400"
                                            value={compensationAmount}
                                            onChange={(e) => setCompensationAmount(Number(e.target.value))}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-600 ml-1">Тавсиф:</label>
                                        <Input
                                            className="h-9 bg-white border-slate-200 focus-visible:ring-slate-400"
                                            placeholder="Сабаби зарарро шарҳ диҳед..."
                                            value={damageDescription}
                                            onChange={(e) => setDamageDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-6 pt-2 bg-slate-50/50 gap-2 sm:gap-0">
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