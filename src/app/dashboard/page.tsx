'use client'
import { useCloseAcademicYearMutation, useGetRegionsQuery, useGetReportsOverviewQuery } from '@/src/api/api'
import Card from '../../components/Card'
import { BookOpen, Building2, CalendarDays, GraduationCap, Lock, MapPin, School } from 'lucide-react'
import MyBarChart from '@/src/components/ChartComponent'
import DonutChart from '@/src/components/DonutChart'
import RegionsTable from '../../components/RegionsTable'
import MyLineChart from '@/src/components/MyLineChart'
import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { ChartRadialLabel } from '@/components/ui/chartConfig'
import DashboardFlow from '@/src/components/DashboardFlow'
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/src/components/ProtectedRoute'

function Page() {
    const { data: regions, isLoading, isError } = useGetRegionsQuery()
    const { data: overview } = useGetReportsOverviewQuery(1);
    const [closeYear, { isLoading: isClosing }] = useCloseAcademicYearMutation();
    const activeYearId = 1;

    useEffect(() => {
        AOS.init({
            duration: 900, // Давомнокӣ аниматсия
            easing: 'ease-in-out', // Навъи аниматсия
            once: false, // Аниматсия фақат як бор иҷро шавад
            offset: 100,
            delay: 100,
        })
    }, [])

    const handleCloseYear = async () => {
        if (window.confirm("Оё шумо мутмаин ҳастед, ки мехоҳед соли таҳсилро бандед? Ин амал баргардонда намешавад!")) {
            await closeYear(activeYearId);
            alert("Соли таҳсил бо муваффақият баста шуд.");
        }
    }

    if (isLoading) return <div className="flex h-[85vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    if (isError) return <div>Хатогӣ ҳангоми гирифтани маълумот</div>

    return (
        <ProtectedRoute allowedRoles={["ministry"]}>
            <div className="px-4 py-3">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-2xl border border-blue-100 shadow-sm gap-4" data-aos="fade-down">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                            <CalendarDays className="text-blue-600" /> Соли таҳсили 2025-2026
                        </h2>
                        <p className="text-sm text-slate-500">Назорати умумидавлатии фондҳои китоб</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                            Ҳисоботи PDF
                        </Button>
                        <Button
                            onClick={handleCloseYear}
                            disabled={isClosing}
                            className="bg-rose-600 hover:bg-rose-700 text-white flex gap-2"
                        >
                            <Lock className="w-4 h-4" /> {isClosing ? "Пайваст..." : "Бастани сол"}
                        </Button>
                    </div>
                </div>
                <section data-aos="fade-up">
                    <div className="grid grid-cols-1 mb-8 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div data-aos="fade-right" data-aos-delay="100">
                            <Card
                                path='/ministry'
                                NameRole={'Ҳамагӣ вилоятҳо'}
                                cnt={regions?.length.toString() || '0'}
                                Icons={<MapPin />}
                                description={'Фаъол дар система'}
                            />
                        </div>
                        <div data-aos="fade-right" data-aos-delay="200">
                            <Card
                                NameRole={'Ҳамагӣ китобҳо'}
                                cnt={overview?.total_books.toString() || '0'}
                                Icons={<BookOpen />}
                                description={`Дар ${regions?.length.toString() || '0'} вилоят`}
                            />
                        </div>
                        <div data-aos="fade-right" data-aos-delay="300">
                            <Card
                                NameRole={'Ҳамагӣ мактабҳо'}
                                cnt={overview?.total_schools.toString() || '0'}
                                Icons={<School />}
                                description={'Фаъол дар система'}
                            />
                        </div>
                        <div data-aos="fade-right" data-aos-delay="400">
                            <Card
                                NameRole={'Ҳамагӣ хонандагон'}
                                cnt={regions?.length.toString() || '0'}
                                Icons={<GraduationCap />}
                                description={'Бақайдгирифташуда'}
                            />
                        </div>
                    </div>
                </section>
                <DashboardFlow />

                <section className='my-8 grid gap-5 grid-cols-1 lg:grid-cols-3'>
                    <div className="lg:col-span-2" data-aos="fade-up" data-aos-delay="300">
                        <MyBarChart />
                    </div>
                    <div className="lg:col-span-1" data-aos="zoom-in" data-aos-delay="300">
                        <ChartRadialLabel />
                    </div>
                </section>

                <section
                    className='border rounded-xl p-3 my-5 bg-white'
                // data-aos="fade-up"
                // data-aos-delay="100"
                >
                    <h1 className='text-2xl font-semibold '>Вазъият аз рӯи вилоятҳо</h1>
                    <p className='text-foreground text-sm mb-3'>Нишондиҳандаҳои асосии ҳар як вилоят</p>
                    <RegionsTable />
                </section>

                <section
                    className='border rounded-xl p-3  bg-white'
                // data-aos="fade-up"
                // data-aos-delay="100"
                >
                    <h1 className='text-2xl font-semibold '>Раванди бозпардохт</h1>
                    <p className='text-foreground text-sm mb-3'>Пешрафти умумии бозпардохти китобҳо дар 6 моҳи охир</p>
                    <MyLineChart />
                </section>
            </div>
        </ProtectedRoute>
    )
}

export default Page