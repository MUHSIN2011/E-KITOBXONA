'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Truck, Hash, School, Book, CheckCircle2, MapPin, Package, ArrowRight, Loader2, MessageSquare, ListChecks } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import {
    useGetRegionsQuery,
    useGetDistrictsQuery,
    useGetSchoolsByDistrictQuery,
    useGetTextbooksQuery,
    useGetBooksSchoolQuery,
    useAddSuppliesMutation,
    useFulfillBookRequestMutation
} from '@/api/api'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import { useTranslations } from 'next-intl'

interface Region {
    id: number;
    name: string;
}
function DeliveryPage() {
    const searchParams = useSearchParams()
    const [selectedRegion, setSelectedRegion] = useState<string>(searchParams.get('region_id') || '')
    const [selectedDistrict, setSelectedDistrict] = useState<string>('')
    const [selectedSchool, setSelectedSchool] = useState<string>('')

    const { data: regions, isLoading: regionsLoading } = useGetRegionsQuery()
    const { data: districts, isLoading: districtsLoading } = useGetDistrictsQuery(Number(selectedRegion), { skip: !selectedRegion })
    const { data: schools, isLoading: schoolsLoading } = useGetSchoolsByDistrictQuery(Number(selectedDistrict), { skip: !selectedDistrict })
    const { data: textbooks } = useGetTextbooksQuery('all')
    const t = useTranslations('TransferPage')

    const [formData, setFormData] = useState({
        textbook_id: '',
        to_school_id: '',
        total_quantity: 1,
        condition: 'new',
        is_new_books: true,
        textbook_copy_ids: [] as number[],
        notes: ''
    })

    useEffect(() => {
        const rId = searchParams.get('region_id');
        const dId = searchParams.get('district_id');
        const sId = searchParams.get('school_id');
        const tId = searchParams.get('textbook_id');
        const qty = searchParams.get('quantity');

        const isValid = (val: string | null) => val && val !== 'undefined' && val !== 'null';

        if (isValid(rId)) {
            setSelectedRegion(rId as string);
        } else {
            setSelectedRegion('');
        }

        if (isValid(dId)) {
            setSelectedDistrict(dId as string);
        } else {
            setSelectedDistrict('');
        }

        setFormData(prev => ({
            ...prev,
            to_school_id: isValid(sId) ? (sId as string) : '',
            textbook_id: isValid(tId) ? (tId as string) : '',
            total_quantity: qty ? Number(qty) : prev.total_quantity
        }));

    }, [searchParams]);

    const { data: copiesData } = useGetBooksSchoolQuery(
        {
            textbook_id: Number(formData.textbook_id),
            skip: 0,
            limit: 1000
        },
        { skip: !formData.textbook_id || formData.is_new_books }
    );

    const [createSupply, { isLoading: isPosting, isSuccess, reset }] = useAddSuppliesMutation()

    const isValid = formData.is_new_books
        ? !!(formData.textbook_id && formData.to_school_id && formData.total_quantity > 0)
        : !!(formData.textbook_id && formData.to_school_id && formData.textbook_copy_ids.length > 0)

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                reset()
                setFormData({
                    textbook_id: '',
                    to_school_id: '',
                    total_quantity: 1,
                    condition: 'new',
                    is_new_books: true,
                    textbook_copy_ids: [],
                    notes: ''
                })
                setSelectedRegion('')
                setSelectedDistrict('')
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [isSuccess, reset])

    const handleCopyToggle = (copyId: number) => {
        setFormData(prev => {
            const isSelected = prev.textbook_copy_ids.includes(copyId)
            const newIds = isSelected
                ? prev.textbook_copy_ids.filter(id => id !== copyId)
                : [...prev.textbook_copy_ids, copyId]

            return {
                ...prev,
                textbook_copy_ids: newIds,
                total_quantity: newIds.length
            }
        })
    }
    const [fulfillRequest] = useFulfillBookRequestMutation();

    const handleDelivery = async () => {
        if (!isValid) return;

        const requestIdFromUrl = searchParams.get('request_id');

        const payload: any = {
            to_school_id: Number(formData.to_school_id),
            textbook_id: Number(formData.textbook_id),
            total_quantity: Number(formData.total_quantity),
            condition: formData.condition,
            is_new_books: formData.is_new_books,
            notes: formData.notes
        };

        if (!formData.is_new_books) {
            payload.textbook_copy_ids = formData.textbook_copy_ids;
        }

        try {
            const supplyResponse = await createSupply(payload).unwrap();
            toast.success("Дархост бо муваффақият иҷро шуд!")

            
            if (requestIdFromUrl && requestIdFromUrl !== 'undefined') {
                await fulfillRequest({
                    requestId: Number(requestIdFromUrl),
                    supplyId: supplyResponse.id
                }).unwrap();
                toast.success("Дархост бо муваффақият иҷро шуд!")
            }

        } catch (err) {
            console.error(err);
            toast.error("Хатогӣ ҳангоми амалиёт");
        }
    };


    return (
        <div className="min-h-screen p-3 sm:p-4 md:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
            <Toaster position="top-center" />

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3 sm:space-y-4">
                <div className="inline-flex items-center justify-center gap-3 sm:gap-4 bg-white/80 dark:bg-gray-800 backdrop-blur-sm px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
                        <Truck className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    </div>
                    <div className="text-left">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                            {t('title')}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-medium">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border border-blue-100 dark:border-gray-700 py-0 shadow-xl overflow-hidden bg-white/90 dark:bg-gray-800 backdrop-blur-md">
                    <CardHeader className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-4 sm:p-5 md:p-6">
                        <CardTitle className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                                <MapPin size={16} className="sm:w-5 sm:h-5 text-blue-300" />
                            </div>
                            <div>
                                <span>{t('location.title')}</span>
                                <p className="text-xs sm:text-sm font-normal text-blue-200 mt-0.5 sm:mt-1">
                                    {t('location.description')}
                                </p>
                            </div>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-5 md:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                            {/* Region Select */}
                            <div className="space-y-2 sm:space-y-3">
                                <Label className="text-slate-700 dark:text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    {t('location.region.label')}
                                </Label>
                                <Select
                                    value={selectedRegion}
                                    onValueChange={(v) => {
                                        setSelectedRegion(v);
                                        setSelectedDistrict('');
                                        setSelectedSchool('');
                                    }}
                                >
                                    <SelectTrigger className="h-10 sm:h-11 md:h-12 dark:border-gray-600 dark:bg-gray-900 text-sm">
                                        <SelectValue placeholder={t('location.region.placeholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regionsLoading ? (
                                            <div className="flex justify-center py-4">
                                                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-blue-600 border-t-transparent"></div>
                                            </div>
                                        ) : (
                                            regions?.map((r: Region) => (
                                                <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* District Select */}
                            <div className="space-y-2 sm:space-y-3">
                                <Label className="text-slate-700 dark:text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                    {t('location.district.label')}
                                </Label>
                                <Select
                                    disabled={!selectedRegion}
                                    value={selectedDistrict}
                                    onValueChange={(v) => {
                                        setSelectedDistrict(v);
                                        setSelectedSchool('');
                                    }}
                                >
                                    <SelectTrigger className="h-10 sm:h-11 md:h-12 dark:border-gray-600 dark:bg-gray-900 text-sm">
                                        <SelectValue placeholder={t('location.district.placeholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts?.map((d: any) => (
                                            <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* School Select */}
                            <div className="space-y-2 sm:space-y-3">
                                <Label className="font-semibold flex items-center gap-2 text-blue-800 dark:text-blue-400 text-sm sm:text-base">
                                    <School size={14} className="sm:w-4 sm:h-4" />
                                    {t('location.school.label')}
                                </Label>
                                <Select
                                    disabled={!selectedDistrict}
                                    value={selectedSchool}
                                    onValueChange={(v) => setFormData({ ...formData, to_school_id: v })}
                                >
                                    <SelectTrigger className="h-10 sm:h-11 md:h-12 dark:border-gray-600 dark:bg-gray-900 text-sm">
                                        <SelectValue placeholder={t('location.school.placeholder')} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {schools?.map((s: any) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Book Section */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border border-blue-100 dark:border-gray-700 py-0 shadow-xl overflow-hidden bg-white/90 dark:bg-gray-800 backdrop-blur-md">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-5 md:p-6">
                        <CardTitle className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                                <Book size={16} className="sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <span>{t('book.title')}</span>
                                <p className="text-xs sm:text-sm font-normal text-blue-100 mt-0.5 sm:mt-1">
                                    {t('book.description')}
                                </p>
                            </div>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                        {/* Book Type Switch */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 gap-3 sm:gap-0">
                            <div className="space-y-0.5 sm:space-y-1">
                                <Label className="text-sm sm:text-base font-bold dark:text-white text-slate-800">
                                    {t('book.bookType.label')}
                                </Label>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">
                                    {formData.is_new_books ? t('book.bookType.new') : t('book.bookType.old')}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-gray-800 p-1.5 sm:p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <span className={`text-[10px] sm:text-xs font-bold ${!formData.is_new_books ? 'text-blue-600' : 'text-slate-400'}`}>
                                    {t('book.bookType.oldBadge')}
                                </span>
                                <Switch
                                    checked={formData.is_new_books}
                                    onCheckedChange={(v) => setFormData({ ...formData, is_new_books: v, textbook_copy_ids: [] })}
                                />
                                <span className={`text-[10px] sm:text-xs font-bold ${formData.is_new_books ? 'text-blue-600' : 'text-slate-400'}`}>
                                    {t('book.bookType.newBadge')}
                                </span>
                            </div>
                        </div>

                        {/* Book Selection Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                            {/* Book Select */}
                            <div className="space-y-2 sm:space-y-3">
                                <Label className="text-slate-700 dark:text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                                    <Book size={14} className="sm:w-4 sm:h-4 text-blue-500" />
                                    {t('book.bookSelect.label')}
                                </Label>
                                <Select value={formData.textbook_id} onValueChange={(v) => setFormData({ ...formData, textbook_id: v, textbook_copy_ids: [] })}>
                                    <SelectTrigger className="min-h-[50px] sm:min-h-[60px] h-auto dark:border-gray-600 dark:bg-gray-900 text-sm">
                                        <SelectValue placeholder={t('book.bookSelect.placeholder')} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[400px]">
                                        <SelectContent className="max-h-[400px]">
                                            {textbooks?.items
                                                ?.filter((book: any) => book.is_new === formData.is_new_books)
                                                ?.map((book: any) => (
                                                    <SelectItem key={book.id} value={book.id.toString()}>
                                                        <div className="flex flex-col py-1">
                                                            <span className="font-bold text-sm">{book.title}</span>
                                                            <span className="text-[10px] sm:text-xs text-slate-500">
                                                                {t('book.bookSelect.grade', { grade: book.grade, author: book.author })}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.is_new_books && (
                                <div className="space-y-2 sm:space-y-3">
                                    <Label className="text-slate-700 dark:text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                                        <Hash size={14} className="sm:w-4 sm:h-4 text-blue-500" />
                                        {t('book.quantity.label')}
                                    </Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        className="h-10 sm:h-11 md:h-12 text-base sm:text-lg font-bold dark:border-gray-600 dark:bg-gray-900"
                                        value={formData.total_quantity}
                                        onChange={(e) => setFormData({ ...formData, total_quantity: Math.max(1, Number(e.target.value)) })}
                                    />
                                </div>
                            )}

                            <div className="space-y-2 sm:space-y-3 lg:col-span-1">
                                <Label className="text-slate-700 dark:text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                                    <MessageSquare size={14} className="sm:w-4 sm:h-4 text-blue-500" />
                                    {t('book.notes.label')}
                                </Label>
                                <Input
                                    placeholder={t('book.notes.placeholder')}
                                    className="h-10 sm:h-11 md:h-12 dark:border-gray-600 dark:bg-gray-900 text-sm"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {!formData.is_new_books && formData.textbook_id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-3 border-t pt-4"
                                >
                                    <Label className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
                                        <ListChecks size={16} /> {t('book.copies.label')}
                                    </Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto p-3 bg-slate-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-blue-200 dark:border-blue-800 shadow-inner">
                                        {textbooks?.items?.filter((e) => e.is_new == false)
                                            .map((copy: any) => (
                                                <div
                                                    key={copy.id}
                                                    onClick={() => handleCopyToggle(copy.id)}
                                                    className={`p-2 border rounded-lg cursor-pointer text-[10px] sm:text-xs flex justify-between items-center transition-all duration-200 ${formData.textbook_copy_ids.includes(copy.id)
                                                        ? 'bg-blue-600 text-white border-blue-700 shadow-md transform scale-[0.98]'
                                                        : 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-700'
                                                        }`}
                                                >
                                                    <span className="truncate">
                                                        {t('book.copies.inventory', { number: copy.inventory_number || copy.id })}
                                                    </span>
                                                    {formData.textbook_copy_ids.includes(copy.id) && <CheckCircle2 size={12} />}
                                                </div>
                                            ))}
                                        {(!textbooks?.items || textbooks.items.length === 0) && (
                                            <p className="col-span-full text-center text-slate-400 py-4 italic text-xs sm:text-sm">
                                                {t('book.copies.notFound')}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                                        {t('book.copies.selected', { count: formData.textbook_copy_ids.length })}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="pt-3 sm:pt-4">
                            <Button
                                onClick={handleDelivery}
                                disabled={!isValid || isPosting}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 sm:h-14 md:h-16 text-base sm:text-lg md:text-xl font-black shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {isPosting ? <Loader2 className="animate-spin mr-2 w-4 h-4 sm:w-5 sm:h-5" /> : <span>{t('button')}</span>}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

export default DeliveryPage