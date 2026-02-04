"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useGetRentalsQuery } from "@/src/api/api"

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
    const { data, isLoading } = useGetRentalsQuery({ skip: 0, limit: 1000 })

    const chartData = React.useMemo(() => {
        if (!data?.items || data.items.length === 0) return [];

        const counts: Record<string, number> = {
            "январ": 0, "феврал": 0, "март": 0, "апрел": 0, "май": 0, "июн": 0,
            "июл": 0, "август": 0, "сентябр": 0, "октябр": 0, "ноябр": 0, "декабр": 0
        };

        const monthsInternal = [
            "январ", "феврал", "март", "апрел", "май", "июн",
            "июл", "август", "сентябр", "октябр", "ноябр", "декабр"
        ];

        data.items.forEach((student) => {
            student.rented_books?.forEach((book: any) => {
                if (book.rent_start) {
                    const parts = book.rent_start.split("-");
                    const monthIndex = parseInt(parts[1], 10) - 1;
                    const monthName = monthsInternal[monthIndex];
                    
                    if (monthName) {
                        counts[monthName] += 1;
                    }
                }
            });
        });

        const monthsOrder = [
            "январ", "феврал", "март", "апрел", "май", "июн",
            "июл", "август", "сентябр", "октябр", "ноябр", "декабр"
        ];

        // Моҳи ҷориро ёфта, 6 моҳи охирро нишон медиҳем
        const currentMonth = new Date().getMonth();
        const last6Months = [];
        
        for (let i = 5; i >= 0; i--) {
            let idx = currentMonth - i;
            if (idx < 0) idx += 12;
            const m = monthsOrder[idx];
            last6Months.push({
                month: m.charAt(0).toUpperCase() + m.slice(1),
                rentals: counts[m]
            });
        }

        return last6Months;
    }, [data]);

    if (isLoading) return (
        <div className="flex h-[350px] items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    )

    return (
        <Card className="border-none shadow-none bg-white dark:bg-[#1a1a1a]">
            <CardHeader>
                <CardTitle>Динамикаи иҷораи китобҳо</CardTitle>
                <CardDescription>Миқдори китобҳои додашуда дар 6 моҳи охир</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[320px] w-full">
                    <AreaChart
                        data={chartData}
                        margin={{ left: 12, right: 12, top: 10, bottom: 0 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                            dataKey="rentals"
                            type="monotone"
                            fill="var(--color-rentals)"
                            fillOpacity={0.2}
                            stroke="var(--color-rentals)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}