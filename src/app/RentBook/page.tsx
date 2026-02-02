'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BookOpen, Send, Loader2 } from "lucide-react"
import { useGetTextbooksQuery, useAddCopiesMutation, useGetMeQuery } from '@/src/api/api'
import toast, { Toaster } from 'react-hot-toast';

export default function OrderBooksPage() {
    // 1. Гирифтани маълумоти корбари ҳозира (токен дар Header меравад)
    const { data: me, isLoading: isMeLoading } = useGetMeQuery()
    const { data: textbooks, isLoading: isBooksLoading } = useGetTextbooksQuery()
    const [addCopies, { isLoading: isSubmitting }] = useAddCopiesMutation()

    const [formData, setFormData] = useState({
        textbook_id: "",
        quantity: 0,
        notes: ""
    })

    const handleOrder = async () => {
        // Санҷиши school_id аз маълумоти корбар
        const schoolId = me?.school_id;

        if (!schoolId) {
            toast.error("Мактаби шумо муайян карда нашуд. Лутфан дубора ворид шавед.");
            return;
        }

        if (!formData.textbook_id || formData.quantity <= 0) {
            toast.error("Китоб ва миқдорро ворид кунед!");
            return;
        }

        try {
            await addCopies({
                textbook_id: Number(formData.textbook_id),
                school_id: Number(schoolId),
                quantity: Number(formData.quantity),
                notes: formData.notes
            }).unwrap()

            toast.success("Фармоиш бо муваффақият қабул шуд!");
            setFormData({ ...formData, quantity: 0, notes: "" })
        } catch (err: any) {
            toast.error(err.data?.detail || "Хатогӣ дар дастрасӣ");
        }
    }

    if (isMeLoading) return <div className="flex h-[95vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
            <Toaster position="top-center" />

            <div className="bg-white p-6 rounded-[24px] border shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-700">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Фармоиши китоб</h1>
                        <p className="text-sm text-muted-foreground italic">
                            Барои: <span className="text-blue-600 font-medium">{me?.school_name || "Мактаби ман"}</span>
                        </p>
                    </div>
                </div>
            </div>

            <Card className="rounded-[24px]  border-none shadow-lg py-0 ">
                <CardHeader className="bg-slate-50 border-b py-3">
                    <CardTitle>Пур кардани форма</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label className="font-semibold">Интихоби китоб</Label>
                        <Select onValueChange={(val) => setFormData({ ...formData, textbook_id: val })}>
                            <SelectTrigger className="h-12 rounded-xl">
                                <SelectValue placeholder="Китобро интихоб кунед" />
                            </SelectTrigger>
                            <SelectContent>
                                {textbooks?.items?.map((t: any) => (
                                    <SelectItem key={t.id} value={t.id.toString()}>
                                        {t.title} ({t.grade}-класс)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold">Миқдори лозима</Label>
                        <Input
                            type="number"
                            placeholder="Миқдорро ворид кунед"
                            className="h-12 rounded-xl"
                            value={formData.quantity || ""}
                            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold">Эзоҳ</Label>
                        <Input
                            placeholder="Масалан: Барои синфҳои 5-ум"
                            className="h-12 rounded-xl"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <Button
                        onClick={handleOrder}
                        disabled={isSubmitting}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                        Тасдиқи фармоиш
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}