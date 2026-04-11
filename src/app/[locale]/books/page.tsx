'use client'
import React, { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useForm } from "react-hook-form"
import { ExternalLink, Funnel, Plus, BookOpen, Loader2, Check, Copy, ImageIcon, CheckCircle2, Boxes, Search, TextAlignJustify, TextAlignJustifyIcon } from 'lucide-react'

import {
    IGetTextbooks,
    useGetTextbooksQuery,
    useCreateTextbookMutation,
    useGetSubjectsQuery,
    useGetTextbookByIdQuery,
    useCreateSubjectsMutation,
    useGetTextbookStatsQuery
} from '@/api/api'
import Card from '@/components/Card'
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslations } from 'next-intl'

function Page() {
    const t = useTranslations('BooksPage')

    const [subject, setSubject] = useState<string>("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubjectsDialogOpen, setIsSubjectsDialogOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const { data: books, isFetching, isLoading: booksLoading } = useGetTextbooksQuery(subject);
    const { data: subjectsData } = useGetSubjectsQuery();
    const [createTextbook, { isLoading: isCreating }] = useCreateTextbookMutation();
    const [createSubject, { isLoading: isCreatingSubject }] = useCreateSubjectsMutation();
    const { register, handleSubmit: onSubmitBooks, setValue, reset, watch } = useForm();
    const { data: bookDetail, isFetching: isDetailLoading } = useGetTextbookByIdQuery(selectedId!, {
        skip: !selectedId,
    });
    const { data: stats, isLoading, error } = useGetTextbookStatsQuery(selectedId!, {
        skip: !selectedId
    });
    const { register: registerSubject, handleSubmit: onSubmitSubjects, setValue: setValueSubject, reset: resetSubject, } = useForm();
    const fileWatcher = watch("file");


    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);


    const handleSubmitBooks = async (data: any) => {
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

    const handleSubmitSubjects = async (data: any) => {
        try {
            const formdata = new FormData() as any;
            formdata.append("name", data.name);
            await createSubject(formdata).unwrap();
            setIsSubjectsDialogOpen(false);
            resetSubject();
            toast.success("Фанни нав бо муваффақият илова шуд!");
        } catch (error) {
            console.error("Error creating subject:", error);
            toast.error("Хатогӣ рӯй дод! Шояд маълумотҳо нопурраанд.");
        }
    }



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
        <main className="px-4 min-h-screen  dark:bg-gray-900">
            <Toaster />
            <div className='flex  md:flex-row flex-col md:gap-0 gap-6 items-center md:justify-between mb-6'>
                <div className='flex flex-col gap-2 items-center'>
                    <TextAnimate className='md:text-2xl text-xl font-bold' animation="slideUp" by="word">
                        {t('title')}
                    </TextAnimate>
                    <p className='text-muted-foreground md:w-auto w-[80%] text-center text-sm'>
                        {t('subtitle')}
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700 h-11 px-6 md:w-auto w-full shadow-lg ">
                            <Plus className="h-5 w-5 " /> {t('addButton')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className=" max-h-[95vh]  dark:bg-gray-900 overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-2xl">
                                <BookOpen className="text-blue-600 " /> {t('dialog.title')}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={onSubmitBooks(handleSubmitBooks)} className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>{t('dialog.labels.bookName')}</Label>
                                    <Input placeholder={t('dialog.placeholders.bookName')} {...register("title", { required: true })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>{t('dialog.labels.subject')}</Label>
                                    <Select onValueChange={(v) => setValue("subject_id", v)}>
                                        <SelectTrigger className="w-full py-4 h-13 rounded-sm transition-colors">
                                            <SelectValue placeholder={t('dialog.placeholders.subject')} />
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
                                    <Label>{t('dialog.labels.grade')}</Label>
                                    <Input placeholder={t('dialog.placeholders.grade')} type="number" {...register("grade")} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>{t('dialog.labels.publicationYear')}</Label>
                                    <Input placeholder={t('dialog.placeholders.publicationYear')} type="number" {...register("publication_year")} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>{t('dialog.labels.isbn')}</Label>
                                    <Input placeholder={t('dialog.placeholders.isbn')} {...register("isbn")} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>{t('dialog.labels.author')}</Label>
                                    <Input placeholder={t('dialog.placeholders.author')} {...register("author", { required: true })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>{t('dialog.labels.publisher')}</Label>
                                    <Input placeholder={t('dialog.placeholders.publisher')} {...register("publisher", { required: true })} />
                                </div>
                            </div>

                            <div className="rounded-lg grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>{t('dialog.labels.printPrice')}</Label>
                                    <Input placeholder={t('dialog.placeholders.printPrice')} type="number" step="0.01" {...register("print_price")} className="bg-white" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>{t('dialog.labels.rentPerYear')}</Label>
                                    <Input placeholder={t('dialog.placeholders.rentPerYear')} type="number" step="0.01" {...register("rent_value_per_year")} className="bg-white" />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold uppercase text-slate-500 ml-1">{t('dialog.labels.bookImage')}</Label>
                                <label className="group relative flex flex-col items-center justify-center w-full h-[90px] border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50  dark:bg-gray-800 hover:border-blue-400 transition-all overflow-hidden">
                                    <div className="flex flex-col items-center justify-center pt-4 pb-4">
                                        <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors" />

                                        <p className="mt-2 text-xs text-slate-500 font-medium px-2 text-center truncate max-w-full">
                                            {fileWatcher && fileWatcher[0] ? (
                                                <span className="text-blue-600 font-bold flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> {fileWatcher[0].name}
                                                </span>
                                            ) : (
                                                t('dialog.placeholders.uploadImage')
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
                                <Label>{t('dialog.labels.description')}</Label>
                                <Textarea className='min-h-15' {...register("description")} />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={isCreating} className="w-full bg-blue-600 h-11">
                                    {isCreating ? <Loader2 className="animate-spin" /> : t('dialog.buttons.saving')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                <Card
                    NameRole={t('stats.totalBooks')}
                    cnt={books?.total?.toLocaleString() || "0"}
                    className="text-green-600"
                    DarkTextColor="text-green-400"
                />
                <Card
                    NameRole={t('stats.rentedBooks')}
                    cnt={books?.items?.reduce((acc, book) => acc + (book.rented_copies || 0), 0).toLocaleString() || "0"}
                    className="text-yellow-500"
                    DarkTextColor="text-yellow-400"
                />
                <Card
                    NameRole={t('stats.totalCopies')}
                    cnt={books?.items?.reduce((acc, book) => acc + (book.total_copies || 0), 0).toLocaleString() || "0"}
                    className="text-blue-600"
                    DarkTextColor="text-blue-400"
                />
            </div>


            <section
                className='p-4 my-4 bg-white dark:bg-gray-800 rounded-2xl border shadow-sm hover:shadow-md transition-shadow duration-300 max-w-full overflow-x-auto'
            // data-aos="zoom-in"
            // data-aos-delay="100"
            >
                <h1 className='md:text-2xl text-xl font-bold'>{t('list.title')}</h1>
                <p className='text-muted-foreground md:w-full w-[80%] text-sm'>{t('list.description')}</p>

                <div className='grid grid-cols-1 md:grid-cols-6 my-4 gap-3'>
                    <div className="relative max-w-full dark:bg-gray-800 col-span-1 md:col-span-4" data-aos="fade-right" data-aos-delay="200">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            className='max-w-full w-full rounded-xl pl-10 pr-4 py-2.5 border bg-[#f9fafb] dark:bg-gray-900 dark:border-zinc-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all duration-200 outline-none'
                            placeholder={t('list.searchPlaceholder')}
                            type="search"
                        />
                    </div>

                    <div className="relative max-w-full col-span-1 md:col-span-1  dark:bg-gray-800" data-aos="fade-up" data-aos-delay="300">
                        <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                        <Select onValueChange={(value) => setSubject(value)}>
                            <SelectTrigger className="w-full bg-[#f9fafb]  dark:bg-gray-900 dark:border-zinc-800 py-5 pl-9 h-11 rounded-xl border">
                                <SelectValue placeholder={t('list.filterAll')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('list.filterAll')}</SelectItem>
                                {subjectsData?.map((sub: any) => (
                                    <SelectItem key={sub.id} value={sub.id.toString()}>
                                        {sub.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Dialog open={isSubjectsDialogOpen} onOpenChange={setIsSubjectsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className='col-span-1 md:col-span-1 cursor-pointer duration-600 transition-all bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white border-none font-semibold h-11 rounded-xl flex gap-2 items-center'
                                data-aos="fade-left"
                                data-aos-delay="300"
                            >
                                <Boxes size={18} />
                                <span>{t('list.addSubjectButton')}</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] dark:bg-gray-900 overflow-y-auto rounded-[24px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-2xl">
                                    <BookOpen className="text-blue-600" /> {t('subjectDialog.title')}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={onSubmitSubjects(handleSubmitSubjects)} className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>{t('subjectDialog.label')}</Label>
                                    <Input placeholder={t('subjectDialog.placeholder')} {...registerSubject("name", { required: t('subjectDialog.error') })} />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isCreatingSubject} className="w-full text-white hover:bg-blue-700 bg-blue-600 h-11 rounded-xl">
                                        {isCreatingSubject ? <Loader2 className="animate-spin" /> : t('subjectDialog.button')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <SheetContent className="max-h-screen md:max-w-112.5 w-full overflow-y-auto px-4 py-2 border-l-4 border-blue-600  dark:bg-gray-900">
                        <SheetHeader className="mb-4">
                            <SheetTitle className="text-2xl font-black leading-tight">
                                {isDetailLoading ? t('sheet.loading') : bookDetail?.title}
                            </SheetTitle>
                            <SheetDescription>
                                {isDetailLoading ? t('sheet.wait') : t('sheet.description')}
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
                                            alt={bookDetail.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded text-xs font-bold uppercase">
                                            {bookDetail.subject_name}
                                        </span>
                                        <p className="text-muted-foreground mt-2">
                                            {t('sheet.author')}: <span className="text-foreground font-medium">{bookDetail.author}</span>
                                        </p>
                                    </div>
                                </div>

                                <hr className="dark:border-zinc-800" />

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-slate-50  dark:bg-gray-800 p-3 rounded-xl border dark:border-zinc-800 text-center">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">{t('sheet.stats.total')}</p>
                                        <p className="text-xl font-black">{bookDetail.total_copies}</p>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/30 text-center">
                                        <p className="text-[10px] text-green-600 uppercase font-bold">{t('sheet.stats.available')}</p>
                                        <p className="text-xl font-black text-green-700 dark:text-green-400">{bookDetail.available_copies}</p>
                                    </div>
                                    <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30 text-center">
                                        <p className="text-[10px] text-amber-600 uppercase font-bold">{t('sheet.stats.rented')}</p>
                                        <p className="text-xl font-black text-amber-700 dark:text-amber-400">{bookDetail.rented_copies}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-y-4 gap-x-8 bg-white  dark:bg-gray-800 p-4 rounded-2xl border dark:border-zinc-800 shadow-sm">
                                    <div>
                                        <Label className="text-slate-400">{t('sheet.details.grade')}</Label>
                                        <p className="font-semibold">{bookDetail.grade}-ум</p>
                                    </div>
                                    <div>
                                        <Label className="text-slate-400">{t('sheet.details.publicationYear')}</Label>
                                        <p className="font-semibold">{bookDetail.publication_year}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-slate-400">{t('sheet.details.publisher')}</Label>
                                        <p className="font-semibold">{bookDetail.publisher}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-slate-400 mb-1 "><TextAlignJustifyIcon className='size-5' /> {t('sheet.details.isbn')}</Label>
                                        <div className="flex items-center gap-2 group">
                                            <p className="font-mono text-sm bg-slate-100 dark:bg-zinc-800 p-1.5 rounded border dark:border-zinc-700 w-fit">
                                                {bookDetail.isbn}
                                            </p>
                                            <button
                                                onClick={() => handleCopy(bookDetail.isbn)}
                                                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-500 transition-colors"
                                            >
                                                {copied ? (
                                                    <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                                                        <Check size={14} /> {t('sheet.details.copied')}
                                                    </span>
                                                ) : (
                                                    <Copy size={16} className="group-hover:text-blue-600" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-2">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                                        Статистикаи молиявӣ
                                    </h3>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 border dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-900/50">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Худро пӯшонидааст</p>
                                            <div className="flex items-end gap-1">
                                                <p className="text-xl font-black text-emerald-600">{stats?.paid_off_copies}</p>
                                                <p className="text-xs text-slate-400 mb-1">аз {stats?.total_copies}</p>
                                            </div>
                                        </div>

                                        <div className="p-3 border dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-900/50">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Самаранокӣ</p>
                                            <div className="mt-1">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${stats?.efficiency_rating === 'poor'
                                                    ? 'bg-red-100 text-red-600 dark:bg-red-900/20'
                                                    : 'bg-green-100 text-green-600 dark:bg-green-900/20'
                                                    }`}>
                                                    {stats?.efficiency_rating === 'poor' ? 'Заиф' : 'Аъло'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 bg-zinc-50 dark:bg-zinc-900/30 p-3 rounded-xl border border-dashed dark:border-zinc-800">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Арзиши умумии аввалия:</span>
                                            <span className="font-bold">{stats?.total_initial_cost} TJS</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Арзиши ҷамъшуда:</span>
                                            <span className="font-bold text-blue-600">{stats?.total_accumulated_value} TJS</span>
                                        </div>

                                        <div className="pt-2">
                                            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                                                <span>Фоизи миёнаи бозгашт</span>
                                                <span>{stats?.average_payback_percentage}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 transition-all duration-500"
                                                    style={{ width: `${stats?.average_payback_percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                                        {t('sheet.financial.title')}
                                    </h3>
                                    <div className="flex justify-between items-center p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-dashed border-blue-200 dark:border-blue-900/30">
                                        <span className="text-slate-600 dark:text-zinc-400">{t('sheet.financial.printPrice')}:</span>
                                        <span className="text-xl font-bold">{bookDetail.print_price} {t('sheet.financial.currency')}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-dashed border-green-200 dark:border-green-900/30">
                                        <span className="text-slate-600 dark:text-zinc-400">{t('sheet.financial.rentPrice')}:</span>
                                        <span className="text-xl font-bold text-green-600 dark:text-green-400">{bookDetail.rent_value_per_year} {t('sheet.financial.currency')}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-400 italic">{t('sheet.description')}:</Label>
                                    <p className="text-slate-700 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-zinc-900 p-3 rounded-lg border dark:border-zinc-800">
                                        {bookDetail.description}
                                    </p>
                                </div>

                                <div className="text-[10px] text-slate-400 pt-4 text-center">
                                    {t('sheet.id')}: {bookDetail.id} • {t('sheet.date')}: {new Date(bookDetail.created_at).toLocaleString('tg-TJ')}
                                </div>
                            </div>
                        )}


                        <hr className="dark:border-zinc-800" />
                    </SheetContent>
                </Sheet>

                <div
                    className={`w-full sm:max-w-full max-w-85 md:max-w-full 
        ${isFetching ? "opacity-50  dark:bg-gray-900" : "opacity-100"} 
        overflow-x-auto overflow-y-clip rounded-xl border border-gray-200 
        dark:border-gray-800 bg-white  dark:bg-gray-900
        transition-opacity duration-200`}
                >
                    <table className="w-full text-left border-collapse border border-gray-200 dark:border-zinc-800 min-w-212.5">
                        <thead className="bg-gray-50  dark:bg-gray-900">
                            <tr>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 bg-gray-50  dark:bg-gray-900 border-b dark:border-gray-800">{t('list.table.bookName')}</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 border-b dark:border-zinc-800">{t('list.table.grade')}</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 border-b dark:border-zinc-800">{t('list.table.rental')}</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 border-b dark:border-zinc-800">{t('list.table.status')}</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 border-b dark:border-zinc-800">{t('list.table.updateDate')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {books?.items?.map((book: IGetTextbooks) => (
                                <tr
                                    key={book.id}
                                    onClick={() => handleRowClick(book.id)}
                                    className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group"
                                >
                                    <td className="p-4 font-semibold text-gray-800 dark:text-zinc-100 bg-white  dark:bg-gray-900 group-hover:bg-blue-50/50 dark:group-hover:bg-gray-900/10   transition-colors">
                                        {book.title}
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-zinc-400">{book.grade}</td>
                                    <td className="p-4 text-gray-600 dark:text-zinc-400 font-mono">{book.payback_years} TJS</td>
                                    <td className="p-4">
                                        {book.is_new ? (
                                            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full text-[11px] font-bold">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> {t('list.table.new')}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-full text-[11px] font-bold">
                                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> {t('list.table.old')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 dark:text-zinc-500">
                                        {new Date(book.updated_at).toLocaleDateString('tg-TJ')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {booksLoading && (
                        <div className="flex justify-center items-center p-8">
                            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
                            <span className="ml-3 text-gray-600 dark:text-zinc-400">{t('list.loading')}</span>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Page;