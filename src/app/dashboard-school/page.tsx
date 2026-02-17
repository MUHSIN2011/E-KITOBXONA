'use client'
import { useGetActiveYearQuery, useGetMeQuery, useGetRegionsQuery, useGetReportsOverviewQuery, useGetSchoolBudgetQuery, useGetStudentsQuery } from '@/src/api/api'
import Card from '../../components/Card'
import { Book, BookUser, GraduationCap, School } from 'lucide-react'
import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { ChartPieLabel } from '@/components/ui/chart-pie-label'
import { DashboardMainChart } from '@/components/ui/DashboardMainChart'
import { SchoolFinancialStatus } from '@/components/ui/SchoolFinancialStatus'
import DashboardFlow from '@/src/components/DashboardFlow'
import ProtectedRoute from '@/src/components/ProtectedRoute'

function Page() {
    const { data: regions, isLoading, isError } = useGetRegionsQuery()
    const { data: me } = useGetMeQuery()
    const { data: activeYear } = useGetActiveYearQuery()
    const currentYearId = activeYear?.id
    const { data: items } = useGetReportsOverviewQuery(currentYearId, { skip: !currentYearId })

    const { data: students } = useGetStudentsQuery({ skip: 0, limit: 1 })

    const { data: budget } = useGetSchoolBudgetQuery(
        { schoolId: me?.school_id, yearId: 3 },
        { skip: !me?.school_id }
    )

    useEffect(() => {
        AOS.init({
            duration: 600,
            once: true,
            easing: 'ease-out-cubic',
        })
    }, [])

    if (isLoading) return (
        <div className="flex h-[85vh] items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    )

    if (isError) return <div className="flex justify-center flex-col items-center h-[80vh] gap-3">
        <h1 className="text-2xl text-center text-red-500 font-semibold">Хатогӣ ҳангоми гирифтани маълумот!!</h1>
        <p>Лутфан сайтро аз нав кушоед!</p>
        <div className='flex gap-2 items-center border bg-blue-600 text-white rounded-sm px-3 py-1 cursor-pointer'>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            <button className=' cursor-pointer'>Нав Сози</button>
        </div>
    </div>

    return (
        <ProtectedRoute allowedRoles={["school"]}>
            <div className="md:px-6 px-4 py-4 space-y-6">
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card
                        data-aos="fade-up" data-aos-delay="100"
                        path='/books-school'
                        NameRole='Ҳамагӣ Китобҳо'
                        cnt={items?.total_books?.toString() || '0'}
                        Icons={<Book className="text-blue-600" />}
                        description='Дар фонди мактаб'
                    />
                    <Card
                        path='/rentals'
                        data-aos="fade-up" data-aos-delay="200"
                        NameRole='Дар иҷора'
                        cnt={items?.rented_books?.toString() || '0'}
                        Icons={<BookUser className="text-orange-600" />}
                        description='Дар дасти хонандагон'
                    />
                    <Card
                        path='/books-school'
                        data-aos="fade-up" data-aos-delay="300"
                        NameRole='Ҳамагӣ мактабҳо'
                        cnt={regions?.length.toString() || '0'}
                        Icons={<School className="text-green-600" />}
                        description='Дар ноҳия/вилоят'
                    />
                    <Card
                        data-aos="fade-up" data-aos-delay="400"
                        path='/students'
                        NameRole='Хонандагон'
                        cnt={students?.total?.toString() || '0'}
                        Icons={<GraduationCap className="text-purple-600" />}
                        description='Фаъол дар система'
                    />
                </section>

                <SchoolFinancialStatus
                    balance={budget?.balance}
                    rentalIncome={budget?.total_income}
                    totalExpenses={budget?.total_expenses}
                    paybackPercent={budget?.total_expenses > 0
                        ? (budget.total_income / budget.total_expenses) * 100
                        : 0
                    }
                />
                <DashboardFlow />

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
                    <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border shadow-sm" data-aos="zoom-in">
                        <h3 className="text-lg font-semibold mb-4">Статистикаи солона</h3>
                        <DashboardMainChart />
                    </div>
                    <div className="lg:col-span-1 bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border shadow-sm" data-aos="zoom-in" data-aos-delay="200">
                        <h3 className="text-lg font-semibold mb-4">Тақсимоти китобҳо</h3>
                        <ChartPieLabel />
                    </div>
                </section>
            </div>
        </ProtectedRoute>

    )
}

export default Page