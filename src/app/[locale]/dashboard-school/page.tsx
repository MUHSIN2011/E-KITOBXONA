'use client'
import { useGetActiveYearQuery, useGetMeQuery, useGetRegionsQuery, useGetReportsOverviewQuery, useGetSchoolBudgetQuery, useGetStudentsQuery } from '@/api/api'
import Card from '@/components/Card'
import { Book, BookUser, BookX, BookXIcon, GraduationCap, School } from 'lucide-react'
import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { ChartPieLabel } from '@/components/ui/chart-pie-label'
import { DashboardMainChart } from '@/components/ui/DashboardMainChart'
import { SchoolFinancialStatus } from '@/components/ui/SchoolFinancialStatus'
import DashboardFlow from '@/components/DashboardFlow'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useTranslations } from 'next-intl'

function Page() {
    const t = useTranslations('SchoolDashboard')    

    const { data: regions, isLoading, isError } = useGetRegionsQuery()
    const { data: me } = useGetMeQuery()
    const { data: activeYear } = useGetActiveYearQuery()
    const currentYearId = activeYear?.id


    const { data: items } = useGetReportsOverviewQuery(currentYearId, {
        skip: !currentYearId
    });
    const { data: students } = useGetStudentsQuery({ skip: 0, limit: 1 })

    useEffect(() => {
        if (items) {
            console.log("Маълумоти сол омад:", items);
            console.log("ID-и аниқ:", items);
        }
    }, [items]);

    const { data: budget, isLoading: isBudgetLoading } = useGetSchoolBudgetQuery(
        {
            schoolId: me?.school_id as number,
            yearId: items?.academic_year_id as number,
        },
        {
            skip: !me?.school_id || !items?.academic_year_id
        }
    );

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
        <div onClick={() => window.location.reload()} className='flex gap-2 items-center border bg-blue-600 text-white rounded-sm px-4 py-2 cursor-pointer'>
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
                        NameRole={t('stats.totalBooks')}
                        cnt={items?.total_books?.toString() || '0'}
                        Icons={<Book className="text-blue-600" />}
                        description={t('stats.totalBooksDesc')}
                    />
                    <Card
                        path='/rentals'
                        data-aos="fade-up" data-aos-delay="200"
                        NameRole={t('stats.rented')}
                        cnt={items?.rented_books?.toString() || '0'}
                        Icons={<BookUser className="text-orange-400" />}
                        description={t('stats.rentedDesc')}
                    />
                    <Card
                        path='/books-school'
                        data-aos="fade-up" data-aos-delay="300"
                        NameRole={t('stats.lost')}
                        cnt={items?.lost_books?.toString() || '0'}
                        Icons={<BookXIcon className="text-red-600" />}
                        description={t('stats.lostDesc')}
                    />
                    <Card
                        data-aos="fade-up" data-aos-delay="400"
                        path='/students'
                        NameRole={t('stats.students')}
                        cnt={students?.total?.toString() || '0'}
                        Icons={<GraduationCap className="text-purple-600" />}
                        description={t('stats.studentsDesc')}
                    />
                </section>

                <SchoolFinancialStatus
                    balance={budget?.balance || '0'}
                    rentalIncome={budget?.total_income || '0'}
                    totalExpenses={budget?.total_expenses || '0'}
                    paybackPercent={budget?.total_expenses > 0
                        ? (budget.total_income / budget.total_expenses) * 100
                        : 0
                    }
                />
                <DashboardFlow />

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
                    <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border shadow-sm" data-aos="zoom-in">
                        <h3 className="text-lg font-semibold mb-4">{t('charts.annualStatistics')}</h3>
                        <DashboardMainChart />
                    </div>
                    <div className="lg:col-span-1 bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border shadow-sm" data-aos="zoom-in" data-aos-delay="200">
                        <h3 className="text-lg font-semibold mb-4">{t('charts.bookDistribution')}</h3>
                        <ChartPieLabel />
                    </div>
                </section>
            </div>
        </ProtectedRoute>

    )
}

export default Page