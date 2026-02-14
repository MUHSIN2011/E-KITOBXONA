'use client'
import Card from '@/src/components/Card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Funnel, LayoutGrid, SearchAlert, SlidersHorizontal, TableIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { IGetTextbooks, useGetBooksSchoolQuery } from '@/src/api/api';
import { TextAnimate } from '@/components/ui/text-animate'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useRouter } from 'next/navigation'

function Page() {
    const router = useRouter()
    const [subject, setSubject] = useState<string>("all");
    const [search, setSearch] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [condition, setCondition] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");

    const { data: books, isLoading } = useGetBooksSchoolQuery({
        subject,
        condition,
        status,
        skip: (currentPage - 1) * limit,
        limit
    });
    const totalPages = Math.ceil((books?.total || 0) / limit);
    const totalBooks = books?.total || 0;

    const newBooksCount = books?.items?.filter(item => item.condition === 'new').length || 0;

    const rentedBooksCount = books?.items?.filter(item => item.status === 'rented').length || 0;

    const damagedBooksCount = books?.items?.filter(item => item.condition === 'damaged' || item.condition === 'poor').length || 0;
    const [viewType, setViewType] = useState<'table' | 'grid'>('table')

    const filteredBooks = books?.items?.filter((e: any) =>
        e.textbook.title.toLowerCase().includes(search.toLowerCase())
    ) || []



    useEffect(() => {
        AOS.init({
            duration: 900,
            easing: 'ease-in-out',
            once: false,
            offset: 100,
            delay: 100,
        })
    }, [])

    return (
        <main data-aos="fade-in" className='md:px-4 px-3 md:py-0 py-3'>
            <div className='flex justify-between items-center mb-3'>
                <div>
                    <TextAnimate className='md:text-2xl font-bold' animation="slideUp" by="word">Идоракунии китобҳо</TextAnimate>
                    <TextAnimate className='text-foreground text-sm w-auto w-60' animation="slideUp" by="word">Назорат ва идоракунии китобҳои дарсӣ дар ҳамаи ҷойҳо</TextAnimate>
                </div>
                <button onClick={() => router.push('/RentBook')} className='bg-[#0950c3] text-white py-2 px-3 rounded-sm hover:bg-[#0a45a5] transition-colors duration-200' data-aos="fade-left" data-aos-delay="300">+ Иловаи китоб</button>
            </div>

            <div className='grid md:grid-cols-4 grid-cols-1  gap-3 my-7'>
                <div
                    className='text-green-600'
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <Card
                        NameRole={'Ҳамагӣ китобҳо'}
                        cnt={totalBooks.toString()}
                        className="p-4 md:p-6 sm:p-2 "
                    />
                </div>
                <div
                    className='text-[#0950c3]'
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    <Card
                        NameRole={'Нав'}
                        cnt={newBooksCount.toString()}
                        className="p-4 md:p-6"
                    />
                </div>
                <div
                    className='text-yellow-500'
                    data-aos="fade-up"
                    data-aos-delay="300"
                >
                    <Card
                        NameRole={'Иҷорашуда'}
                        cnt={rentedBooksCount.toString()}
                        className="p-4 md:p-6"
                    />
                </div>
                <div
                    className='text-red-600'
                    data-aos="fade-up"
                    data-aos-delay="400"
                >
                    <Card
                        NameRole={'Вайроншуда'}
                        cnt={damagedBooksCount.toString()}
                        className="p-4 md:p-6"
                    />
                </div>
            </div>

            <section
                className='p-3 my-3 bg-white dark:bg-[#1a1a1a] rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300'
                data-aos="zoom-in"
                data-aos-delay="100"
            >
                <h1 className='text-2xl font-bold '>китобҳои дарсӣ</h1>
                <p className='text-foreground text-sm'>Рӯйхати пурраи ҳамаи китобҳои дарсӣ дар система</p>

                <div className='flex flex-col lg:flex-row gap-4 my-5 items-center justify-between' data-aos="fade-up">
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 w-full lg:w-[80%] items-center'>

                        <div className="relative md:col-span-2">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className='w-full rounded-xl  dark:bg-[#1a1a1a] px-5 py-2 border bg-[#f9fafb] focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none text-sm'
                                placeholder='Ҷустуҷӯ...'
                                type="search"
                            />
                        </div>

                        <div className="md:col-span-1">
                            <Select onValueChange={(v) => { setCondition(v); setCurrentPage(1); }}>
                                <SelectTrigger className="w-full bg-[#f9fafb]  dark:bg-[#1a1a1a] py-5 pl-10 h-13 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className='flex items-center gap-2 overflow-hidden'>
                                        <SlidersHorizontal size={16} className="shrink-0" />
                                        <SelectValue placeholder="Ҳолат" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Ҳамаи ҳолатҳо</SelectItem>
                                    <SelectItem value="new">Нав (New)</SelectItem>
                                    <SelectItem value="good">Хуб (Good)</SelectItem>
                                    <SelectItem value="fair">Миёна (Fair)</SelectItem>
                                    <SelectItem value="poor">Бад (Poor)</SelectItem>
                                    <SelectItem value="damaged">Вайрон (Damaged)</SelectItem>
                                    <SelectItem value="written_off">Аз ҳисоб баромада</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-1">
                            <Select onValueChange={(v) => { setStatus(v); setCurrentPage(1); }}>
                                <SelectTrigger className="w-full bg-[#f9fafb]  dark:bg-[#1a1a1a] py-5 pl-10 h-13 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className='flex items-center gap-2 overflow-hidden'>
                                        <Funnel size={16} className="shrink-0" />
                                        <SelectValue placeholder="Статус" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Ҳамаи статусҳо</SelectItem>
                                    <SelectItem value="available">Дар склад</SelectItem>
                                    <SelectItem value="rented">Дар иҷора</SelectItem>
                                    <SelectItem value="lost">Гумшуда</SelectItem>
                                    <SelectItem value="reserved">Броншуда</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-1">
                            <Select onValueChange={(value) => setSubject(value)}>
                                <SelectTrigger className="w-full bg-[#f9fafb]  dark:bg-[#1a1a1a] py-5 pl-10 h-13 rounded-xl hover:bg-gray-50 transition-colors">
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

                        <div className="md:hidden flex bg-gray-100 dark:bg-black p-1 rounded-xl gap-1">
                            <button onClick={() => setViewType('table')} className={`flex-1  flex justify-center py-1.5 rounded-lg ${viewType === 'table' ? 'bg-white dark:bg-[#1a1a1a] shadow text-blue-600' : 'text-gray-500'}`}><TableIcon size={18} /></button>
                            <button onClick={() => setViewType('grid')} className={`flex-1 flex justify-center py-1.5 rounded-lg ${viewType === 'grid' ? 'bg-white dark:bg-[#1a1a1a] shadow text-blue-600' : 'text-gray-500'}`}><LayoutGrid size={18} /></button>
                        </div>
                    </div>

                    <div className="hidden md:flex bg-gray-100 dark:bg-black p-1 rounded-xl gap-1 shrink-0">
                        <button
                            onClick={() => setViewType('table')}
                            className={`p-2 rounded-lg transition-all ${viewType === 'table' ? 'bg-white dark:bg-[#1a1a1a] shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Намуди ҷадвал"
                        >
                            <TableIcon size={20} />
                        </button>
                        <button
                            onClick={() => setViewType('grid')}
                            className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-white  dark:bg-[#1a1a1a] shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Намуди карточка"
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredBooks.length === 0 && !isLoading ? (
                        <div className="bg-white dark:bg-[#1a1a1a] p-20 rounded-xl border border-dashed border-gray-300 text-center">
                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                <SearchAlert size={48} />
                                <p>Ягон китоб ёфт нашуд</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {viewType === 'table' ? (
                                <div className="overflow-x-auto  dark:bg-[#1a1a1a]/40   dark:border-[#1a1a1a]  overflow-y-clip rounded-xl border border-gray-200 bg-white  shadow-sm md:max-w-full max-w-90">
                                    <table className="w-full text-left border-collapse min-w-[800px]">
                                        <thead>
                                            <tr className="bg-gray-50 border-b  dark:bg-slate-800/60 dark:border-[#1a1a1a] border-gray-200">
                                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-slate-200">Номи китоб / Инвентар</th>
                                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-slate-200">ID</th>
                                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-slate-200">Синф</th>
                                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-slate-200">Соли нашр</th>
                                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-slate-200">Ҳолат</th>
                                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-slate-200">Статус</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredBooks.map((item: any) => {
                                                return (
                                                    <tr
                                                        key={item.id}
                                                        onClick={() => router.push(`/books-school/${item.id}`)}
                                                        className="border-b border-gray-100 dark:border-slate-800/50  hover:bg-blue-50/50 dark:hover:bg-slate-800/60  cursor-pointer transition-all duration-300  hover:shadow-md  active:scale-[0.99] group"
                                                    >
                                                        <td className="p-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-gray-800 dark:text-white">{item.textbook.title}</span>
                                                                <span className="text-[10px] text-blue-500 font-mono bg-blue-50 dark:bg-[#080707c4] w-fit px-1 rounded">{item.inventory_number}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-gray-600 font-mono dark:text-white text-sm">#{item.id}</td>
                                                        <td className="p-4 text-sm text-gray-700 dark:text-white">{item.textbook.grade}</td>
                                                        <td className="p-4 text-sm text-gray-700 dark:text-white">{item.textbook.publication_year}</td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.textbook.is_new ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                                                {item.textbook.is_new ? 'Нав' : 'Кӯҳна'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className={`flex items-center gap-1.5 text-xs font-bold ${item.status === 'rented' ? 'text-blue-600' : 'text-gray-400'}`}>
                                                                <span className={`w-2 h-2 rounded-full ${item.status === 'rented' ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'}`} />
                                                                {item.status === 'rented' ? 'Иҷора' : 'Склад'}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {filteredBooks.map((item: any) => {
                                        const imageUrl = item.textbook.cover_image_url?.startsWith('http')
                                            ? item.textbook.cover_image_url
                                            : `https://student4.softclub.tj${item.textbook.cover_image_url}`;
                                            console.log(imageUrl);
                                        return (
                                            <div key={item.id} onClick={() => router.push(`/books-school/${item.id}`)} className="bg-white  dark:bg-[#1a1a1a] dark:border-gray-950 p-3 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-300 rounded-xl border border-gray-200 shadow-sm  " >
                                                <div
                                                    className="flex justify-between items-start mb-3 p-3 rounded-lg h-70 bg-cover bg-center relative overflow-hidden shadow-inner"
                                                    style={{
                                                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0)), url('${imageUrl}')`
                                                    }}
                                                >
                                                    <span className="text-[10px]  font-bold text-blue-700 dark:text-white dark:bg-gray-950 dark:bg-opacity-50 dark:border-0 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm uppercase border border-blue-100">
                                                        {item.inventory_number}
                                                    </span>

                                                    <span className="text-[10px] font-medium text-white dark:text-white bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded">
                                                        #{item.id}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-gray-900 mb-4 line-clamp-1">{item.textbook.title}</h3>
                                                <div className="flex justify-between text-sm border-t border-gray-50 pt-3">
                                                    <div className="text-gray-500">Синф: <span className="font-bold text-gray-900">{item.textbook.grade}</span></div>
                                                    <div className="text-gray-500">Сол: <span className="font-bold text-gray-900">{item.textbook.publication_year}</span></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </>
                    )}

                    {isLoading && (
                        <div className="flex justify-center p-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}
                </div>
                <div className="flex md:flex-row flex-col-reverse justify-between items-center mt-5 p-4 bg-gray-50 dark:bg-[#1a1a1a] dark:border rounded-xl border">
                    <p className="text-sm text-gray-500">
                        Намоиши {books?.items?.length || 0} аз {books?.total || 0} китоб
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1 || isLoading}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 dark:bg-black disabled:opacity-50 transition-all"
                        >
                            Қаблӣ
                        </button>

                        <div className="flex items-center px-4 font-bold text-blue-600">
                            {currentPage} / {totalPages || 1}
                        </div>

                        <button
                            disabled={currentPage >= totalPages || isLoading}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-4 py-2 border rounded-lg bg-white  dark:bg-black hover:bg-gray-100 disabled:opacity-50 transition-all"
                        >
                            Баъдӣ
                        </button>
                    </div>
                </div>
            </section>
        </main >
    )
}

export default Page