"use client"
import React from 'react';
import { useGetRegionsQuery } from '@/src/api/api';

interface Region {
    id: number;
    name: string;
    schools_count?: number; 
    books_count?: number;
}

const RegionsTable: React.FC = () => {
    const { data: regions, isLoading } = useGetRegionsQuery();

    if (isLoading) return (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 font-medium">Дар ҳоли дарёфти омори минтақаҳо...</p>
        </div>
    );

    return (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="p-5 border-b border-gray-50">
                <h3 className="font-bold text-gray-800">Ҳисоботи минтақавӣ</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Вилоят / Минтақа</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Мактабҳо</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Фонди китоб</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Салоҳияти бозпардохт</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {regions?.map((region) => {
                            const mockSchools = (region.id * 12) + 40;
                            const mockBooks = (mockSchools * 1250).toLocaleString();
                            const percentage = Math.min(Math.max((region.id * 15) % 100, 35), 95);

                            const barColor = percentage > 80 ? 'bg-emerald-500' : percentage > 50 ? 'bg-blue-500' : 'bg-amber-500';
                            const textColor = percentage > 80 ? 'text-emerald-600' : percentage > 50 ? 'text-blue-600' : 'text-amber-600';

                            return (
                                <tr key={region.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-700 group-hover:text-blue-700">{region.name}</div>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-tighter">ID: {region.id}</div>
                                    </td>
                                    <td className="p-4 text-center text-gray-600 font-medium">{mockSchools}</td>
                                    <td className="p-4 text-center text-gray-600 font-mono text-sm">{mockBooks}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[100px]">
                                                <div
                                                    className={`h-full ${barColor} transition-all duration-1000 ease-out`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className={`text-sm font-black w-10 ${textColor}`}>
                                                {percentage}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RegionsTable;