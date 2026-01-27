'use client'
import { useGetRegionsQuery } from '@/src/api/api'
import Card from '../../components/Card'
import { Building2, MapPin, School } from 'lucide-react'
import MyBarChart from '@/src/components/ChartComponent'
import DonutChart from '@/src/components/DonutChart'
import RegionsTable from '../../components/RegionsTable'
import MyLineChart from '@/src/components/MyLineChart'

function Page() {
    const { data: regions, isLoading, isError } = useGetRegionsQuery()

    if (isLoading) return <div>Дар ҳоли боргузорӣ...</div>
    if (isError) return <div>Хатогӣ ҳангоми гирифтани маълумот</div>

    return (
        <div className="p-6">
            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card
                        NameRole={'Ҳамагӣ вилоятҳо'}
                        cnt={regions?.length.toString() || '0'}
                        Icons={<MapPin />}
                        description={'Фаъол дар система'}
                    />
                    <Card
                        NameRole={'Ҳамагӣ ноҳияҳо'}
                        cnt={regions?.length.toString() || '0'}
                        Icons={<Building2 />}
                        description={`Дар ${regions?.length.toString() || '0'} вилоят`}
                    />
                    <Card
                        NameRole={'Ҳамагӣ мактабҳо'}
                        cnt={regions?.length.toString() || '0'}
                        Icons={<School />}
                        description={'Фаъол дар система'}
                    />
                    <Card
                        NameRole={'Ҳамагӣ хонандагон'}
                        cnt={regions?.length.toString() || '0'}
                        Icons={<MapPin />}
                        description={'Бақайдгирифташуда'}
                    />
                </div>
            </section>
            <section className='my-4 grid gap-5 grid-cols-1 lg:grid-cols-3'>
                <div className="lg:col-span-2">
                    <MyBarChart />
                </div>
                <div className="lg:col-span-1">
                    <DonutChart />
                </div>
            </section>
            <section className='border rounded-xl p-3 bg-white'>
                <h1 className='text-2xl font-semibold '>Вазъият аз рӯи вилоятҳо</h1>
                <p className='text-foreground text-sm mb-3'>Нишондиҳандаҳои асосии ҳар як вилоят</p>
                <RegionsTable />
            </section>
            <section className='border rounded-xl p-3 my-3 bg-white'>
                <h1 className='text-2xl font-semibold '>Раванди бозпардохт</h1>
                <p className='text-foreground text-sm mb-3'>Пешрафти умумии бозпардохти китобҳо дар 6 моҳи охир</p>
                <MyLineChart  />
            </section>
        </div>
    )
}

export default Page