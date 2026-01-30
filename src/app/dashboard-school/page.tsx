'use client'
import { useGetRegionsQuery } from '@/src/api/api'
import Card from '../../components/Card'
import { Building2, GraduationCap, MapPin, School } from 'lucide-react'
import MyBarChart from '@/src/components/ChartComponent'
import DonutChart from '@/src/components/DonutChart'
import RegionsTable from '../../components/RegionsTable'
import MyLineChart from '@/src/components/MyLineChart'
import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { ChartPieLabel } from '@/components/ui/chart-pie-label'
import { DashboardMainChart } from '@/components/ui/DashboardMainChart'
import RecentRentals from '@/components/ui/SchoolFinancialStatus'
import SchoolFinancialStatus from '@/components/ui/SchoolFinancialStatus'

function Page() {
    const { data: regions, isLoading, isError } = useGetRegionsQuery()

    useEffect(() => {
        AOS.init({
            duration: 900, // Давомнокӣ аниматсия
            easing: 'ease-in-out', // Навъи аниматсия
            once: false, // Аниматсия фақат як бор иҷро шавад
            offset: 100,
            delay: 100,
        })
    }, [])

    if (isLoading) return <div className="flex h-[85vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    if (isError) return <div>Хатогӣ ҳангоми гирифтани маълумот</div>

    return (
        <div className="px-6 py-3">
            <section data-aos="fade-up">
                <div className="grid grid-cols-1 mb-8 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div data-aos="fade-right" data-aos-delay="100">
                        <Card
                            NameRole={'Ҳамагӣ вилоятҳо'}
                            cnt={regions?.length.toString() || '0'}
                            Icons={<MapPin />}
                            description={'Фаъол дар система'}
                        />
                    </div>
                    <div data-aos="fade-right" data-aos-delay="200">
                        <Card
                            NameRole={'Ҳамагӣ ноҳияҳо'}
                            cnt={regions?.length.toString() || '0'}
                            Icons={<Building2 />}
                            description={`Дар ${regions?.length.toString() || '0'} вилоят`}
                        />
                    </div>
                    <div data-aos="fade-right" data-aos-delay="300">
                        <Card
                            NameRole={'Ҳамагӣ мактабҳо'}
                            cnt={regions?.length.toString() || '0'}
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
                <SchoolFinancialStatus />

            </section>

            <section className='my-5 grid gap-5 grid-cols-1 lg:grid-cols-3'>
                <div className="lg:col-span-2" data-aos="zoom-in" data-aos-delay="500">
                    <DashboardMainChart />
                </div>
                <div className="lg:col-span-1" data-aos="zoom-in" data-aos-delay="600">
                    <ChartPieLabel />
                </div>
            </section>

        </div>
    )
}

export default Page