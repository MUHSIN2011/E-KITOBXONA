"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TextAnimate } from '@/components/ui/text-animate'
import { IAddNewStudentRequest, IGetStudents, useAddNewStudentMutation, useDeleteStudentMutation, useGetStudentByIdQuery, useGetStudentsQuery, useUpdateStudentMutation } from '@/api/api'
import CardsStudent from '@/components/CardsStudent'
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
import toast, { Toaster } from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useTranslations } from 'next-intl'


function StudentsPage() {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const limit = 10;
    const [open, setOpen] = useState(false);
    const [idx, setIdx] = useState<number | null>(null);
    const t = useTranslations('StudentsPage')
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
    const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();

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
    const studentsWithActiveBooks = students?.items?.filter(
        (student) => (student.active_rentals_count || 0) > 0
    ).length || 0;
    useEffect(() => {
        if (studentbyid) {
            setEditData(studentbyid);
        }
    }, [studentbyid]);

    if (isLoading) return <div className="flex h-[84vh] items-center justify-center">
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
            <Toaster />
            <div className='flex md:flex-row flex-col justify-between md:gap-0 gap-2 md:items-center'>
                <div>
                    <TextAnimate className='text-2xl font-bold' animation="slideUp" by="word">
                        {t("title")}
                    </TextAnimate>
                    <TextAnimate className='text-foreground text-sm' animation="slideUp" by="word">
                        {t("subtitle")}
                    </TextAnimate>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger className='bg-[#0950c3] dark:bg-[#2563eb] hover:bg-blue-700 dark:hover:bg-blue-600  text-white md:py-2.5  py-2 px-4 md:w-40 w-full rounded-sm text-sm font-medium'>
                        {t("addButton")}
                    </DialogTrigger>

                    <DialogContent className='max-h-[95vh] dark:bg-[#1a1a1a] h-auto bg-gray-50 overflow-y-auto sm:max-w-[500px]'>
                        <DialogHeader>
                            <DialogTitle>{t("dialogTitle")}</DialogTitle>
                            <DialogDescription>{t("dialogDescription")}</DialogDescription>
                        </DialogHeader>

                        <form id="student-form" onSubmit={handleSubmitStudent(onSubmit)} className='my-3 flex flex-col gap-4'>
                            <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                                <div className='flex flex-col gap-1'>
                                    <Label className='text-sm font-medium'>{t("formLabels.lastName")}</Label>
                                    <Input {...registerStudent("last_name", {
                                        required: t("formErrors.lastNameRequired"),
                                        validate: (value) => {
                                            if (value.trim() === "") {
                                                return t("formErrors.lastNameRequired");
                                            }
                                            else if (value.length < 2) {
                                                return t("formErrors.lastNameMinLength");
                                            }
                                            else if (value.charAt(0) !== value.charAt(0).toUpperCase()) {
                                                return t("formErrors.lastNameCapital");
                                            }
                                            return true;
                                        }
                                    })} {...registerStudent("last_name", { required: true })} placeholder={t("formPlaceholders.lastName")} />
                                    {
                                        studentErrors.last_name && (
                                            <span className="text-xs text-red-500">{studentErrors.last_name.message}</span>
                                        )
                                    }
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-sm font-medium'>{t("formLabels.firstName")}</label>
                                    <Input {...registerStudent("first_name", {
                                        required: t("formErrors.firstNameRequired"),
                                        validate: (value) => {
                                            if (value.trim() === "") {
                                                return t("formErrors.firstNameRequired");
                                            }
                                            else if (value.length < 2) {
                                                return t("formErrors.firstNameMinLength");
                                            }
                                            else if (value.charAt(0) !== value.charAt(0).toUpperCase()) {
                                                return t("formErrors.firstNameCapital");
                                            }
                                            return true;
                                        }
                                    })} placeholder={t("formPlaceholders.firstName")} />
                                    {
                                        studentErrors.first_name && (
                                            <span className="text-xs text-red-500">{studentErrors.first_name.message}</span>
                                        )
                                    }
                                </div>
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium'>{t("formLabels.middleName")}</label>
                                <Input {...registerStudent("middle_name", { required: true })} placeholder={t("formPlaceholders.middleName")} />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-sm font-medium'>{t("formLabels.class")}</label>
                                    <Input
                                        placeholder={t("formPlaceholders.class")}
                                        maxLength={3}
                                        {...registerStudent("class_name", {
                                            required: t("formErrors.classRequired"),
                                            validate: (value) => {
                                                const classRegex = /^[1-9][0-1]?[A-ZА-Я]$/i;

                                                const grade = parseInt(value);
                                                const hasLetter = /[A-ZА-Я]/.test(value.slice(-1));

                                                if (isNaN(grade) || grade < 1 || grade > 11) {
                                                    return t("formErrors.classRange");
                                                }

                                                if (!hasLetter) {
                                                    return t("formErrors.classFull");
                                                }
                                                if (!classRegex.test(value)) {
                                                    return t("formErrors.classLowercase");
                                                }

                                                return true;
                                            }
                                        })}
                                    />
                                    {studentErrors.class_name && (
                                        <span className="text-xs text-red-500">{studentErrors.class_name.message}</span>
                                    )}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-sm font-medium'>{t("formLabels.birthYear")}</label>
                                    <Input {...registerStudent("birth_year", {
                                        required: t("formErrors.birthYearRequired"),
                                        validate: (value: string | number) => {
                                            const year = parseInt(value as string);
                                            if (isNaN(year) || year < 2000 || year > 2020) {
                                                return t("formErrors.birthYearRange");
                                            }
                                            return true;
                                        }
                                    })} type="number" placeholder={t("formPlaceholders.birthYear")} />
                                    {studentErrors.birth_year && (
                                        <span className="text-xs text-red-500">{studentErrors.birth_year.message}</span>
                                    )}
                                </div>
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium'>{t("formLabels.parentPhone")}</label>
                                <Input
                                    {...registerStudent("parent_phone", {
                                        required: t("formErrors.parentPhoneRequired"),
                                        validate: (value) => {
                                            const phoneRegex = /^\+992\d{9}$/;

                                            if (!value.startsWith("+992")) {
                                                return t("formErrors.parentPhoneStart");
                                            }

                                            if (value.length !== 13) {
                                                return t("formErrors.parentPhoneLength");
                                            }

                                            if (!phoneRegex.test(value)) {
                                                return t("formErrors.parentPhoneFormat");
                                            }

                                            return true;
                                        }
                                    })}
                                    defaultValue="+992"
                                    maxLength={13}
                                    placeholder={t("formPlaceholders.parentPhone")}
                                    onChange={(e) => {
                                        if (!e.target.value.startsWith("+992")) {
                                            e.target.value = "+992";
                                        }
                                    }}
                                />
                                {studentErrors.parent_phone && (
                                    <span className="text-xs text-red-500">{studentErrors.parent_phone.message}</span>
                                )}
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium'>{t("formLabels.notes")}</label>
                                <Textarea {...registerStudent("notes")} className='max-h-24 md:max-w-112 max-w-77' placeholder={t("formPlaceholders.notes")} />
                            </div>
                        </form>

                        <DialogFooter className="gap-2 sm:gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">{t("dialogButtons.cancel")}</Button>
                            </DialogClose>
                            <Button
                                disabled={isAdding}
                                type="submit"
                                form="student-form"
                                className='bg-[#0950c3] text-white hover:bg-[#063d95]'
                            >
                                {isAdding ? t("dialogButtons.adding") : t("dialogButtons.add")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <CardsStudent
                    Icons={<Users className="text-blue-500" />}
                    NameRole={t("stats.totalStudents")}
                    cnt={totalItems.toString()}
                />
                <CardsStudent
                    Icons={<Book className="text-green-500" />}
                    NameRole={t("stats.activeRentals")}
                    cnt={studentsWithActiveBooks.toString()}
                />
                <CardsStudent
                    Icons={<DollarSign className="text-red-500" />}
                    NameRole={t("stats.withCompensation")}
                    cnt={'2'}
                />
            </div>


            <Sheet open={!!idx} onOpenChange={() => setIdx(null)}>
                <SheetContent className="sm:max-w-[500px] overflow-y-auto px-0">
                    <SheetHeader className="px-6 pb-6 pt-2 bg-gradient-to-r from-blue-50 to-white border-b">
                        <div className="flex justify-between items-start pt-4">
                            <SheetTitle className="text-2xl font-bold flex items-center gap-3 text-slate-800">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                {t('profile.title')}
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
                                            {t('profile.class', { className: studentbyid.class_name })}
                                        </span>
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${studentbyid.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {studentbyid.is_active ? t('profile.active') : t('profile.inactive')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <p className="text-[11px] uppercase font-bold tracking-wider">{t('profile.birthYear')}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700 ml-5.5">{studentbyid.birth_year}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Phone className="w-3.5 h-3.5" />
                                        <p className="text-[11px] uppercase font-bold tracking-wider">{t('profile.parentPhone')}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700 ml-5.5">{studentbyid.parent_phone}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Hash className="w-3.5 h-3.5" />
                                        <p className="text-[11px] uppercase font-bold tracking-wider">{t('profile.studentId')}</p>
                                    </div>
                                    <p className="text-sm font-mono font-bold text-blue-600 ml-5.5">#{studentbyid.id}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        <p className="text-[11px] uppercase font-bold tracking-wider">{t('profile.activeRentals')}</p>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 ml-5.5">
                                        {t('profile.activeRentalsCount', { count: studentbyid.active_rentals_count })}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <FileText className="w-3.5 h-3.5" />
                                    <p className="text-[11px] uppercase font-bold tracking-wider">{t('profile.notes')}</p>
                                </div>
                                <div className="p-4 bg-blue-50/50 border border-blue-300 rounded-xl">
                                    <p className="text-sm text-slate-600 leading-relaxed italic">
                                        {studentbyid.notes || t('profile.noNotes')}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-6 border-t">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="rounded-xl h-11 cursor-pointer font-semibold text-slate-600 hover:bg-slate-50"
                                        >
                                            {t('profile.delete')}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>{t('profile.deleteDialog.title')}</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {t('profile.deleteDialog.description')}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="gap-2">
                                            <AlertDialogCancel className="rounded-xl border-slate-200">
                                                {t('profile.deleteDialog.cancel')}
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                                                onClick={() => {
                                                    setIdx(null);
                                                    deleteStudent({ student_id: studentbyid.id });
                                                    toast.success(t('profile.deleteSuccess'));
                                                }}
                                            >
                                                {t('profile.deleteDialog.confirm')}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <Button onClick={() => {
                                    setIdx(null);
                                    setIsEditOpen(true);
                                }} className="bg-blue-600 hover:bg-blue-700 rounded-xl h-11 font-semibold shadow-md shadow-blue-200">
                                    {t('profile.edit')}
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto border-none shadow-2xl">
                    <DialogHeader className="space-y-1">
                        <div className='flex items-center gap-2'>
                            <div className="p-3 bg-blue-50 w-fit rounded-2xl">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-slate-800">{t('edit.title')}</DialogTitle>
                                <p className="text-slate-500 text-sm">{t('edit.subtitle')}</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-2 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="last_name" className="text-sm font-semibold text-slate-700">{t('edit.labels.lastName')}</Label>
                                <Input
                                    id="last_name"
                                    className="rounded-xl border-slate-200 focus:ring-blue-500"
                                    value={editData?.last_name || ""}
                                    onChange={(e) => setEditData({ ...editData, last_name: e.target.value } as IGetStudents)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="first_name" className="text-sm font-semibold text-slate-700">{t('edit.labels.firstName')}</Label>
                                <Input
                                    id="first_name"
                                    className="rounded-xl border-slate-200 focus:ring-blue-500"
                                    value={editData?.first_name || ""}
                                    onChange={(e) => setEditData({ ...editData, first_name: e.target.value } as IGetStudents)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="middle_name" className="text-sm font-semibold text-slate-700">{t('edit.labels.middleName')}</Label>
                            <Input
                                id="middle_name"
                                className="rounded-xl border-slate-200"
                                value={editData?.middle_name || ""}
                                onChange={(e) => setEditData({ ...editData, middle_name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="class_name" className="text-sm font-semibold text-slate-700">{t('edit.labels.class')}</Label>
                                <Input
                                    id="class_name"
                                    className="rounded-xl border-slate-200"
                                    value={editData?.class_name || ""}
                                    onChange={(e) => setEditData({ ...editData, class_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="birth_year" className="text-sm font-semibold text-slate-700">{t('edit.labels.birthYear')}</Label>
                                <Input
                                    id="birth_year"
                                    type="number"
                                    className="rounded-xl border-slate-200"
                                    value={editData?.birth_year || ""}
                                    onChange={(e) => setEditData({ ...editData, birth_year: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parent_phone" className="text-sm font-semibold text-slate-700">{t('edit.labels.parentPhone')}</Label>
                            <Input
                                id="parent_phone"
                                className="rounded-xl border-slate-200"
                                value={editData?.parent_phone || ""}
                                onChange={(e) => setEditData({ ...editData, parent_phone: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-sm font-semibold text-slate-700">{t('edit.labels.notes')}</Label>
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
                                {t('edit.labels.active')}
                            </Label>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t gap-2">
                        <Button
                            variant="outline"
                            className="rounded-xl px-6"
                            onClick={() => setIsEditOpen(false)}
                        >
                            {t('edit.buttons.cancel')}
                        </Button>
                        <Button
                            disabled={isUpdating}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg shadow-blue-200"
                            onClick={handleUpdate}
                        >
                            {isUpdating ? t('edit.buttons.saving') : t('edit.buttons.save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <section className='py-5 px-3 bg-white dark:bg-[#1a1a1a] rounded-xl border shadow-sm'>
                <h1 className='text-xl font-bold'>{t('list.title')}</h1>
                <p className='text-muted-foreground text-sm mb-4'>{t('list.description')}</p>

                <div className='grid grid-cols-1 md:grid-cols-5 gap-3 mb-4'>
                    <input
                        className='md:col-span-4 rounded-xl px-4 py-2 border focus:cursor-progress bg-[#f9fafb] dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 outline-none transition-all'
                        placeholder={t('list.searchPlaceholder')}
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="relative md:col-span-1">
                        <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                        <Select>
                            <SelectTrigger className="w-full bg-[#f9fafb] cursor-pointer dark:bg-[#1a1a1a] dark:border-gray-500 pl-10 h-10 rounded-xl border-gray-200">
                                <SelectValue placeholder={t('list.filterPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('list.filterAll')}</SelectItem>
                                <SelectItem value="1">1-ум</SelectItem>
                                <SelectItem value="2">2-ум</SelectItem>
                                <SelectItem value="3">3-ум</SelectItem>
                                <SelectItem value="4">4-ум</SelectItem>
                                <SelectItem value="5">5-ум</SelectItem>
                                <SelectItem value="6">6-ум</SelectItem>
                                <SelectItem value="7">7-ум</SelectItem>
                                <SelectItem value="8">8-ум</SelectItem>
                                <SelectItem value="9">9-ум</SelectItem>
                                <SelectItem value="10">10-ум</SelectItem>
                                <SelectItem value="11">11-ум</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto md:max-w-full max-w-84 border rounded-lg">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-[#121212] border-b">
                                <th className="p-4 text-xs font-bold uppercase text-gray-500">{t('list.table.name')}</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500">{t('list.table.class')}</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 text-center">{t('list.table.rentals')}</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500">{t('list.table.phone')}</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500">{t('list.table.notes')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students?.items?.map((student: IGetStudents) => (
                                <tr key={student.id} onClick={() => setIdx(student.id)} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-semibold text-gray-800">{student.first_name} {student.last_name}</div>
                                        <div className="text-xs text-gray-400">{student.middle_name}</div>
                                    </td>
                                    <td className="p-4 text-gray-600">{student.class_name || t('list.table.noData')}</td>
                                    <td className="p-4 text-center">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">0</span>
                                    </td>
                                    <td className="p-4 text-gray-600 text-sm">{student.parent_phone || t('list.table.noData')}</td>
                                    <td className="p-4">
                                        <span className="text-xs py-1 px-2 bg-gray-100 rounded text-gray-500 truncate max-w-[150px] inline-block">
                                            {student.notes || t('list.table.noNotes')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 mt-4 border-t bg-gray-50/50 dark:bg-[#131212] rounded-b-xl">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        {t('list.pagination.showing')} <span className="font-bold text-gray-900 dark:text-gray-600">{startItem}-{endItem}</span> {t('list.pagination.from')} <span className="font-bold text-gray-900 dark:text-gray-600">{totalItems}</span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                            disabled={page === 0}
                            className="px-4 py-2 text-sm font-medium border rounded-lg bg-white dark:bg-[#1a1a1a] cursor-pointer hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                        >
                            {t('list.pagination.prev')}
                        </button>
                        <button
                            onClick={() => setPage((prev) => prev + 1)}
                            disabled={endItem >= totalItems}
                            className="px-4 py-2 text-sm font-medium border rounded-lg bg-white dark:bg-[#1a1a1a] cursor-pointer hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                        >
                            {t('list.pagination.next')}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default StudentsPage