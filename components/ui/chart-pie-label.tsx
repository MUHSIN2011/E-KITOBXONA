"use client"

import * as React from "react"
import { BookOpen, TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { useGetBooksSchoolQuery } from "@/src/api/api" // Боварӣ ҳосил кунед, ки суроға дуруст аст

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
    count: { label: "Шумора", color: "#cbd5e1" }, 
    available: { label: "Озод", color: "#22c55e" },
    rented: { label: "Дар иҷора", color: "#3b82f6" },
    damaged: { label: "Зарардида", color: "#eab308" },
    lost: { label: "Гумшуда", color: "#ef4444" },
} satisfies ChartConfig

export function ChartPieLabel() {
    const { data, isLoading } = useGetBooksSchoolQuery({
        skip: 0,
        limit: 1000
    })

    const chartData = React.useMemo(() => {
        if (!data?.items) return []

        const stats = data.items.reduce((acc: Record<string, number>, item) => {
            const status = item.status.toLowerCase()
            acc[status] = (acc[status] || 0) + 1
            return acc
        }, {})

        return Object.entries(stats).map(([status, count]) => ({
            status,
            count,
            fill: chartConfig[status as keyof typeof chartConfig]?.color || "#cbd5e1"
        }))
    }, [data])

    if (isLoading) {
        return <div className="flex md:h-[85vh] items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    }

    return (
        <Card className="flex flex-col border-none shadow-none">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-xl">Ҳолати фонди китоб</CardTitle>
                <CardDescription>Тақсимоти нусхаҳо аз рӯи статус</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={50}
                            outerRadius={80}
                            strokeWidth={5}
                            labelLine={true}
                            label={({ status, percent }) =>
                                `${chartConfig[status as keyof typeof chartConfig]?.label} (${(percent * 100).toFixed(0)}%)`
                            }
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                                                    {data?.total || 0}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-xs">
                                                    Нусха
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Ҳамагӣ нусхаҳо: {data?.total || 0} адад <BookOpen className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Назорати ҳолати техникӣ ва мавҷудият
                </div>
            </CardFooter>
        </Card>
    )
}