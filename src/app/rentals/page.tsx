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
    useReturnBookMutation
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

    // API Hooks
    const { data: rentals, isLoading: rentalsLoading, refetch: refetchRentals } = useGetRentalsQuery({
        grade: grade ? Number(grade) : undefined,
        status_filter: (status === "all" || !status) ? undefined : status,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        limit: 50,
        skip: 0
    });

    const { data: studentsData } = useGetStudentsQuery({ search: searchTerm, skip: 0, limit: 20 });
    const { data: booksData } = useGetTextbooksQuery(undefined);
    const [rentBook, { isLoading: isRentLoading }] = useRentTextbookMutation();

    const [returnBook, { isLoading: isReturnLoading }] = useReturnBookMutation();

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

    const toggleBookSelection = (id: number) => {
        setSelectedBookIds(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const handleConfirmReturn = async () => {
        if (!selectedBookToReturn) return;
        try {
            await returnBook(selectedBookToReturn.rental_id).unwrap();
            toast.success("Китоб қабул карда шуд!");
            setIsReturnModalOpen(false);
            refetchRentals();
            setSelectedStudent(null);
        } catch (error) {
            toast.error("Хатогӣ ҳангоми қабули китоб");
        }
    };

    const openReturnDialog = (book: any) => {
        setSelectedBookToReturn(book);
        setIsReturnModalOpen(true);
    };

    const statusBooksCount = rentals?.items?.reduce((acc, student) => {
        const activeInStudent = student.rented_books?.filter(b => b.status === 'active').length || 0;
        return acc + activeInStudent;
    }, 0) || 0;

    const statusReturnBooksCount = rentals?.items?.reduce((acc, student) => {
        const returnedInStudent = student.rented_books?.filter(b => b.status === 'returned').length || 0;
        return acc + returnedInStudent;
    }, 0) || 0;

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
                                <label className="text-sm font-medium text-gray-700  dark:text-gray-200 flex items-center gap-1">
                                    <Userr className="h-4 w-4 text-[#0950c3] " /> Хонанда:
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
                                <label className="text-sm font-medium text-gray-700  dark:text-gray-200 flex items-center gap-1">
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
                                            <CommandInput placeholder="Ҷустуҷӯи китоб..." />
                                            <CommandGroup className="max-h-60 overflow-y-auto p-2">
                                                {booksData?.items?.map((book) => {
                                                    const isSelected = selectedBookIds.includes(book.id);
                                                    return (
                                                        <CommandItem key={book.id} onSelect={() => toggleBookSelection(book.id)} className={cn("flex items-center justify-between p-3 rounded-xl cursor-pointer mb-1", isSelected ? "bg-blue-50" : "")}>
                                                            <div className="flex items-center gap-3">
                                                                <div className={cn("w-5 h-5 border rounded flex items-center justify-center transition-all", isSelected ? "bg-[#0950c3] border-[#0950c3]" : "border-gray-300")}>
                                                                    {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold text-gray-900 dark:text-white">{book.title}</span>
                                                                    <span className="text-[11px] text-gray-500 dark:text-gray-300">Муаллиф: {book.author} | Дастрас: {book.available_copies}</span>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline" className="text-[10px]">Синфи {book.grade}</Badge>
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
                            <Button onClick={handleRent} disabled={isRentLoading} className="bg-[#0950c3] dark:hover:bg-[#0950c3b0] text-white rounded-xl flex-1">
                                {isRentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Тасдиқ кардан"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='grid md:grid-cols-3 grid-cols-1 gap-3 my-7'>
                <div><Card NameRole={'Иҷораҳои фаъол'} textColor='green-600' cnt={statusBooksCount.toString()} /></div>
                <div><Card NameRole={'Вайроншуда'} textColor='red-600' cnt={'0'} /></div>
                <div><Card NameRole={'Баргардонидашуда'}  textColor='yellow-500' cnt={statusReturnBooksCount.toString()} /></div>
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
                            <SelectItem value="active">Дар даст</SelectItem>
                            <SelectItem value="returned">Баргардонидашуда</SelectItem>
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
                                <TableRow><TableCell colSpan={3} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                            ) : rentals?.items?.map((rental: any) => (
                                <TableRow onClick={() => setSelectedStudent(rental)} key={rental.id} className="hover:bg-gray-50/50 hover:dark:bg-blue-500/50 transition-colors cursor-pointer">
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
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold">Китобҳои фаъол</h4>
                                    <Button size="sm" variant="outline" className="text-red-600" >Ҳамаро гирифтан</Button>
                                </div>
                                {selectedStudent.rented_books?.map((book: any, index: number) => (
                                    <div key={index} className="grid grid-cols-2 gap-4 border p-4 rounded-xl shadow-sm items-center  relative overflow-hidden bg-white dark:bg-black mb-2">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-400 uppercase font-semibold">Номи китоб</p>
                                            <p className="text-sm font-bold text-gray-800">{book.textbook_title}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-gray-400 uppercase font-semibold">Ҳолат:</p>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                    book.status === 'active'
                                                        ? "bg-green-100 text-green-700 border border-green-200"
                                                        : "bg-gray-100 text-gray-600 border border-gray-200"
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

            {/* Мадалкаи қабули китоб */}
            <Dialog open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Тасдиқи қабул</DialogTitle>
                        <DialogDescription>
                            Оё шумо мутмаин ҳастед, ки китоби <b>{selectedBookToReturn?.textbook_title}</b>-ро қабул кардан мехоҳед?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReturnModalOpen(false)}>Бекор кардан</Button>
                        <Button onClick={handleConfirmReturn} disabled={isReturnLoading} className="bg-blue-600 text-white">
                            {isReturnLoading ? <Loader2 className="animate-spin" /> : "Тасдиқ"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}