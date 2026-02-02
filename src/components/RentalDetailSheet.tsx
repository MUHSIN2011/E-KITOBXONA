'use client'
import React, { useState } from 'react'
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Book, CheckCircle2, History, Info } from 'lucide-react'

export default function RentalDetailSheet({ rental }: { rental: any }) {
    const [selectedBooks, setSelectedBooks] = useState<number[]>([])
    const [condition, setCondition] = useState<'new' | 'used'>('new')
    const [description, setDescription] = useState('')

    const toggleBook = (id: number) => {
        setSelectedBooks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id])
    }

    return (
        <SheetContent className="sm:max-w-md w-full overflow-y-auto">
            <SheetHeader className="space-y-1 mb-6">
                <SheetTitle className="text-2xl font-black">{rental.student_name}</SheetTitle>
                <div className="flex gap-2">
                    <Badge variant="outline">Синфи {rental.grade}</Badge>
                    <Badge variant="outline" className="bg-blue-50">ID: {rental.student_id}</Badge>
                </div>
            </SheetHeader>

            <div className="space-y-8">
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Book size={16} /> Рӯйхати китобҳо
                    </h3>
                    <div className="space-y-3">
                        {rental.books?.map((book: any) => (
                            <div
                                key={book.id}
                                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${selectedBooks.includes(book.id) ? 'border-blue-500 bg-blue-50/50' : 'bg-slate-50/50'
                                    }`}
                            >
                                <Checkbox
                                    id={`book-${book.id}`}
                                    checked={selectedBooks.includes(book.id)}
                                    onCheckedChange={() => toggleBook(book.id)}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <label htmlFor={`book-${book.id}`} className="font-bold text-slate-800 cursor-pointer">
                                        {book.title}
                                    </label>
                                    <p className="text-xs text-slate-500 mt-1">Рақами инвентарӣ: {book.inventory_number}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedBooks.length > 0 && (
                    <div className="space-y-6 p-5 rounded-3xl bg-slate-900 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                        <h4 className="font-bold flex items-center gap-2 text-blue-400">
                            <History size={18} /> Қабули китобҳо
                        </h4>

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => setCondition('new')}
                                className={`rounded-xl h-12 border-2 ${condition === 'new' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'}`}
                            >Нав</Button>
                            <Button
                                variant="ghost"
                                onClick={() => setCondition('used')}
                                className={`rounded-xl h-12 border-2 ${condition === 'used' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700'}`}
                            >Кӯҳна</Button>
                        </div>

                        {condition === 'used' && (
                            <div className="space-y-2">
                                <p className="text-xs text-slate-400 ml-1">Сабаби кӯҳнашавӣ (Description):</p>
                                <Textarea
                                    className="bg-slate-800 border-slate-700 rounded-xl focus:ring-amber-500"
                                    placeholder="Маълумоти иловагӣ..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        )}

                        <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg">
                            <CheckCircle2 className="mr-2" /> ТАСДИҚИ ҚАБУЛ
                        </Button>
                    </div>
                )}

                <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
                    <Info className="text-blue-500 mt-0.5" size={18} />
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Танҳо китобҳоеро интихоб кунед, ки хонанда ҳоло баргардонида истодааст. Ҳолати китобро дуруст қайд кунед.
                    </p>
                </div>
            </div>
        </SheetContent>
    )
}