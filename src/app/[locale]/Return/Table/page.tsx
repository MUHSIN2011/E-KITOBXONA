'use client'

import React, { useState, useMemo } from 'react' // useMemo илова шуд
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2, AlertCircle, PackageX, XCircle, Search, Check } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast';
import { useCreateReturnsMutation, useGetBooksSchoolQuery } from '@/api/api'
import { Input } from '@/components/ui/input'

export default function SchoolReturnPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const { data: copies, isLoading: isBookLoading } = useGetBooksSchoolQuery({
        skip: 0,
        limit: 100
    })

    const [createReturn, { isLoading: isSubmitting }] = useCreateReturnsMutation()

    const [formData, setFormData] = useState({
        textbook_copy_ids: [] as number[],
        to_entity_type: "district",
        reason: "",
        notes: ""
    })

    const filteredCopies = useMemo(() => {
        if (!copies?.items) return [];

        return copies.items.filter((copy: any) => {
            const isNotRented = copy.status === 'reserved';

            const title = copy.textbook?.title?.toLowerCase() || "";
            const inv = copy.inventory_number?.toString() || "";
            const search = searchTerm.toLowerCase();
            const matchesSearch = title.includes(search) || inv.includes(search);

            return isNotRented && matchesSearch;
        });
    }, [copies, searchTerm]);

    const handleReturnSubmit = async () => {
        if (formData.textbook_copy_ids.length === 0) {
            toast.error("Лутфан ақаллан як нусхаи китобро интихоб кунед!");
            return;
        }

        if (!formData.reason) {
            toast.error("Сабаби баргардониданро нишон диҳед!");
            return;
        }

        try {
            const payload = {
                textbook_copy_ids: formData.textbook_copy_ids,
                to_entity_type: formData.to_entity_type,
                reason: formData.reason,
                notes: formData.notes || "",
                to_entity_id: 0
            };

            console.log("Фиристода истодаам:", payload);

            await createReturn(payload).unwrap();

            toast.success("Дархост бо муваффақият фиристода شد!");

            setFormData({
                textbook_copy_ids: [],
                to_entity_type: "district",
                reason: "",
                notes: ""
            });
            setSearchTerm("");
        } catch (err: any) {
            console.error("Хатогии сервер:", err);
            toast.error(err.data?.detail?.[0]?.msg || "Хатогӣ ҳангоми фиристодан");
        }
    };

    if (isBookLoading) return (
        <div className="flex justify-center h-[80vh] items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <Toaster position="top-center" />

            {/* Header */}
            <div className="bg-white dark:bg-[#1a1a1a] p-5 sm:p-6 rounded-2xl md:rounded-[24px] border shadow-sm flex items-center gap-4 text-left">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600">
                    <PackageX className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                        Баргардонидан ба Маориф
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground italic text-left">
                        Ирсоли китобҳои зиёдатӣ ё корношоям ба мақомот
                    </p>
                </div>
            </div>

            <Card className="rounded-2xl md:rounded-[24px] border-none shadow-xl overflow-hidden bg-white dark:bg-[#1a1a1a]">
                <CardHeader className="bg-slate-50/50 dark:bg-[#1f1f1f] border-b p-5 sm:p-6 text-left">
                    <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                        <span className="w-2 h-6 bg-red-600 rounded-full"></span>
                        Омодасозии ҳуҷҷати бозгашт
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-5 sm:p-6 space-y-5 text-left">

                    {/* Search Section */}
                    <div className="space-y-2">
                        <Label className="text-sm font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <Search className="w-4 h-4 text-blue-500" /> Ҷустуҷӯ ва интихоби китоб
                        </Label>
                        <div className="relative">
                            <Input
                                placeholder="Номи китоб ё рақами ИНВ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                            {searchTerm && (
                                <XCircle
                                    className="absolute right-3 top-3.5 w-5 h-5 text-slate-300 cursor-pointer hover:text-red-400 transition-colors"
                                    onClick={() => setSearchTerm("")}
                                />
                            )}
                        </div>
                    </div>

                    {/* Multi-Select List */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-muted-foreground uppercase">
                                Натиҷа: {filteredCopies.length}
                            </span>
                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-lg font-bold">
                                ИНТИХОБ ШУД: {formData.textbook_copy_ids.length}
                            </span>
                        </div>

                        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/20">
                            <div className="max-h-[200px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                {filteredCopies.map((copy: any) => {
                                    const isSelected = formData.textbook_copy_ids.includes(copy.id);
                                    return (
                                        <div
                                            key={copy.id}
                                            onClick={() => {
                                                const newIds = isSelected
                                                    ? formData.textbook_copy_ids.filter(id => id !== copy.id)
                                                    : [...formData.textbook_copy_ids, copy.id];
                                                setFormData({ ...formData, textbook_copy_ids: newIds });
                                            }}
                                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border-l-4 ${isSelected
                                                ? 'bg-white dark:bg-slate-800 shadow-sm border-red-500'
                                                : 'border-transparent hover:bg-white/50 dark:hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-sm font-semibold ${isSelected ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {copy.textbook?.title}
                                                </span>
                                                <div className="flex gap-2 items-center">
                                                    <span className="text-[10px] bg-slate-200/50 dark:bg-slate-700 px-1.5 py-0.5 rounded text-muted-foreground uppercase">
                                                        Ҳолат: {copy.condition == "new" ? 'Нав' : copy.condition == "damaged" ? 'Вайрон' : copy.condition == "Fair" ? 'Миёна' : 'Бад'}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        ИНВ: <span className="text-blue-500 font-bold">{copy.inventory_number}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-red-500 border-red-500' : 'border-slate-300 dark:border-slate-600'
                                                }`}>
                                                {isSelected && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredCopies.length === 0 && (
                                    <div className="py-8 text-center text-xs text-muted-foreground italic">
                                        Китоб ёфт нашуд
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Супоридан ба:</Label>
                            <Select
                                onValueChange={(val) => setFormData({ ...formData, to_entity_type: val })}
                                defaultValue="district"
                                value={formData.to_entity_type}
                            >
                                <SelectTrigger className="h-12 rounded-xl border-slate-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="district">Нохия</SelectItem>
                                    <SelectItem value="region">Вилоят</SelectItem>
                                    <SelectItem value="ministry">Маориф</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Сабаб:</Label>
                            <Select
                                onValueChange={(val) => setFormData({ ...formData, reason: val })}
                                value={formData.reason}
                            >
                                <SelectTrigger className="h-12 rounded-xl border-slate-200">
                                    <SelectValue placeholder="Интихоб кунед" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="excess">Зиёдатӣ (Excess)</SelectItem>
                                    <SelectItem value="damaged">Вайроншуда (Damaged)</SelectItem>
                                    <SelectItem value="outdated">Куҳнашуда (Outdated)</SelectItem>
                                    <SelectItem value="defective">Брак (Defective)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Эзоҳи иловагӣ</Label>
                        <Textarea
                            placeholder="Тафсилотро инҷо нависед..."
                            className="rounded-xl min-h-[80px] border-slate-200"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 rounded-xl text-red-800 dark:text-red-300 text-xs sm:text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>Китобҳои интихобшуда ба ҳолати <b>RESERVED</b> мегузаранд ва то тасдиқ дастрас нестанд.</p>
                    </div>

                    <Button
                        onClick={handleReturnSubmit}
                        disabled={isSubmitting || formData.textbook_copy_ids.length === 0}
                        className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold shadow-lg transition-all active:scale-[0.97]"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                        ТАСДИҚ ВА ФИРИСТОДАН ({formData.textbook_copy_ids.length})
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}