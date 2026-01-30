'use client'
import React, { useState, useEffect } from 'react'
import {
    useGetRegionsQuery,
    useGetDistrictsQuery,
    useGetSchoolsByDistrictQuery,
    useGetTextbooksQuery,
    useAddTextbookCopiesMutation
} from '@/src/api/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Hash, School, Book, CheckCircle2, MapPin, Package, ArrowRight, Loader2 } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

function DeliveryPage() {
    const [selectedRegion, setSelectedRegion] = useState<string>('')
    const [selectedDistrict, setSelectedDistrict] = useState<string>('')

    const { data: regions } = useGetRegionsQuery()
    const { data: districts } = useGetDistrictsQuery(Number(selectedRegion), { skip: !selectedRegion })
    const { data: schools } = useGetSchoolsByDistrictQuery(Number(selectedDistrict), { skip: !selectedDistrict })
    const { data: textbooks } = useGetTextbooksQuery('all')
    const [addCopies, { isLoading: isPosting, isSuccess, reset }] = useAddTextbookCopiesMutation()

    const [formData, setFormData] = useState({
        textbook_id: '',
        school_id: '',
        quantity: 1,
        condition: 'new'
    })


    const isValid = !!(formData.textbook_id && formData.school_id && formData.quantity > 0);


    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                reset()
                setFormData({
                    textbook_id: '',
                    school_id: '',
                    quantity: 1,
                    condition: 'new'
                })
                setSelectedRegion('')
                setSelectedDistrict('')
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isSuccess, reset])

    const handleDelivery = async () => {
        if (!isValid) {
            alert("Лутфан тамоми майдонҳои заруриро пур кунед!")
            return
        }
        try {
            await addCopies({
                textbook_id: Number(formData.textbook_id),
                school_id: Number(formData.school_id),
                quantity: Number(formData.quantity),
                condition: formData.condition
            }).unwrap()
        } catch (err) {
            alert("Хатогӣ ҳангоми фиристодан")
        }
    }

    const getConditionColor = (condition: string) => {
        switch (condition) {
            case 'new': return 'text-green-600 bg-green-50 border-green-200'
            case 'good': return 'text-blue-600 bg-blue-50 border-blue-200'
            case 'used': return 'text-amber-600 bg-amber-50 border-amber-200'
            default: return ''
        }
    }

    const getConditionLabel = (condition: string) => {
        switch (condition) {
            case 'new': return 'Нав'
            case 'good': return 'Хуб'
            case 'used': return 'Кӯҳна'
            default: return ''
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
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

            <div className="flex items-center justify-center gap-2 ">
                {[
                    { icon: <MapPin size={16} />, label: 'Ҷойгиршавӣ', active: !!selectedDistrict },
                    { icon: <Book size={16} />, label: 'Китоб', active: !!formData.textbook_id },
                    { icon: <Package size={16} />, label: 'Тасдиқ', active: isValid }
                ].map((step, index) => (
                    <React.Fragment key={index}>
                        <div className={`flex flex-col items-center ${step.active ? 'text-blue-600' : 'text-slate-300'}`}>
                            <div className={`p-2 rounded-full ${step.active ? 'bg-blue-100 border border-blue-200' : 'bg-slate-100'}`}>
                                {step.icon}
                            </div>
                            <span className="text-xs mt-1 font-medium">{step.label}</span>
                        </div>
                        {index < 2 && (
                            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-200 to-slate-200" />
                        )}
                    </React.Fragment>
                ))}
            </div>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
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
                            <Select onValueChange={(v) => { setSelectedRegion(v); setSelectedDistrict(''); setFormData({ ...formData, school_id: '' }) }}>
                                <SelectTrigger className="h-12 border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white shadow-sm">
                                    <SelectValue placeholder="Вилоятро интихоб кунед..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {regions?.map((r: any) => (
                                        <SelectItem key={r.id} value={r.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                                {r.name}
                                            </div>
                                        </SelectItem>
                                    ))}
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
                                onValueChange={(v) => {
                                    setSelectedDistrict(v)
                                    setFormData({ ...formData, school_id: '' })
                                }}
                            >
                                <SelectTrigger className="h-12 border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white shadow-sm">
                                    <SelectValue placeholder="Ноҳияро интихоб кунед..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts?.map((d: any) => (
                                        <SelectItem key={d.id} value={d.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                                                {d.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-slate-700 font-semibold text-blue-600 flex items-center gap-2">
                                <School size={16} className="text-blue-500" />
                                Мактаби таълимӣ
                                {schools && (
                                    <Badge variant="outline" className="ml-auto text-xs">
                                        {schools.length} мактаб
                                    </Badge>
                                )}
                            </Label>
                            <Select
                                disabled={!selectedDistrict}
                                onValueChange={(v) => setFormData({ ...formData, school_id: v })}
                            >
                                <SelectTrigger className="h-12 border-blue-200 focus:ring-2 focus:ring-blue-500 bg-white shadow-sm">
                                    <SelectValue placeholder="Мактабро интихоб кунед..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {schools?.map((s: any) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <School size={14} className="text-slate-400" />
                                                {s.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
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
                    <CardContent className="p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <Label className="text-slate-700 font-semibold italic flex items-center gap-2">
                                    <Book size={16} className="text-blue-500" />
                                    Номи китоби дарсӣ
                                </Label>
                                <Select onValueChange={(v) => setFormData({ ...formData, textbook_id: v })}>
                                    <SelectTrigger className="h-14 border-slate-200 bg-white shadow-sm text-lg">
                                        <SelectValue placeholder="Китобро интихоб кунед..." />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[400px]">
                                        {textbooks?.items?.map((book: any) => (
                                            <SelectItem key={book.id} value={book.id.toString()}>
                                                <div className="flex flex-col py-2">
                                                    <span className="font-semibold">{book.title}</span>
                                                    <span className="text-sm text-slate-500">
                                                        Синфи {book.grade} • {book.author}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Label className="text-slate-700 font-semibold flex items-center gap-2">
                                        <Hash size={16} className="text-blue-500" />
                                        Миқдор
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            min="1"
                                            className="h-14 text-lg font-bold border-slate-200 bg-white shadow-sm pl-12"
                                            value={formData.quantity}
                                            onChange={(e) => {
                                                const value = Math.max(1, Number(e.target.value))
                                                setFormData({ ...formData, quantity: value })
                                            }}
                                        />
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                                            <Package size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-slate-700 font-semibold">Ҳолати техникӣ</Label>
                                    <Select
                                        defaultValue="new"
                                        onValueChange={(v) => setFormData({ ...formData, condition: v })}
                                    >
                                        <SelectTrigger className="h-14 border-slate-200 bg-white shadow-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['new', 'good', 'used'].map((cond) => (
                                                <SelectItem key={cond} value={cond} className={getConditionColor(cond)}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${cond === 'new' ? 'bg-green-500' :
                                                            cond === 'good' ? 'bg-blue-500' : 'bg-amber-500'
                                                            }`} />
                                                        {getConditionLabel(cond)}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-6">
                            <Button
                                onClick={handleDelivery}
                                disabled={!isValid}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-16 text-xl font-black shadow-lg shadow-blue-200/50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isPosting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Дар ҳоли фиристодан...
                                    </>
                                ) : (
                                    <>
                                        <span>ТАСДИҚИ ИНТИҚОЛ</span>
                                        <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
                                    </>
                                )}
                            </Button>

                            <AnimatePresence>
                                {isSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="flex items-center gap-4 text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl justify-center font-bold border border-green-200 shadow-sm"
                                    >
                                        <CheckCircle2 size={28} className="text-green-600" />
                                        <div>
                                            <p className="text-lg">Интиқол бо муваффақият ба қайд гирифта шуд!</p>
                                            <p className="text-sm font-normal text-green-600 mt-1">
                                                {formData.quantity} нусха китоб ба система дохил карда шуд
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <MapPin className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Вилояти интихобшуда</p>
                            <p className="font-semibold text-slate-800">
                                {selectedRegion ? regions?.find((r: any) => r.id.toString() === selectedRegion)?.name || '—' : '—'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <School className="text-indigo-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Мактаби интихобшуда</p>
                            <p className="font-semibold text-slate-800 truncate">
                                {formData.school_id ? schools?.find((s: any) => s.id.toString() === formData.school_id)?.name || '—' : '—'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Package className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Миқдори китобҳо</p>
                            <p className="font-semibold text-slate-800">{formData.quantity} нусха</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-5 rounded-r-xl shadow-sm"
            >
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-amber-900 font-semibold mb-1">Огоҳӣ</p>
                        <p className="text-amber-800 text-sm leading-relaxed">
                            Пас аз пахши тугмаи тасдиқ, маълумот ба базаи мактаби интихобшуда ворид шуда, рақамҳои инвентарӣ ба таври худкор тавлид мешаванд. Интиқоли китобҳо дар система сабт мегардад.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default DeliveryPage