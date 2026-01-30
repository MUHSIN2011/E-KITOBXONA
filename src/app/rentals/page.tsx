"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, User, Calendar, CheckCircle2, Check, Funnel } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useGetActiveYearQuery,
    useGetRentalsQuery,
    useGetStudentsQuery,
    useGetTextbooksQuery,
    useRentTextbookMutation,
    useReturnBookMutation
} from '@/src/api/api';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { toast } from "react-hot-toast";
import { Loader2, User as Userr, Search as Searchs, Check as Checks } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Card from '@/src/components/Card';

export default function RentalsPage() {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [selectedBookIds, setSelectedBookIds] = useState<number[]>([]);

    const { data: rentals, isLoading: rentalsLoading, refetch: refetchRentals } = useGetRentalsQuery({ skip: 0, limit: 100 });
    const { data: studentsData } = useGetStudentsQuery({ search: searchTerm, skip: 0, limit: 20 });
    const { data: booksData } = useGetTextbooksQuery(undefined);
    const { data: activeYear } = useGetActiveYearQuery();

    const [rentBook, { isLoading: isRentLoading }] = useRentTextbookMutation();
    const [returnBook] = useReturnBookMutation();
    console.log(rentals);


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
            const errorMsg = error.data?.detail || "Хатогӣ ҳангоми додани китоб";
            toast.error(typeof errorMsg === 'string' ? errorMsg : "Нусхаи дастрас ёфт нашуд");
        }
    };

    const toggleBookSelection = (id: number) => {
        setSelectedBookIds(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    const handleReturn = async (rentalId: number) => {
        try {
            await returnBook(rentalId).unwrap();
            toast.success("Китоб қабул карда шуд!");
            refetchRentals();
        } catch (err) {
            toast.error("Хатогӣ ҳангоми қабули китоб");
        }
    };

    const statusBooksCount = rentals?.items?.filter(item => item.status === 'active').length || 0;
    const statusReturnBooksCount = rentals?.items?.filter(item => item.status === 'returned').length || 0;


    return (
        <div className="px-6 space-y-6  bg-[#f8fafc]">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Иҷораи китобҳо</h1>
                    <p className="text-gray-500 text-sm">Назорати китобҳои додашуда ва баргардонидашуда</p>
                </div>


                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className='bg-[#0950c3] text-white py-2 px-3 rounded-sm hover:bg-[#0a45a5] transition-colors duration-200'
                            data-aos="fade-left"
                            data-aos-delay="300">
                            + Иҷораи нав
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-0 shadow-xl">
                        <DialogHeader className="space-y-3">
                            <DialogTitle className="text-xl font-bold text-gray-900">Додани китоби нав</DialogTitle>
                            <DialogDescription>Маълумоти хонанда ва китобро интихоб кунед.</DialogDescription>
                            <div className="h-1 w-20 bg-[#0950c3] rounded-full"></div>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <Userr className="h-4 w-4 text-[#0950c3]" /> Хонанда:
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-between w-full border-gray-300 rounded-xl">
                                            {selectedStudentId
                                                ? studentsData?.items.find(s => s.id === selectedStudentId)?.first_name + " " + studentsData?.items.find(s => s.id === selectedStudentId)?.last_name
                                                : "Ҷустуҷӯи хонанда..."}
                                            <Searchs className="ml-2 h-4 w-4 text-gray-400" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[450px] p-0 rounded-xl shadow-lg" align="start">
                                        <Command>
                                            <CommandInput placeholder="Номи хонанда..." onValueChange={setSearchTerm} />
                                            <CommandEmpty>Хонанда ёфт нашуд.</CommandEmpty>
                                            <CommandGroup className="max-h-60 overflow-y-auto">
                                                {studentsData?.items.map((student) => (
                                                    <CommandItem
                                                        key={student.id}
                                                        onSelect={() => setSelectedStudentId(student.id)}
                                                        className="py-3 px-4 cursor-pointer"
                                                    >
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
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <BookOpen className="h-4 w-4 text-[#0950c3]" /> Китобҳо:
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-between w-full border-gray-300 rounded-xl">
                                            {selectedBookIds.length > 0
                                                ? `${selectedBookIds.length} китоб интихоб шуд`
                                                : "Интихоби китобҳои дастрас..."}
                                            <Searchs className="ml-2 h-4 w-4 text-gray-400" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[450px] p-0 shadow-lg border-none rounded-2xl" align="start">
                                        <Command>
                                            <CommandInput placeholder="Ҷустуҷӯи китоб..." />
                                            <CommandEmpty>Китоб ёфт нашуд.</CommandEmpty>
                                            <CommandGroup className="max-h-60 overflow-y-auto p-2">
                                                {booksData?.items.map((book) => {
                                                    // Санҷиши он ки оё ин китоб интихоб шудааст
                                                    const isSelected = selectedBookIds.includes(book.id);

                                                    return (
                                                        <CommandItem
                                                            key={book.id}
                                                            onSelect={() => toggleBookSelection(book.id)} // ID-и китобро илова/нест мекунад
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
                                                                    <span className="font-semibold text-gray-900">{book.title}</span>
                                                                    <span className="text-[11px] text-gray-500">
                                                                        Муаллиф: {book.author} | Дастрас: {book.available_copies}
                                                                    </span>
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
                            <Button onClick={handleRent} disabled={isRentLoading} className="bg-[#0950c3] text-white rounded-xl flex-1">
                                {isRentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Тасдиқ кардан"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className='grid grid-cols-3 gap-3 my-7'>
                <div
                    className='text-green-600'
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <Card
                        NameRole={'Иҷораҳои фаъол'}
                        cnt={statusBooksCount.toString() || '0'}
                    />
                </div>
                <div
                    className='text-yellow-500'
                    data-aos="fade-up"
                    data-aos-delay="300"
                >
                    <Card
                        NameRole={'Вайроншуда'}
                        cnt={'1'}
                    />
                </div>
                <div
                    className='text-red-600'
                    data-aos="fade-up"
                    data-aos-delay="400"
                >
                    <Card
                        NameRole={'Баргардонидашуда'}
                        cnt={statusReturnBooksCount.toString() || '0'}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4  bg-white p-4 rounded-2xl border shadow-sm">
                <div className='grid grid-cols-6 gap-2'>
                    <div className="relative col-span-5">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Ҷустуҷӯ аз рӯи номи хонанда ё китоб..." className="pl-10 bg-[#f9fafb] border-none rounded-xl" />
                    </div>
                    <Select>
                        <SelectTrigger className="w-[180px] col-span-1 rounded-xl bg-[#f9fafb] border-none">
                            <Funnel className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Ҳамаи статусҳо" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Ҳама</SelectItem>
                            <SelectItem value="active">Дар даст</SelectItem>
                            <SelectItem value="returned">Баргардонидашуда</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-2xl overflow-hidden bg-white ">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="border-b">
                                <TableHead className="font-bold py-4 pl-4">Хонанда</TableHead>
                                <TableHead className="font-bold">Китоб</TableHead>
                                <TableHead className="font-bold">Санаи супоридан</TableHead>
                                <TableHead className="font-bold">Санаи Гирифт</TableHead>
                                <TableHead className="font-bold text-center">Статус</TableHead>
                                <TableHead className=" font-bold text-right pr-7">Амал</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rentalsLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20 text-gray-500">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 opacity-20" />
                                        Дар ҳоли боркунӣ...
                                    </TableCell>
                                </TableRow>
                            ) : rentals?.items?.map((rental: any) => (
                                <TableRow key={rental.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#0950c3]">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{rental.student_name}</div>
                                                <div className="text-[10px] text-gray-400 font-mono">ID: {rental.student_id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800">
                                                {rental.textbook_title || 'Номи китоб номаълум'}
                                            </span>
                                            <span className="text-[10px] text-blue-500 bg-blue-50 w-fit px-1.5 rounded">
                                                Экземпляр ID: {rental.textbook_copy_id || 'N/A'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Calendar className="w-3.5 h-3.5 opacity-40" />
                                            {new Date(rental.rent_start).toLocaleDateString('tg-TJ')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Calendar className="w-3.5 h-3.5 opacity-40" />{
                                                rental.rent_end ? new Date(rental.rent_end).toLocaleDateString('tg-TJ') : '---'
                                            }
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={cn(
                                            "px-3 py-1 rounded-full border-none font-medium",
                                            rental.status === 'active'
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                        )}>
                                            {rental.status === 'active' ? 'Дар даст' : 'Баргардонида шуд'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right px-6">
                                        {rental.status === 'active' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleReturn(rental.id)}
                                                className="bg-white border border-[#0950c3] text-[#0950c3] hover:bg-blue-50 rounded-lg px-4 font-semibold h-8"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                                Қабул кардан
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}