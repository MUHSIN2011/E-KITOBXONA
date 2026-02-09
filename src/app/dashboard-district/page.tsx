'use client'
import {  useGetRegionsQuery, useGetReportsOverviewQuery } from '@/src/api/api'
import Card from '../../components/Card'
import { BookOpen, GraduationCap,  MapPin, School } from 'lucide-react'
import MyBarChart from '@/src/components/ChartComponent'
import RegionsTable from '../../components/RegionsTable'
import MyLineChart from '@/src/components/MyLineChart'
import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { ChartRadialLabel } from '@/components/ui/chartConfig'
import DashboardFlow from '@/src/components/DashboardFlow'

function Page() {
    const userRegionId = 2;

    const { data: overview, isLoading: isOverviewLoading } = useGetReportsOverviewQuery(userRegionId);

    const { data: regions, isLoading: isRegionsLoading } = useGetRegionsQuery();

    useEffect(() => {
        AOS.init({
            duration: 900,
            easing: 'ease-in-out',
            once: true,
            offset: 50,
        })
    }, [])

    if (isOverviewLoading || isRegionsLoading) return (
        <div className="flex h-[85vh] items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    )

    return (
        <div className="px-4 py-3 overflow-hidden">
            <div className="mb-6 bg-white p-5 rounded-2xl border border-blue-50 shadow-sm flex justify-between items-center" data-aos="fade-down">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <MapPin className="text-blue-600" /> Саҳифаи назорати вилоятӣ
                    </h2>
                    <p className="text-sm text-slate-500">Назорати фондҳои китоб дар ноҳияҳо ва мактабҳо</p>
                </div>
            </div>

            <section data-aos="fade-up">
                <div className="grid grid-cols-1 mb-8 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div data-aos="fade-right" data-aos-delay="100">
                        <Card
                            path='/districts'
                            NameRole={'Ноҳияҳо'}
                            cnt={overview?.total_districts?.toString() || '0'}
                            Icons={<MapPin />}
                            description={'Дар вилоят'}
                        />
                    </div>
                    <Card
                        NameRole='Мактабҳо'
                        cnt={overview?.total_schools?.toString() || '0'}
                        Icons={<School />}
                        description='Фаъол дар вилоят'
                    />
                    <Card
                        NameRole='Китобҳо'
                        cnt={overview?.total_books?.toLocaleString() || '0'}
                        Icons={<BookOpen />}
                        description='Фонди умумии вилоят'
                    />
                    <Card
                        NameRole='Бозпардохт'
                        cnt="85"
                        Icons={<GraduationCap />}
                        description='Нишондиҳандаи миёна'
                    />
                </div>
            </section>

            <DashboardFlow />

            <section className='my-8 grid gap-5 grid-cols-1 lg:grid-cols-3'>
                <div className="lg:col-span-2 bg-white p-4 rounded-xl border " data-aos="fade-right">
                    <MyBarChart />
                </div>
                <div className="lg:col-span-1 bg-white p-4 rounded-xl border" data-aos="fade-left">
                    <ChartRadialLabel />
                </div>
            </section>

            <section className='border rounded-xl p-5 my-5 bg-white shadow-sm' data-aos="fade-up">
                <h2 className='text-2xl font-bold text-slate-800'>Вазъият дар ноҳияҳо</h2>
                <p className='text-slate-500 text-sm mb-5'>Нишондиҳандаҳои асосии ҳар як ноҳияи вилоят</p>
                <RegionsTable />
            </section>

            <section className='border rounded-xl p-5 bg-white shadow-sm' data-aos="fade-up">
                <h2 className='text-2xl font-bold text-slate-800'>Динамикаи бозпардохт</h2>
                <p className='text-slate-500 text-sm mb-5'>Пешрафти бозпардохт дар сатҳи вилоят</p>
                <MyLineChart />
            </section>
            
        </div>
    )
}

export default Page