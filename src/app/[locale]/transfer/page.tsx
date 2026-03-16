import CardsStudent from '@/components/CardsStudent'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TextAnimate } from '@/components/ui/text-animate'
import { Caravan, ArrowRightLeft, Clock, BadgeCheck, Funnel } from 'lucide-react'
import TransferDialog from '@/components/TransferDialog'
import React from 'react'

function page() {
    return (
        <div className='md:px-0 px-3'>
            <div className='flex md:flex-row flex-col md:gap-0 gap-2 justify-between items-center'>
                <div>
                    <TextAnimate className='md:text-2xl text-xl font-bold' animation="slideUp" by="word">
                        Интиқоли китобҳо
                    </TextAnimate>
                    <TextAnimate className='text-foreground text-sm' animation="slideUp" by="word">
                        Фиристодани китобҳо аз як мактаб ба мактаби дигар
                    </TextAnimate>
                </div>
                <TransferDialog>
                    <Button className='bg-[#0950c3] dark:bg-[#2563eb] hover:bg-blue-700 dark:hover:bg-blue-600 flex gap-2 text-white md:py-5 py-2 px-4 md:w-50 w-full rounded-sm text-sm font-medium'>
                        <Caravan className='w-6 h-6' /> Равон кардан
                    </Button>
                </TransferDialog>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 my-5'>
                <CardsStudent Icons={<ArrowRightLeft className="text-blue-500 dark:text-blue-400" />} NameRole='Ҳамаи интиқолҳо' cnt={12} />
                <CardsStudent
                    Icons={<Clock className="text-yellow-500 dark:text-yellow-400" />}
                    NameRole='Дар ҳоли интизорӣ'
                    cnt={5}
                />
                <CardsStudent Icons={<BadgeCheck className="text-green-500 dark:text-green-400" />} NameRole='Иҷрошуда' cnt={'7'} />
            </div>
            <section className='py-5 px-3 bg-white dark:bg-[#1f1f1f] rounded-xl border shadow-sm dark:border-gray-700'>
                <h1 className='text-xl font-bold dark:text-gray-100'>Рӯйхати интиқолҳо</h1>
                <p className='text-muted-foreground text-sm mb-4 dark:text-gray-400'>Ҳамаи интиқолҳо бақайдгирифташуда</p>

                <div className='grid grid-cols-1 md:grid-cols-5 gap-3 mb-4'>
                    <input
                        className='md:col-span-4 rounded-xl px-4 py-2 border focus:cursor-progress bg-[#f9fafb] dark:bg-[#2d2d2d] dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all'
                        placeholder='Ҷустуҷӯи хонандагон...'
                        type="search"
                    />
                    <div className="relative md:col-span-1">
                        <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-gray-400 z-10" />
                        <Select>
                            <SelectTrigger className="w-full bg-[#f9fafb] cursor-pointer dark:bg-[#2d2d2d] dark:border-gray-600 dark:text-gray-200 pl-10 h-10 rounded-xl border-gray-200">
                                <SelectValue placeholder="Хама" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Ҳама</SelectItem>
                                <SelectItem value="10">Ичро Шуда</SelectItem>
                                <SelectItem value="11">Дар ҳоли интизорӣ</SelectItem>
                                <SelectItem value="12">Рад шуда</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto md:max-w-full max-w-84 border rounded-lg dark:border-gray-700">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-[#2a2a2a] border-b dark:border-gray-700">
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Мактаб</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Китоб</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 text-center">Равон шуда</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Сана</th>
                                <th className="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Статус</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {/* Сатри 1 */}
                            <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                                <td className="p-4 text-sm dark:text-gray-300">Мактаби №12, Хуҷанд</td>
                                <td className="p-4 text-sm dark:text-gray-300">Физика, синфи 10</td>
                                <td className="p-4 text-sm text-center dark:text-gray-300">Мактаби №5, Хуҷанд</td>
                                <td className="p-4 text-sm dark:text-gray-300">12.03.2026</td>
                                <td className="p-4 text-sm">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        Иҷрошуда
                                    </span>
                                </td>
                            </tr>

                            {/* Сатри 2 */}
                            <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                                <td className="p-4 text-sm dark:text-gray-300">Мактаби №3, Душанбе</td>
                                <td className="p-4 text-sm dark:text-gray-300">Математика, синфи 9</td>
                                <td className="p-4 text-sm text-center dark:text-gray-300">Мактаби №8, Душанбе</td>
                                <td className="p-4 text-sm dark:text-gray-300">15.03.2026</td>
                                <td className="p-4 text-sm">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                        Дар ҳоли интизорӣ
                                    </span>
                                </td>
                            </tr>

                            {/* Сатри 3 */}
                            <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                                <td className="p-4 text-sm dark:text-gray-300">Мактаби №7, Бохтар</td>
                                <td className="p-4 text-sm dark:text-gray-300">Адабиёт, синфи 11</td>
                                <td className="p-4 text-sm text-center dark:text-gray-300">Мактаби №2, Бохтар</td>
                                <td className="p-4 text-sm dark:text-gray-300">10.03.2026</td>
                                <td className="p-4 text-sm">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        Иҷрошуда
                                    </span>
                                </td>
                            </tr>

                            {/* Сатри 4 */}
                            <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                                <td className="p-4 text-sm dark:text-gray-300">Мактаби №15, Хуҷанд</td>
                                <td className="p-4 text-sm dark:text-gray-300">Химия, синфи 8</td>
                                <td className="p-4 text-sm text-center dark:text-gray-300">Мактаби №10, Хуҷанд</td>
                                <td className="p-4 text-sm dark:text-gray-300">14.03.2026</td>
                                <td className="p-4 text-sm">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                        Дар ҳоли интизорӣ
                                    </span>
                                </td>
                            </tr>

                            {/* Сатри 5 */}
                            <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                                <td className="p-4 text-sm dark:text-gray-300">Мактаби №4, Кӯлоб</td>
                                <td className="p-4 text-sm dark:text-gray-300">Биология, синфи 7</td>
                                <td className="p-4 text-sm text-center dark:text-gray-300">Мактаби №9, Кӯлоб</td>
                                <td className="p-4 text-sm dark:text-gray-300">09.03.2026</td>
                                <td className="p-4 text-sm">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                        Рад шуда
                                    </span>
                                </td>
                            </tr>

                            {/* Сатри 6 */}
                            <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                                <td className="p-4 text-sm dark:text-gray-300">Мактаби №1, Душанбе</td>
                                <td className="p-4 text-sm dark:text-gray-300">География, синфи 10</td>
                                <td className="p-4 text-sm text-center dark:text-gray-300">Мактаби №6, Душанбе</td>
                                <td className="p-4 text-sm dark:text-gray-300">13.03.2026</td>
                                <td className="p-4 text-sm">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        Иҷрошуда
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 mt-4 border-t dark:border-gray-700 bg-gray-50/50 dark:bg-[#252525] rounded-b-xl">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        Нишон дода шудааст: <span className="font-bold text-gray-900 dark:text-gray-100">1-6</span> аз <span className="font-bold text-gray-900 dark:text-gray-100">12</span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            // onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                            // disabled={page === 0}
                            className="px-4 py-2 text-sm font-medium border rounded-lg bg-white dark:bg-[#2d2d2d] dark:border-gray-600 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#3d3d3d] disabled:opacity-50 transition-all shadow-sm"
                        >
                            Пештара
                        </button>
                        <button
                            // onClick={() => setPage((prev) => prev + 1)}
                            // disabled={endItem >= totalItems}
                            className="px-4 py-2 text-sm font-medium border rounded-lg bg-white dark:bg-[#2d2d2d] dark:border-gray-600 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#3d3d3d] disabled:opacity-50 transition-all shadow-sm"
                        >
                            Баъдӣ
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default page