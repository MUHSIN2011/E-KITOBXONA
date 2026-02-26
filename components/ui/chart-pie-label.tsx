"use client"

import * as React from "react"
import { BookOpen } from "lucide-react"
import { Label, Pie, PieChart, Cell } from "recharts"
import { useGetBooksSchoolQuery } from "@/src/api/api"

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
    available: { label: "Озод", color: "#22c55e" },
    rented: { label: "Дар иҷора", color: "#3b82f6" },
    damaged: { label: "Зарардида", color: "#eab308" },
    lost: { label: "Гумшуда", color: "#ef4444" },
    other: { label: "Дигар", color: "#cbd5e1" },
} satisfies ChartConfig

export function ChartPieLabel() {
    const { data, isLoading } = useGetBooksSchoolQuery({
        skip: 0,
        limit: 1000
    })

    const chartData = React.useMemo(() => {
        if (!data?.items) return []

        const stats = data.items.reduce((acc: Record<string, number>, item: any) => {
            const status = (item.status || "other").toLowerCase();
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(stats).map(([status, count]) => ({
            status,
            count,
            fill: chartConfig[status as keyof typeof chartConfig]?.color || chartConfig.other.color
        }));
    }, [data])

    if (isLoading) {
        return (
            <div className="flex h-[350px] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <Card className="flex flex-col border-none shadow-none bg-white dark:bg-[#1a1a1a]">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-xl font-bold">Ҳолати фонди китоб</CardTitle>
                <CardDescription>Тақсимот аз рӯи статус</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-50"
                >
                    <PieChart>
                        <ChartTooltip 
                            cursor={false} 
                            content={<ChartTooltipContent hideLabel />} 
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={60}
                            outerRadius={80}
                            strokeWidth={2}
                            stroke="#fff"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                            
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                    {data?.total || 0}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-sm">
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
            <CardFooter className="flex-col  text-sm">
                <div className="grid grid-cols-2 gap-x-4 ">
                    {chartData.map((item) => (
                        <div key={item.status} className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                            <span className="text-muted-foreground italic">
                                {chartConfig[item.status as keyof typeof chartConfig]?.label || item.status}:
                            </span>
                            <span className="font-bold">{item.count}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex items-center gap-2 font-medium border-t pt-2 w-full justify-center">
                    Ҳамагӣ: {data?.total || 0} адад <BookOpen className="h-4 w-4 text-blue-500" />
                </div>
            </CardFooter>
        </Card>
    )
}