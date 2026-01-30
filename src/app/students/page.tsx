"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TextAnimate } from '@/components/ui/text-animate'
import { IAddNewStudentRequest, IGetStudents, useAddNewStudentMutation, useGetStudentsQuery } from '@/src/api/api'
import CardsStudent from '@/src/components/CardsStudent'
import { Book, DollarSign, Funnel, Users } from 'lucide-react'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'

function StudentsPage() {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const limit = 10;
    const [open, setOpen] = useState(false);
    const {
        register: registerStudent,
        handleSubmit: handleSubmitStudent,
        reset: resetStudent,
        formState: { errors: studentErrors }
    } = useForm<IAddNewStudentRequest>();
    const [addNewStudent, { isLoading: isAdding }] = useAddNewStudentMutation();

    const { data: students, isLoading } = useGetStudentsQuery({
        skip: page * limit,
        limit: limit,
        search: search
    });

    const totalItems = students?.total || 0;
    const startItem = page * limit + 1;
    const endItem = Math.min((page + 1) * limit, totalItems);

    if (isLoading) return <div className="flex h-[85vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>


    const onSubmit = async (formData: IAddNewStudentRequest) => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                toast.error("Шумо ворид нашудаед!");
                return;
            }

            const decoded: any = jwtDecode(token);
            const school_id = decoded.school_id;

            const payload = {
                ...formData,
                birth_year: Number(formData.birth_year),
                school_id: Number(school_id),
                notes: formData.notes || ""
            };

            console.log("Фиристодан ба сервер:", payload);

            await addNewStudent(payload).unwrap();

            toast.success("Хонанда бомуваффақият илова шуд!");
            resetStudent();
            setOpen(false);
        } catch (error) {
            toast.error("Хатогӣ ҳангоми иловакунӣ!");
        }
    };

    return (
        <main className="p-4 space-y-6">
            <div className='flex justify-between items-center'>
                <div>
                    <TextAnimate className='text-2xl font-bold' animation="slideUp" by="word">
                        Хонандагон
                    </TextAnimate>
                    <TextAnimate className='text-foreground text-sm' animation="slideUp" by="word">
                        Идоракунии хонандагон ва иҷораҳои онҳо
                    </TextAnimate>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger className='bg-[#0950c3] hover:bg-blue-700 flex gap-2 text-white py-2 px-4 rounded-xl text-sm font-medium'>
                        + Илова кардани хонанда
                    </DialogTrigger>

                    <DialogContent className='max-h-[95vh] h-auto bg-gray-50 overflow-y-auto sm:max-w-[500px]'>
                        <DialogHeader>
                            <DialogTitle>Илова кардани хонанда</DialogTitle>
                            <DialogDescription>Маълумоти хонандаи навро ворид кунед</DialogDescription>
                        </DialogHeader>

                        <form id="student-form" onSubmit={handleSubmitStudent(onSubmit)} className='my-3 flex flex-col gap-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-sm font-medium'>Насаб *</label>
                                    <Input {...registerStudent("last_name", { required: true })} placeholder='Раҳимов' />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-sm font-medium'>Ном *</label>
                                    <Input {...registerStudent("first_name", { required: true })} placeholder='Али' />
                                </div>
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium'>Номи падар *</label>
                                <Input {...registerStudent("middle_name", { required: true })} placeholder='Аҳмадович' />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-sm font-medium'>Синф *</label>
                                    <Input {...registerStudent("class_name", { required: true })} placeholder='10A' />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-sm font-medium'>Соли таваллуд *</label>
                                    <Input {...registerStudent("birth_year", { required: true })} type="number" placeholder='2011' />
                                </div>
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium'>Телефони волидайн *</label>
                                <Input {...registerStudent("parent_phone", { required: true })} defaultValue={'+992'} placeholder='+992914049999' />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium'>Эзоҳ</label>
                                <Textarea {...registerStudent("notes")} className='max-h-24' placeholder='Маълумоти иловагӣ...' />
                            </div>
                        </form>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Бекор кардан</Button>
                            </DialogClose>
                            <Button
                                disabled={isAdding}
                                type="submit"
                                form="student-form"
                                className='bg-[#0950c3] hover:bg-[#063d95]'
                            >
                                {isAdding ? "Дар ҳоли илова..." : "Илова кардан"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <CardsStudent Icons={<Users className="text-blue-500" />} NameRole='Ҳамагӣ хонандагон' cnt={totalItems.toString()} />
                <CardsStudent Icons={<Book className="text-green-500" />} NameRole='Иҷораҳои фаъол' cnt={'27'} />
                <CardsStudent Icons={<DollarSign className="text-red-500" />} NameRole='Бо ҷуброн' cnt={'2'} />
            </div>

            <section className='py-5 px-3 bg-white rounded-xl border shadow-sm'>
                <h1 className='text-xl font-bold'>Рӯйхати хонандагон</h1>
                <p className='text-muted-foreground text-sm mb-4'>Ҳамаи хонандагони бақайдгирифташуда</p>

                <div className='grid grid-cols-1 md:grid-cols-5 gap-3 mb-4'>
                    <input
                        className='md:col-span-4 rounded-xl px-4 py-2 border bg-[#f9fafb] focus:ring-2 focus:ring-blue-500 outline-none transition-all'
                        placeholder='Ҷустуҷӯи хонандагон...'
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="relative md:col-span-1">
                        <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                        <Select>
                            <SelectTrigger className="w-full bg-[#f9fafb] pl-10 h-10 rounded-xl border-gray-200">
                                <SelectValue placeholder="Синф" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Ҳамаи синфҳо</SelectItem>
                                <SelectItem value="10">10-ум</SelectItem>
                                <SelectItem value="11">11-ум</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="p-4 text-xs font-bold uppercase text-gray-500">Ному насаб</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500">Синф</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 text-center">Иҷораҳо</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500">Телефон</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500">Эзоҳ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students?.items?.map((student: IGetStudents) => (
                                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-semibold text-gray-800">{student.first_name} {student.last_name}</div>
                                        <div className="text-xs text-gray-400">{student.middle_name}</div>
                                    </td>
                                    <td className="p-4 text-gray-600">{student.class_name || "—"}</td>
                                    <td className="p-4 text-center">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">0</span>
                                    </td>
                                    <td className="p-4 text-gray-600 text-sm">{student.parent_phone || "—"}</td>
                                    <td className="p-4">
                                        <span className="text-xs py-1 px-2 bg-gray-100 rounded text-gray-500 truncate max-w-[150px] inline-block">
                                            {student.notes || "Бе эзоҳ"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 mt-4 border-t bg-gray-50/50 rounded-b-xl">
                    <div className="text-sm text-gray-600">
                        Нишон дода шудааст: <span className="font-bold text-gray-900">{startItem}-{endItem}</span> аз <span className="font-bold text-gray-900">{totalItems}</span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                            disabled={page === 0}
                            className="px-4 py-2 text-sm font-medium border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                        >
                            Пештара
                        </button>
                        <button
                            onClick={() => setPage((prev) => prev + 1)}
                            disabled={endItem >= totalItems}
                            className="px-4 py-2 text-sm font-medium border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                        >
                            Баъдӣ
                        </button>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default StudentsPage;