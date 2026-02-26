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
} from '@/src/api/api'
import { useSearchParams } from 'next/navigation'

interface Region {
    id: number;
    name: string;
}
function DeliveryPage() {
    const searchParams = useSearchParams()
    const [selectedRegion, setSelectedRegion] = useState<string>(searchParams.get('region_id') || '')
    const [selectedDistrict, setSelectedDistrict] = useState<string>('')

    const { data: regions, isLoading: regionsLoading } = useGetRegionsQuery()
    const { data: districts, isLoading: districtsLoading } = useGetDistrictsQuery(Number(selectedRegion), { skip: !selectedRegion })
    const { data: schools, isLoading: schoolsLoading } = useGetSchoolsByDistrictQuery(Number(selectedDistrict), { skip: !selectedDistrict })
    const { data: textbooks } = useGetTextbooksQuery('all')

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
            }, 3000)
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

            if (requestIdFromUrl && requestIdFromUrl !== 'undefined') {
                await fulfillRequest({
                    requestId: Number(requestIdFromUrl),
                    supplyId: supplyResponse.id
                }).unwrap();
                console.log("Дархост бо муваффақият иҷро шуд!");
            }

        } catch (err) {
            console.error(err);
            alert("Хатогӣ ҳангоми амалиёт");
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8 max-w-6xl mx-auto space-y-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center gap-4 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-blue-100">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
                        <Truck className="text-white" size={32} />
                    </div>
                    <div className="text-left">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                            Интиқоли Китобҳо
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">Системаи марказонидашудаи тақсимоти китобҳои дарсӣ</p>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border border-blue-100 py-0 shadow-xl overflow-hidden bg-white/90 backdrop-blur-md">
                    <CardHeader className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-6">
                        <CardTitle className="text-xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <MapPin size={20} className="text-blue-300" />
                            </div>
                            <div>
                                <span>Маълумоти ҷойгиршавӣ</span>
                                <p className="text-sm font-normal text-blue-200 mt-1">Вилоят, ноҳия ва мактаби таълимӣ</p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <Label className="text-slate-700 font-semibold flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Вилоят / Регион
                            </Label>
                            <Select
                                value={selectedRegion}
                                onValueChange={(v) => {
                                    setSelectedRegion(v);
                                    setSelectedDistrict('');
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Вилоятро интихоб кунед..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {regionsLoading ? (
                                        <SelectContent>
                                            <SelectItem
                                                value="loading-test"
                                                disabled
                                                className="w-full flex justify-center items-center py-3"
                                            >
                                                <div className="flex items-center justify-center w-full min-w-[150px]">
                                                    <div className="animate-spin rounded-full  h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                                                </div>
                                            </SelectItem>

                                            <SelectItem value="1">Loading...</SelectItem>
                                        </SelectContent>
                                    ) : (
                                        regions?.map((r: Region) => (
                                            <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-slate-700 font-semibold flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                Шаҳр / Ноҳия
                            </Label>
                            <Select
                                disabled={!selectedRegion}
                                value={selectedDistrict}
                                onValueChange={(v) => { setSelectedDistrict(v); setFormData({ ...formData, to_school_id: '' }) }}
                            >
                                <SelectTrigger className="h-12 border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white shadow-sm">
                                    <SelectValue placeholder="Ноҳияро интихоб кунед..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts?.map((d: any) => (
                                        <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-slate-700 font-semibold flex items-center gap-2 text-blue-600">
                                <School size={16} />
                                Мактаби таълимӣ
                            </Label>
                            <Select
                                disabled={!selectedDistrict}
                                value={formData.to_school_id || ''}
                                onValueChange={(v) => setFormData({ ...formData, to_school_id: v })}
                            >
                                <SelectTrigger className="h-12 border-blue-200 focus:ring-2 focus:ring-blue-500 bg-white shadow-sm">
                                    <SelectValue placeholder="Мактабро интихоб кунед..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {schools?.map((s: any) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border border-blue-100 py-0 shadow-xl overflow-hidden bg-white/90 backdrop-blur-md">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                        <CardTitle className="text-xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Book size={20} />
                            </div>
                            <div>
                                <span>Маълумоти нашрия ва миқдор</span>
                                <p className="text-sm font-normal text-blue-100 ">Китоби дарсӣ ва ҳолати техникӣ</p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                            <div className="space-y-1">
                                <Label className="text-base font-bold text-slate-800">Навъи китобҳо</Label>
                                <p className="text-sm text-slate-500">
                                    {formData.is_new_books ? "Китобҳои нав (ворид кардани инвентар аз тарафи мактаб)" : "Китобҳои кӯҳна (бо инвентари мавҷуда)"}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border">
                                <span className={`text-xs font-bold ${!formData.is_new_books ? 'text-blue-600' : 'text-slate-400'}`}>КӮҲНА</span>
                                <Switch checked={formData.is_new_books} onCheckedChange={(v) => setFormData({ ...formData, is_new_books: v, textbook_copy_ids: [] })} />
                                <span className={`text-xs font-bold ${formData.is_new_books ? 'text-blue-600' : 'text-slate-400'}`}>НАВ</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                                    <Book size={16} className="text-blue-500" />
                                    Номи китоби дарсӣ
                                </Label>
                                <Select value={formData.textbook_id} onValueChange={(v) => setFormData({ ...formData, textbook_id: v, textbook_copy_ids: [] })}>
                                    <SelectTrigger className="min-h-[60px] h-auto border-slate-200 bg-white shadow-sm">
                                        <SelectValue placeholder="Китобро интихоб кунед..." />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[400px]">
                                        {textbooks?.items?.map((book: any) => (
                                            <SelectItem key={book.id} value={book.id.toString()}>
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{book.title}</span>
                                                    <span className="text-xs text-slate-500">Синфи {book.grade} • {book.author}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <Label className="text-slate-700 font-semibold flex items-center gap-2">
                                        <Hash size={16} className="text-blue-500" />
                                        Миқдор
                                    </Label>
                                    <Input
                                        type="number"
                                        disabled={!formData.is_new_books}
                                        min="1"
                                        className="h-14 text-lg font-bold border-slate-200"
                                        value={formData.total_quantity}
                                        onChange={(e) => setFormData({ ...formData, total_quantity: Math.max(1, Number(e.target.value)) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                                    <MessageSquare size={16} className="text-blue-500" />
                                    Эзоҳ (Notes)
                                </Label>
                                <Input
                                    placeholder="Маълумоти иловагӣ..."
                                    className="h-12 border-slate-200"
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
                                    <Label className="flex items-center gap-2 text-blue-700 font-bold">
                                        <ListChecks size={18} /> Интихоби нусхаҳои мушаххас:
                                    </Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto p-3 bg-slate-50 rounded-xl border border-dashed border-blue-200 shadow-inner">
                                        {copiesData?.items?.map((copy: any) => (
                                            <div
                                                key={copy.id}
                                                onClick={() => handleCopyToggle(copy.id)}
                                                className={`p-2 border rounded-lg cursor-pointer text-xs flex justify-between items-center transition-all duration-200 ${formData.textbook_copy_ids.includes(copy.id)
                                                    ? 'bg-blue-600 text-white border-blue-700 shadow-md transform scale-[0.98]'
                                                    : 'bg-white hover:bg-blue-50 text-slate-700 border-slate-200'
                                                    }`}
                                            >
                                                <span className="truncate">№ {copy.inventory_number || copy.id}</span>
                                                {formData.textbook_copy_ids.includes(copy.id) && <CheckCircle2 size={12} />}
                                            </div>
                                        ))}
                                        {(!copiesData?.items || copiesData.items.length === 0) && (
                                            <p className="col-span-full text-center text-slate-400 py-4 italic text-sm">Нусхаҳо ёфт нашуданд</p>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Ҷамъ: {formData.textbook_copy_ids.length} нусха интихоб шуд</p>
                                </motion.div>
                            )}
                        </AnimatePresence>


                        <div className="pt-4">
                            <Button
                                onClick={handleDelivery}
                                disabled={!isValid || isPosting}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-16 text-xl font-black shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {isPosting ? <Loader2 className="animate-spin mr-2" /> : <span>ТАСДИҚИ ИНТИҚОЛ</span>}
                            </Button>

                            <AnimatePresence>
                                {isSuccess && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-xl border border-green-200 justify-center font-bold">
                                        <CheckCircle2 size={24} />
                                        Поставка бо муваффақият эҷод шуд!
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

export default DeliveryPage