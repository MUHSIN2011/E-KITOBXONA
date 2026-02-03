'use client'
import React, { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useForm } from "react-hook-form"
import { ExternalLink, Funnel, Plus, BookOpen, Loader2 } from 'lucide-react'

import { 
    IGetTextbooks, 
    useGetTextbooksQuery, 
    useCreateTextbookMutation, 
    useGetSubjectsQuery 
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

function Page() {
    const [subject, setSubject] = useState<string>("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: books, isLoading: booksLoading } = useGetTextbooksQuery(subject);
    const { data: subjectsData } = useGetSubjectsQuery();
    const [createTextbook, { isLoading: isCreating }] = useCreateTextbookMutation();

    const { register, handleSubmit, setValue, reset } = useForm();

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
                subject_id: Number(data.subject_id),
                grade: Number(data.grade),
                publication_year: Number(data.publication_year),
                print_price: Number(data.print_price),
                rent_value_per_year: Number(data.rent_value_per_year),
                service_life_years: Number(data.service_life_years || 5),
                payback_years: Number(data.payback_years || 10),
                description: data.description || "",
                isbn: data.isbn || ""
            };

            await createTextbook(payload).unwrap();
            setIsDialogOpen(false);
            reset();
            alert("Китоб бо муваффақият илова шуд!");
        } catch (error) {
            console.error(error);
            alert("Хатогӣ рӯй дод!");
        }
    };

    return (
        <main data-aos="fade-in" className="p-4">
            <div className='flex justify-between items-center mb-6'>
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
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 h-11 px-6 shadow-lg ">
                            <Plus className="h-5 w-5" /> Нашри китоби нав
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-2xl">
                                <BookOpen className="text-blue-600" /> Иловаи китоби нав
                            </DialogTitle>
                            <DialogDescription>
                                Маълумоти карточкаи китобро пур кунед.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Номи китоб</Label>
                                    <Input placeholder="Забони модарӣ" {...register("title", { required: true })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Фан</Label>
                                    <Select onValueChange={(v) => setValue("subject_id", v)}>
                                        <SelectTrigger className="w-full py-5 h-13 rounded-xl transition-colors">
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
                                    <Input type="number" {...register("grade")} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Соли нашр</Label>
                                    <Input type="number" {...register("publication_year")} />
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
                                    <Input type="number" step="0.01" {...register("print_price")} className="bg-white" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Иҷора / сол</Label>
                                    <Input type="number" step="0.01" {...register("rent_value_per_year")} className="bg-white" />
                                </div>
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
                className='p-3 my-3 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300'
                data-aos="zoom-in"
                data-aos-delay="500"
            >
                <h1 className='text-2xl font-bold '>Фонди китобҳои дарсӣ</h1>
                <p className='text-foreground text-sm'>Рӯйхати пурраи ҳамаи китобҳои дарсӣ дар система</p>

                <div className='grid grid-cols-6 my-3 gap-3 items-center'>
                    <input
                        className='col-span-4 rounded-xl px-5 py-2 border bg-[#f9fafb] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200'
                        placeholder='Ҷустуҷӯи китобҳо...'
                        type="search"
                        data-aos="fade-right"
                        data-aos-delay="600"
                    />

                    <div
                        className="relative col-span-1"
                        data-aos="fade-up"
                        data-aos-delay="700"
                    >
                        <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                        <Select onValueChange={(value) => setSubject(value)}>
                            <SelectTrigger className="w-full bg-[#f9fafb] py-5 pl-10 h-13 rounded-xl hover:bg-gray-50 transition-colors">
                                <SelectValue placeholder="Ҳама" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Ҳамаи фанҳо</SelectItem>
                                {subjectsData?.map((sub: any) => (
                                    <SelectItem key={sub.id} value={sub.name}>
                                        {sub.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <button
                        className='flex col-span-1 hover:bg-[#e7f0fe] hover:text-blue-600 duration-200 bg-[#f9fafb] border font-semibold px-2 py-2 rounded-xl gap-2 items-center justify-center hover:scale-105 transition-all'
                        data-aos="fade-left"
                        data-aos-delay="800"
                    >
                        <ExternalLink size={'18'} />
                        Экспорт
                    </button>
                </div>

                <div
                    className="overflow-x-auto rounded-sm border-gray-200 bg-white"
                    data-aos="fade-up"
                    data-aos-delay="900"
                >
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Номи китоб</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Синф</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Миқдор</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Ҳолат</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Санаи навсозӣ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {books?.items?.map((book: IGetTextbooks, index: number) => (
                                <tr
                                    key={book.id}
                                    className="hover:bg-gray-50 transition-colors"
                                    data-aos="fade-right"
                                    data-aos-delay={index * 50}
                                    data-aos-duration="400"
                                >
                                    <td className="p-4 font-semibold text-gray-800">{book.title}</td>
                                    <td className="p-4 text-gray-600">{book.grade}</td>
                                    <td className="p-4 text-gray-600 font-mono">
                                        {book.total_copies} дона
                                    </td>
                                    <td className="p-4">
                                        {(() => {
                                            const currentYear = new Date().getFullYear();
                                            const age = currentYear - book.publication_year;
                                            if (age <= 2) {
                                                return (
                                                    <span className="flex items-center w-fit gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                        Нав
                                                    </span>
                                                );
                                            } else {
                                                return (
                                                    <span className="flex items-center w-fit gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                                        Кӯҳна
                                                    </span>
                                                );
                                            }
                                        })()}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
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