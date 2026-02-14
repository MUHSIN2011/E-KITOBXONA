'use client'
import React, { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useForm } from "react-hook-form"
import { ExternalLink, Funnel, Plus, BookOpen, Loader2, Check, Copy, ImageIcon, CheckCircle2 } from 'lucide-react'

import {
    IGetTextbooks,
    useGetTextbooksQuery,
    useCreateTextbookMutation,
    useGetSubjectsQuery,
    useGetTextbookByIdQuery
} from '@/src/api/api'
import Card from '@/src/components/Card'
import { TextAnimate } from '@/components/ui/text-animate'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

function Page() {
    const [subject, setSubject] = useState<string>("all");
    console.log(subject);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: books, isFetching, isLoading: booksLoading } = useGetTextbooksQuery(subject);
    console.log(books);

    const { data: subjectsData } = useGetSubjectsQuery();
    const [createTextbook, { isLoading: isCreating }] = useCreateTextbookMutation();

    const { register, handleSubmit, setValue, reset, watch } = useForm();
    const fileWatcher = watch("file");

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);


    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData() as any;

            formData.append("title", data.title);
            formData.append("subject_id", String(Number(data.subject_id)));
            formData.append("grade", String(Number(data.grade)));
            formData.append("author", data.author || "");
            formData.append("publisher", data.publisher);
            formData.append("publication_year", String(Number(data.publication_year)));
            formData.append("print_price", String(Number(data.print_price)));
            formData.append("rent_value_per_year", String(Number(data.rent_value_per_year)));
            formData.append("isbn", data.isbn || "");
            formData.append("description", data.description || "");
            formData.append("is_new", "true");
            formData.append("service_life_years", String(Number(data.service_life_years || 5)));
            formData.append("payback_years", String(Number(data.payback_years || 10)));

            if (data.file && data.file[0]) {
                formData.append("cover_image_file", data.file[0]);
            }

            await createTextbook(formData).unwrap();

            setIsDialogOpen(false);
            reset();
            toast.success("Китоб бо муваффақият илова шуд!");
        } catch (error) {
            console.error("Error creating textbook:", error);
            toast.error("Хатогӣ рӯй дод! Шояд маълумотҳо нопурраанд.");
        }
    };

    const { data: bookDetail, isFetching: isDetailLoading } = useGetTextbookByIdQuery(selectedId!, {
        skip: !selectedId,
    });

    const handleRowClick = (id: number) => {
        setSelectedId(id);
        setIsDetailOpen(true);
    };

    const [copied, setCopied] = useState(false);
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main data-aos="fade-in" className="p-4">
            <Toaster />
            <div className='flex md:flex-row flex-col md:gap-0 gap-3 justify-between items-center mb-6'>
                <div>
                    <TextAnimate className='text-2xl font-bold' animation="slideUp" by="word">
                        Идоракунии фонди китобҳо
                    </TextAnimate>
                    <p className='text-muted-foreground text-sm'>
                        Назорат ва идоракунии китобҳои дарсӣ дар система
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700 h-11 px-6 shadow-lg ">
                            <Plus className="h-5 w-5 " /> Нашри китоби нав
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-2xl">
                                <BookOpen className="text-blue-600 " /> Иловаи китоби нав
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Номи китоб</Label>
                                    <Input placeholder="Забони модарӣ" {...register("title", { required: true })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Фан</Label>
                                    <Select onValueChange={(v) => setValue("subject_id", v)}>
                                        <SelectTrigger className="w-full py-4 h-13 rounded-sm transition-colors">
                                            <SelectValue placeholder="Интихоби фан" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjectsData?.map((sub: any) => (
                                                <SelectItem key={sub.id} value={sub.id.toString()}>
                                                    {sub.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label>Синф</Label>
                                    <Input placeholder='1' type="number" {...register("grade")} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Соли нашр</Label>
                                    <Input placeholder='2001' type="number" {...register("publication_year")} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>ISBN</Label>
                                    <Input placeholder="978-..." {...register("isbn")} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Муаллиф</Label>
                                    <Input placeholder="Абдуллозода С." {...register("author", { required: true })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Ношир (Publisher)</Label>
                                    <Input placeholder="Маориф" {...register("publisher", { required: true })} />
                                </div>
                            </div>

                            <div className="rounded-lg grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Нархи чоп (TJS)</Label>
                                    <Input placeholder='50' type="number" step="0.01" {...register("print_price")} className="bg-white" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Иҷора / сол</Label>
                                    <Input placeholder='1' type="number" step="0.01" {...register("rent_value_per_year")} className="bg-white" />
                                </div>

                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold uppercase text-slate-500 ml-1">Акси китоб</Label>
                                <label className="group relative flex flex-col items-center justify-center w-full h-[120px] border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all overflow-hidden">
                                    <div className="flex flex-col items-center justify-center pt-4 pb-4">
                                        <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors" />

                                        <p className="mt-2 text-xs text-slate-500 font-medium px-2 text-center truncate max-w-full">
                                            {fileWatcher && fileWatcher[0] ? (
                                                <span className="text-blue-600 font-bold flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> {fileWatcher[0].name}
                                                </span>
                                            ) : (
                                                "Боргузорӣ"
                                            )}
                                        </p>

                                        {fileWatcher && fileWatcher[0] && (
                                            <p className="text-[10px] text-slate-400 uppercase mt-1">
                                                {(fileWatcher[0].size / 1024).toFixed(1)} KB
                                            </p>
                                        )}
                                    </div>

                                    <input
                                        className="hidden"
                                        accept="image/*"
                                        {...register("file")}
                                        type="file"
                                    />
                                </label>
                            </div>

                            <div className="grid gap-2">
                                <Label>Тавсиф</Label>
                                <Textarea {...register("description")} />
                            </div>


                            <DialogFooter>
                                <Button type="submit" disabled={isCreating} className="w-full bg-blue-600 h-12">
                                    {isCreating ? <Loader2 className="animate-spin" /> : "Захира кардан"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
                <Card
                    NameRole='Ҳамагӣ китобҳо'
                    cnt={books?.total?.toLocaleString() || "0"}
                    className="text-green-600"
                />
                <Card
                    NameRole='Дар база мавҷуд'
                    cnt={books?.items?.reduce((acc, book) => acc + (book.available_copies || 0), 0).toLocaleString() || "0"}
                    className="text-blue-600"
                />
                <Card
                    NameRole='Иҷорашуда'
                    cnt={books?.items?.reduce((acc, book) => acc + (book.rented_copies || 0), 0).toLocaleString() || "0"}
                    className="text-yellow-500"
                />
                <Card
                    NameRole='Нусхаҳои умумӣ'
                    cnt={books?.items?.reduce((acc, book) => acc + (book.total_copies || 0), 0).toLocaleString() || "0"}
                    className="text-red-600"
                />
            </div>

            <section
                className='p-3 my-3 bg-white dark:bg-[#1a1a1a] rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300'
                data-aos="zoom-in"
                data-aos-delay="500"
            >
                <h1 className='text-2xl font-bold '>Фонди китобҳои дарсӣ</h1>
                <p className='text-foreground text-sm'>Рӯйхати пурраи ҳамаи китобҳои дарсӣ дар система</p>

                <div className='grid grid-cols-1 md:grid-cols-6 my-3 gap-3 items-center'>

                    <input
                        className='col-span-1 md:col-span-4 rounded-xl px-5 py-2.5 border bg-[#f9fafb] dark:bg-[#1a1a1a] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-blue-500 transition-all duration-200 outline-none'
                        placeholder='Ҷустуҷӯи китобҳо...'
                        type="search"
                        data-aos="fade-right"
                        data-aos-delay="600"
                    />

                    <div
                        className="relative col-span-1 md:col-span-1"
                        data-aos="fade-up"
                        data-aos-delay="700"
                    >
                        <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                        <Select onValueChange={(value) => setSubject(value)}>
                            <SelectTrigger className="w-full bg-[#f9fafb] py-5 pl-10 h-11 rounded-xl hover:bg-gray-50 transition-colors border">
                                <SelectValue placeholder="Ҳама" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Ҳамаи фанҳо</SelectItem>
                                {subjectsData?.map((sub: any) => (
                                    <SelectItem key={sub.id} value={sub.id.toString()}>
                                        {sub.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <button
                        className='flex col-span-1 md:col-span-1 hover:bg-[#e7f0fe] dark:bg-[#1a1a1a] hover:text-blue-600 duration-200 bg-[#f9fafb] border font-semibold px-2 py-2.5 rounded-xl gap-2 items-center justify-center hover:scale-[1.02] active:scale-95 transition-all'
                        data-aos="fade-left"
                        data-aos-delay="800"
                    >
                        <ExternalLink size={'18'} />
                        <span>Экспорт</span>
                    </button>
                </div>

                <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <SheetContent className="sm:max-w-[520px] overflow-y-auto px-4 py-2 border-l-4 border-blue-600">
                        <SheetHeader className="mb-4">
                            <SheetTitle className="text-2xl font-black leading-tight">
                                {isDetailLoading ? "Дар ҳоли боргирӣ..." : bookDetail?.title}
                            </SheetTitle>
                            <SheetDescription>
                                {isDetailLoading ? "Лутфан интизор шавед" : `Маълумоти муфассал дар бораи китоб`}
                            </SheetDescription>
                        </SheetHeader>

                        {isDetailLoading ? (
                            <div className="flex h-[60vh] items-center justify-center">
                                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
                            </div>
                        ) : bookDetail && (
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-32 h-44 bg-gray-100 rounded-lg overflow-hidden shadow-md flex-shrink-0 border">
                                        <img
                                            src={`https://student4.softclub.tj${bookDetail.cover_image_url}`}
                                            alt={bookDetail.title || "Муқоваи китоб"}
                                            className="w-full h-full object-cover"
                                            width={128}
                                            height={176}
                                        // priority={true} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">
                                            {bookDetail.subject_name}
                                        </span>
                                        <p className="text-muted-foreground mt-2">
                                            Муаллиф: <span className="text-foreground font-medium">{bookDetail.author}</span>
                                        </p>
                                    </div>
                                </div>

                                <hr />

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-slate-50 p-3 rounded-xl border text-center">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Умумӣ</p>
                                        <p className="text-xl font-black">{bookDetail.total_copies}</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-center">
                                        <p className="text-[10px] text-green-600 uppercase font-bold">Мавҷуд</p>
                                        <p className="text-xl font-black text-green-700">{bookDetail.available_copies}</p>
                                    </div>
                                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-center">
                                        <p className="text-[10px] text-amber-600 uppercase font-bold">Иҷора</p>
                                        <p className="text-xl font-black text-amber-700">{bookDetail.rented_copies}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-y-4 gap-x-8 bg-white p-4 rounded-2xl border shadow-sm">
                                    <div>
                                        <Label className="text-slate-400">Синф</Label>
                                        <p className="font-semibold">{bookDetail.grade}-ум</p>
                                    </div>
                                    <div>
                                        <Label className="text-slate-400">Соли нашр</Label>
                                        <p className="font-semibold">{bookDetail.publication_year}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-slate-400">Ношир</Label>
                                        <p className="font-semibold">{bookDetail.publisher}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-slate-400">ISBN</Label>
                                        <div className="flex items-center gap-2 group">
                                            <p className="font-mono text-sm bg-slate-100 p-1.5 rounded border border-slate-200 w-fit">
                                                {bookDetail.isbn}
                                            </p>
                                            <button
                                                onClick={() => handleCopy(bookDetail.isbn)}
                                                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                                                title="Нусхабардорӣ"
                                            >
                                                {copied ? (
                                                    <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                                                        <Check size={14} /> Нусха шуд!
                                                    </span>
                                                ) : (
                                                    <Copy size={16} className="group-hover:text-blue-600" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                                        Маълумоти молиявӣ
                                    </h3>
                                    <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-lg border border-dashed border-blue-200">
                                        <span className="text-slate-600">Нархи аслӣ:</span>
                                        <span className="text-xl font-bold">{bookDetail.print_price} TJS</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-lg border border-dashed border-green-200">
                                        <span className="text-slate-600">Нархи иҷора:</span>
                                        <span className="text-xl font-bold text-green-600">{bookDetail.rent_value_per_year} TJS</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-400 italic">Тавсифи китоб:</Label>
                                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border">
                                        {bookDetail.description}
                                    </p>
                                </div>

                                <div className="text-[10px] text-slate-400 pt-4 text-center">
                                    ID: {bookDetail.id} • Сана: {new Date(bookDetail.created_at).toLocaleString('tg-TJ')}
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>

                <div className={`w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-black bg-white dark:bg-[#1a1a1a] transition-opacity duration-200 ${isFetching ? "opacity-50" : "opacity-100"}`}>
                    <table className="w-full text-left border-collapse min-w-[300px]">
                        <thead className="bg-gray-50 dark:bg-[#141212] shadow-sm">
                            <tr className="bg-gray-50 border-b border-gray-200 dark:border-black dark:bg-[#141212]">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/80">Номи китоб</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/80">Синф</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/80">Миқдор</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/80">Ҳолат</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/80">Санаи навсозӣ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-black">
                            {books?.items?.map((book: IGetTextbooks, index: number) => (
                                <tr
                                    key={book.id}
                                    onClick={() => handleRowClick(book.id)}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-950/30 duration-500 transition-colors cursor-pointer"
                                >
                                    <td className="p-4 font-semibold text-gray-800 dark:text-white">{book.title}</td>
                                    <td className="p-4 text-gray-600 dark:text-white">{book.grade}</td>
                                    <td className="p-4 text-gray-600 dark:text-white font-mono">{book.total_copies} дона</td>
                                    <td className="p-4">
                                        {/* Коди статус дар инҷо... */}
                                        {new Date().getFullYear() - book.publication_year <= 2 ? (
                                            <span className="flex items-center w-fit gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Нав
                                            </span>
                                        ) : (
                                            <span className="flex items-center w-fit gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Кӯҳна
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm dark:text-white text-gray-500">
                                        {new Date(book.updated_at).toLocaleDateString('tg-TJ')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {booksLoading && (
                        <div className="flex justify-center items-center p-8">
                            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
                            <span className="ml-3 text-gray-600">Китобҳо дар ҳоли бор шудан...</span>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Page;