"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TextAnimate } from '@/components/ui/text-animate'
import { IAddNewStudentRequest, IGetStudents, useAddNewStudentMutation, useGetStudentByIdQuery, useGetStudentsQuery, useUpdateStudentMutation } from '@/src/api/api'
import CardsStudent from '@/src/components/CardsStudent'
import { Book, BookOpen, Calendar, DollarSign, FileText, Funnel, Hash, Phone, User, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'

function StudentsPage() {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const limit = 10;
    const [open, setOpen] = useState(false);
    const [idx, setIdx] = useState<number | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const {
        register: registerStudent,
        handleSubmit: handleSubmitStudent,
        reset: resetStudent,
        formState: { errors: studentErrors }
    } = useForm<IAddNewStudentRequest>();
    const [addNewStudent, { isLoading: isAdding }] = useAddNewStudentMutation();
    const { data: studentbyid, isLoading: isStudenting } = useGetStudentByIdQuery(
        idx as number,
        { skip: !idx }
    )
    console.log(studentbyid);

    const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

    const { data: students, isLoading } = useGetStudentsQuery({
        skip: page * limit,
        limit: limit,
        search: search
    });

    const totalItems = students?.total || 0;
    const startItem = page * limit + 1;
    const endItem = Math.min((page + 1) * limit, totalItems);
    const [editData, setEditData] = useState<any>(null);
    useEffect(() => {
        if (studentbyid) {
            setEditData(studentbyid);
        }
    }, [studentbyid]);

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
            const payload = {
                ...formData,
                birth_year: Number(formData.birth_year),
                school_id: Number(decoded.school_id),
                notes: formData.notes || ""
            };
            await addNewStudent(payload).unwrap();
            toast.success("Хонанда илова шуд!");
            resetStudent();
            setOpen(false);
        } catch (error) {
            toast.error("Хатогӣ ҳангоми иловакунӣ!");
        }
    };

    const handleUpdate = async () => {
        try {
            if (!studentbyid || !editData) {
                toast.error("Маълумот барои таҳрир нопурра аст");
                return;
            }

            await updateStudent({
                ...editData,
                id: studentbyid.id,
                birth_year: Number(editData.birth_year)
            }).unwrap();

            toast.success("Маълумот нав карда шуд!");
            setIsEditOpen(false);
        } catch (error) {
            toast.error("Хатогӣ ҳангоми навсозӣ!");
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
                        + Иловаи хонанда
                    </DialogTrigger>

                    <DialogContent className='max-h-[95vh] h-auto bg-gray-50 overflow-y-auto sm:max-w-[500px]'>
                        <DialogHeader>
                            <DialogTitle>Илова кардани хонанда</DialogTitle>
                            <DialogDescription>Маълумоти хонандаи навро ворид кунед</DialogDescription>
                        </DialogHeader>

                        <form id="student-form" onSubmit={handleSubmitStudent(onSubmit)} className='my-3 flex flex-col gap-4'>
                            <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                                <div className='flex flex-col gap-1'>
                                    <Label className='text-sm font-medium'>Насаб *</Label>
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

            <Sheet open={!!idx} onOpenChange={() => setIdx(null)}>
                <SheetContent className="sm:max-w-[500px] overflow-y-auto px-0"> {/* px-0 барои он ки Header пурра ранг гирад */}
                    <SheetHeader className="px-6 pb-6 pt-2 bg-gradient-to-r from-blue-50 to-white border-b">
                        <div className="flex justify-between items-start pt-4">
                            <SheetTitle className="text-2xl font-bold flex items-center gap-3 text-slate-800">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                Профили хонанда
                            </SheetTitle>
                        </div>
                    </SheetHeader>

                    {studentbyid && (
                        <div className="px-6 py-6 space-y-8">
                            <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-20 h-20 bg-blue-100 border-4 border-white shadow-sm rounded-full flex items-center justify-center text-blue-700 text-3xl font-black">
                                    {studentbyid.first_name[0]}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                        {studentbyid.last_name} {studentbyid.first_name}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium">{studentbyid.middle_name}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-md uppercase">
                                            Синфи {studentbyid.class_name}
                                        </span>
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${studentbyid.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {studentbyid.is_active ? 'Фаъол' : 'Ғайрифаъол'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <p className="text-[11px] uppercase font-bold tracking-wider">Соли таваллуд</p>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700 ml-5.5">{studentbyid.birth_year}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Phone className="w-3.5 h-3.5" />
                                        <p className="text-[11px] uppercase font-bold tracking-wider">Телефони волидайн</p>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700 ml-5.5">{studentbyid.parent_phone}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Hash className="w-3.5 h-3.5" />
                                        <p className="text-[11px] uppercase font-bold tracking-wider">ID-и Хонанда</p>
                                    </div>
                                    <p className="text-sm font-mono font-bold text-blue-600 ml-5.5">#{studentbyid.id}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        <p className="text-[11px] uppercase font-bold tracking-wider">Иҷораҳои фаъол</p>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 ml-5.5">
                                        {studentbyid.active_rentals_count} адад
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <FileText className="w-3.5 h-3.5" />
                                    <p className="text-[11px] uppercase font-bold tracking-wider">Эзоҳи иловагӣ</p>
                                </div>
                                <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                                    <p className="text-sm text-slate-600 leading-relaxed italic">
                                        {studentbyid.notes || "Ягон эзоҳ илова нашудааст."}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-6 border-t">
                                <Button
                                    variant="outline"
                                    className="rounded-xl h-11 font-semibold text-slate-600 hover:bg-slate-50"
                                    onClick={() => {
                                        setIdx(null);
                                        setIsEditOpen(true);
                                    }}
                                >
                                    Таҳрир кардан
                                </Button>
                                <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl h-11 font-semibold shadow-md shadow-blue-200">
                                    Додани китоб
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto border-none shadow-2xl">
                    <DialogHeader className="space-y-1">
                        <div className='flex  items-center gap-2'>
                            <div className="p-3 bg-blue-50 w-fit rounded-2xl">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-slate-800">Таҳрири профил</DialogTitle>
                                <p className="text-slate-500 text-sm">Маълумоти хонандаро навсозӣ кунед</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-2 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="last_name" className="text-sm font-semibold text-slate-700">Насаб</Label>
                                <Input
                                    id="last_name"
                                    className="rounded-xl border-slate-200 focus:ring-blue-500"
                                    value={editData?.last_name || ""}
                                    onChange={(e) => setEditData({ ...editData, last_name: e.target.value } as IGetStudents)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="first_name" className="text-sm font-semibold text-slate-700">Ном</Label>
                                <Input
                                    id="first_name"
                                    className="rounded-xl border-slate-200 focus:ring-blue-500"
                                    value={editData?.first_name || ""}
                                    onChange={(e) => setEditData({ ...editData, first_name: e.target.value } as IGetStudents)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="middle_name" className="text-sm font-semibold text-slate-700">Номи падар</Label>
                            <Input
                                id="middle_name"
                                className="rounded-xl border-slate-200"
                                value={editData?.middle_name || ""}
                                onChange={(e) => setEditData({ ...editData, middle_name: e.target.value })}
                            />
                        </div>

                        {/* Блоки Синф ва Соли таваллуд */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="class_name" className="text-sm font-semibold text-slate-700">Синф</Label>
                                <Input
                                    id="class_name"
                                    className="rounded-xl border-slate-200"
                                    value={editData?.class_name || ""}
                                    onChange={(e) => setEditData({ ...editData, class_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="birth_year" className="text-sm font-semibold text-slate-700">Соли таваллуд</Label>
                                <Input
                                    id="birth_year"
                                    type="number"
                                    className="rounded-xl border-slate-200"
                                    value={editData?.birth_year || ""}
                                    onChange={(e) => setEditData({ ...editData, birth_year: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        {/* Телефони волидайн */}
                        <div className="space-y-2">
                            <Label htmlFor="parent_phone" className="text-sm font-semibold text-slate-700">Телефони волидайн</Label>
                            <Input
                                id="parent_phone"
                                className="rounded-xl border-slate-200"
                                value={editData?.parent_phone || ""}
                                onChange={(e) => setEditData({ ...editData, parent_phone: e.target.value })}
                            />
                        </div>

                        {/* Эзоҳ ва Статус */}
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-sm font-semibold text-slate-700">Эзоҳ</Label>
                            <Textarea
                                id="notes"
                                className="rounded-xl border-slate-200 min-h-13.5"
                                value={editData?.notes || ""}
                                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <input
                                type="checkbox"
                                id="is_active"
                                className="w-4 h-4 text-blue-600 rounded"
                                checked={editData?.is_active || false}
                                onChange={(e) => setEditData({ ...editData, is_active: e.target.checked })}
                            />
                            <Label htmlFor="is_active" className="text-sm font-medium text-slate-700 cursor-pointer">
                                Ҳолати фаъол (Active)
                            </Label>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t gap-2">
                        <Button
                            variant="outline"
                            className="rounded-xl px-6"
                            onClick={() => setIsEditOpen(false)}
                        >
                            Бекор кардан
                        </Button>
                        <Button
                            disabled={isUpdating} // Ҳангоми боргузорӣ тугмаро ғайрифаъол мекунем
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg shadow-blue-200"
                            onClick={handleUpdate}
                        >
                            {isUpdating ? "Дар ҳоли захира..." : "Захира кардан"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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

                <div className="overflow-x-auto md:max-w-full max-w-84 border rounded-lg">
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
                                <tr key={student.id} onClick={() => setIdx(student.id)} className="hover:bg-gray-50/50 transition-colors">
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