'use client'
import Card from '@/src/components/Card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ExternalLink, Funnel, UserCog } from 'lucide-react'
import React, { useState } from 'react'
import { IGetTextbooks, useGetTextbooksQuery } from '@/src/api/api';
import { TextAnimate } from '@/components/ui/text-animate'

function page() {
    const [subject, setSubject] = useState<string>("all");
    const { data: books, isLoading } = useGetTextbooksQuery(subject);

    return (
        <main>
            <div className='flex justify-between items-center'>
                <div>
                    <TextAnimate className='text-2xl font-bold' animation="slideUp" by="word">
                        Идоракунии фонди китобҳо
                    </TextAnimate>
                    <TextAnimate  className='text-foreground text-sm' animation="slideUp" by="word">

                        Назорат ва идоракунии китобҳои дарсӣ дар ҳамаи ҷойҳо
                    </TextAnimate>
                </div>
                <button className='bg-[#0950c3] text-white py-2 px-3 rounded-sm'>+ {' '}Илова кардани китоб</button>
            </div>
            <div className='grid grid-cols-4 gap-3 my-3'>
                <Card
                    NameRole={'Ҳамагӣ китобҳо'}
                    cnt={books?.total?.toString() || "0"}
                />
                <div className='text-[#0950c3]'>
                    <Card
                        NameRole={'Нав'}
                        cnt={'7 800'}
                    />
                </div>
                <div className='text-yellow-500'>
                    <Card
                        NameRole={'Иҷорашуда'}
                        cnt={'4 140'}
                    />
                </div>
                <div className='text-red-600'>
                    <Card
                        NameRole={'Вайроншуда'}
                        cnt={'470'}
                    />
                </div>
            </div>
            <section className='p-3 bg-white rounded-xl border'>
                <h1 className='text-2xl font-bold '>Фонди китобҳои дарсӣ</h1>
                <p className='text-foreground text-sm'>Рӯйхати пурраи ҳамаи китобҳои дарсӣ дар система</p>
                <div className='grid grid-cols-6 my-3 gap-3 items-center'>
                    <input className='col-span-4 rounded-xl px-5 py-2 border bg-[#f9fafb]' placeholder='Ҷустуҷӯи китобҳо...' type="search" />
                    <div className="relative col-span-1 ">
                        <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                        <Select onValueChange={(value) => setSubject(value)}>
                            <SelectTrigger className="w-full bg-[#f9fafb] py-5 pl-10 h-13 rounded-xl">
                                <SelectValue placeholder="Ҳама" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Ҳамаи фанҳо</SelectItem>
                                <SelectItem value="math">Математика</SelectItem>
                                <SelectItem value="russian">Забони русӣ</SelectItem>
                                <SelectItem value="tajik">Забони тоҷикӣ</SelectItem>
                                <SelectItem value="english">Забони англисӣ</SelectItem>
                                <SelectItem value="physics">Физика</SelectItem>
                                <SelectItem value="chemistry">Химия</SelectItem>
                                <SelectItem value="biology">Биология</SelectItem>
                                <SelectItem value="history">Таърих</SelectItem>
                                <SelectItem value="geography">География</SelectItem>
                                <SelectItem value="literature">Адабиёт</SelectItem>
                                <SelectItem value="informatics">Информатика</SelectItem>
                                <SelectItem value="other">Дигар</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <button className='flex col-span-1 hover:bg-[#e7f0fe] hover:text-blue-600 duration-200 bg-[#f9fafb] border font-semibold px-2 py-2 rounded-xl gap-2 items-center justify-center '>
                        <ExternalLink size={'18'} />
                        Экспорт
                    </button>
                </div>
                <div className="overflow-x-auto rounded-sm border-gray-200 bg-white">
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
                            {books?.items?.map((book: IGetTextbooks) => (
                                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
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
                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
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
                </div>
            </section>
        </main>
    )
}

export default page