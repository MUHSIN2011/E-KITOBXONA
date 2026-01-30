"use client"

import { Book, AlertTriangle, XCircle, Share2 } from "lucide-react"
import { LabelList, RadialBar, RadialBarChart } from "recharts"
import { useGetReportsOverviewQuery } from "@/src/api/api"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
    count: { label: "Миқдор" },
    total: { label: "Ҳамагӣ", color: "hsl(var(--chart-1))" },
    rented: { label: "Дар иҷора", color: "hsl(var(--chart-2))" },
    damaged: { label: "Зарардида", color: "hsl(var(--chart-3))" },
    lost: { label: "Гумшуда", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig

export function ChartRadialLabel() {
    const { data: overview, isLoading } = useGetReportsOverviewQuery(1)

    const chartData = [
        { status: "total", count: overview?.total_books || 0, fill: "var(--color-total)" },
        { status: "rented", count: overview?.rented_books || 0, fill: "var(--color-rented)" },
        { status: "damaged", count: overview?.damaged_books || 0, fill: "var(--color-damaged)" },
        { status: "lost", count: overview?.lost_books || 0, fill: "var(--color-lost)" },
    ]

    if (isLoading) return <div className="flex h-[85vh] items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

    return (
        <Card className="flex flex-col border-none shadow-none bg-white">
            <CardHeader className="items-center pb-0">
                <CardTitle>Таносуби фонд</CardTitle>
                <CardDescription>Нишондиҳандаҳои умумии китобҳо</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={-90}
                        endAngle={270}
                        innerRadius={30}
                        outerRadius={110}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel nameKey="status" />}
                        />
                        <RadialBar dataKey="count" background>
                            <LabelList
                                position="insideStart"
                                dataKey="status"
                                className="fill-white capitalize mix-blend-luminosity"
                                fontSize={11}
                                formatter={(value: string) => chartConfig[value as keyof typeof chartConfig]?.label}
                            />
                        </RadialBar>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}