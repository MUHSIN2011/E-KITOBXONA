"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useGetRentalsQuery } from "@/src/api/api" //

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
    rentals: {
        label: "Иҷораҳо",
        color: "#3b82f6",
    },
} satisfies ChartConfig

export function DashboardMainChart() {
    // 1. Гирифтани маълумот аз API
    const { data, isLoading } = useGetRentalsQuery({ skip: 0, limit: 1000 })

    // 2. Коркарди маълумот
    const chartData = React.useMemo(() => {
        if (!data?.items || data.items.length === 0) return [];

        // 1. Объект барои захира (ҳамаи моҳҳоро бо 0 оғоз мекунем)
        const counts: Record<string, number> = {
            "январ": 0, "феврал": 0, "март": 0, "апрел": 0, "май": 0, "июн": 0,
            "июл": 0, "август": 0, "сентябр": 0, "октябр": 0, "ноябр": 0, "декабр": 0
        };

        data.items.forEach((item) => {
            if (item.rent_start) {
                const parts = item.rent_start.split("-");
                const monthIndex = parseInt(parts[1], 10) - 1;

                const monthsInternal = [
                    "январ", "феврал", "март", "апрел", "май", "июн",
                    "июл", "август", "сентябр", "октябр", "ноябр", "декабр"
                ];

                const monthName = monthsInternal[monthIndex];
                if (monthName) {
                    counts[monthName] += 1;
                }
            }
        });

        const monthsOrder = [
            "январ", "феврал", "март", "апрел", "май", "июн",
            "июл", "август", "сентябр", "октябр", "ноябр", "декабр"
        ];

        return monthsOrder.map(m => ({
            month: m.charAt(0).toUpperCase() + m.slice(1),
            rentals: counts[m]
        })).slice(0, 6);
    }, [data]);

    if (isLoading) return <div className="flex h-[85vh] items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

    if (chartData.length === 0) {
        return (
            <Card className="flex h-[350px] items-center justify-center border-none shadow-none">
                <p className="text-muted-foreground">Маълумот барои иҷора ёфт нашуд</p>
            </Card>
        )
    }

    return (
        <Card className="border-none shadow-none bg-white">
            <CardHeader>
                <CardTitle>Динамикаи иҷораи китобҳо</CardTitle>
                <CardDescription>Миқдори китобҳои додашуда аз рӯи моҳҳо</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="md:h-[320px] w-full">
                    <AreaChart
                        data={chartData}
                        margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis tickLine={false} axisLine={false} hide />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                            dataKey="rentals"
                            type="monotone"
                            fill="#3b82f6"
                            fillOpacity={0.2}
                            stroke="#3b82f6"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}