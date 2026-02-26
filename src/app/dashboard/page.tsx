'use client'
import { useCloseAcademicYearMutation, useCreateAcademicYearMutation, useGetActiveYearQuery, useGetRegionsQuery, useGetReportsOverviewQuery, useGetTextbooksQuery, useGetUsersCountQuery } from '@/src/api/api'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

function Page() {
    const { data: regions, isLoading, isError } = useGetRegionsQuery()
    const [closeYear, { isLoading: isClosing }] = useCloseAcademicYearMutation();
    const { data: usersData, isLoading: isGetUsers } = useGetUsersCountQuery();
    const [createYear, { isLoading: isLoadingcreateYear }] = useCreateAcademicYearMutation();
    const { data: books, isFetching, isLoading: booksLoading } = useGetTextbooksQuery();
    const { data: getyears } = useGetActiveYearQuery();
    const activeYearId = getyears?.id;
    const { data: overview } = useGetReportsOverviewQuery(getyears?.id);
    console.log(overview);

    console.log(usersData?.total_users);

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
        if (!activeYearId) {
            alert("ID-и соли таҳсил ёфт нашуд!");
            return;
        }

        if (window.confirm("Оё шумо мутмаин ҳастед, ки мехоҳед соли таҳсилро бандед? Ин амал баргардонда намешавад!")) {
            try {
                await closeYear(activeYearId).unwrap();
                alert("Соли таҳсил бо муваффақият баста шуд.");
            } catch (error) {
                alert("Хатогӣ ҳангоми бастан.");
            }
        }
    }
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            start_date: "2026-02-17",
            end_date: "2026-02-17"
        }
    });

    const onSubmit = async (data: any) => {
        try {
            await createYear(data).unwrap();
            toast.success("Соли таҳсил бомуваффақият сохта шуд!");
            reset();
        } catch (err) {
            toast.error("Хатогӣ ҳангоми сохтан");
        }
    };

    if (isLoading) return <div className="flex h-[85vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    if (isError) return <div className="flex justify-center flex-col items-center h-[80vh] gap-3">
        <h1 className="text-2xl text-center text-red-500 font-semibold">Хатогӣ ҳангоми гирифтани маълумот!!</h1>
        <p>Лутфан сайтро аз нав кушоед!</p>
        <div className='flex gap-2 items-center border bg-blue-600 text-white rounded-sm px-3 py-1 cursor-pointer'>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            <button className=' cursor-pointer'>Нав Сози</button>
        </div>
    </div>

    return (
        <ProtectedRoute allowedRoles={["ministry"]}>
            <div className="px-4 py-3">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-blue-100 dark:border-0 shadow-sm gap-4" data-aos="fade-down">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                            <CalendarDays className="text-blue-600" /> Соли таҳсили {getyears?.name}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-300">Назорати умумидавлатии фондҳои китоб</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleCloseYear}
                            disabled={isClosing}
                            className="bg-rose-600 hover:bg-rose-700 text-white flex gap-2"
                        >
                            <Lock className="w-4 h-4" /> {isClosing ? "Пайваст..." : "Бастани сол"}
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                    Иловаи соли нав
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Иловаи соли таҳсили нав</DialogTitle>
                                </DialogHeader>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div>
                                        <Label className='my-2'>Номи сол</Label>
                                        <Input {...register("name", { required: true })} placeholder="Масалан: 2026-2027" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className='my-2'>Санаи оғоз</Label>
                                            <Input type="date" {...register("start_date", { required: true })} />
                                        </div>
                                        <div>
                                            <Label className='my-2'>Санаи анҷом</Label>
                                            <Input type="date" {...register("end_date", { required: true })} />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full hover:bg-blue-500 cursor-pointer bg-blue-600" disabled={isLoading}>
                                        {isLoadingcreateYear ? "Дар ҳоли илова..." : "Захира кардан"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
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
                                cnt={books?.total.toString() || '0'}
                                Icons={<BookOpen />}
                                description={`Дар Вазорати Маориф`}
                            />
                        </div>
                        <div data-aos="fade-right" data-aos-delay="300">
                            <Card
                                path='/ministry'
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
                <DashboardFlow UsersCount={usersData?.total_users} total_books={overview?.total_books.toString()} />

                <section className='my-8 grid gap-5 grid-cols-1 lg:grid-cols-3'>
                    <div className="lg:col-span-2" data-aos="fade-up" data-aos-delay="300">
                        <MyBarChart />
                    </div>
                    <div className="lg:col-span-1" data-aos="zoom-in" data-aos-delay="300">
                        <ChartRadialLabel />
                    </div>
                </section>

                <section
                    className='border rounded-xl p-3 my-5 bg-white dark:bg-[#1a1a1a]'
                // data-aos="fade-up"
                // data-aos-delay="100"
                >
                    <h1 className='text-2xl font-semibold '>Вазъият аз рӯи вилоятҳо</h1>
                    <p className='text-foreground text-sm mb-3'>Нишондиҳандаҳои асосии ҳар як вилоят</p>
                    <RegionsTable />
                </section>

                <section
                    className='border rounded-xl p-3  bg-white dark:bg-[#1a1a1a]'
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