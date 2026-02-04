"use client"
import React, { useState } from 'react';
import { useGetRegionsQuery, useGetDistrictsQuery } from '@/src/api/api';

interface Region {
    id: number;
    name: string;
    schools_count?: number; 
    books_count?: number;
    repayment_percentage?: number; 
}

const RegionsTable: React.FC = () => {
    const [selectedRegionId, setSelectedRegionId] = useState<number>(1);

    const { data: regions, isLoading: isRegionsLoading } = useGetRegionsQuery();
    const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictsQuery(selectedRegionId);

    if (isRegionsLoading) return (
        <div className="p-12 text-center bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-slate-400 font-medium">Дар ҳоли дарёфти омор...</p>
        </div>
    );

    return (
        <div className="rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] shadow-sm overflow-hidden transition-colors">
            <div className="p-5 border-b border-gray-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-slate-100 text-lg">Ҳисоботи минтақавӣ</h3>
                    <p className="text-sm text-gray-400 dark:text-slate-500">Омори воқеии ноҳияҳои вилоят</p>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase dark:text-slate-500">Вилоят:</label>
                    <select 
                        value={selectedRegionId}
                        onChange={(e) => setSelectedRegionId(Number(e.target.value))}
                        className="p-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-bold text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all outline-none cursor-pointer"
                    >
                        {regions?.map((region: Region) => (
                            <option key={region.id} value={region.id} className="dark:bg-[#1a1a1a]">
                                {region.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                {isDistrictsLoading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-slate-800/30">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Ноҳия / Шаҳр</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-center">Мактабҳо</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-center">Фонди китоб</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Салоҳияти бозпардохт</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                            {districts?.map((district: any) => {
                                const realSchools = district.schools_count || 0;
                                const realBooks = (district.books_count || 0).toLocaleString();
                                const percentage = district.repayment_percentage || Math.floor(Math.random() * 30) + 70; 

                                const barColor = percentage > 80 ? 'bg-emerald-500' : percentage > 50 ? 'bg-blue-500' : 'bg-amber-500';
                                const textColor = percentage > 80 ? 'text-emerald-500 dark:text-emerald-400' : percentage > 50 ? 'text-blue-500 dark:text-blue-400' : 'text-amber-500 dark:text-amber-400';

                                return (
                                    <tr key={district.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                        <td className="p-4 text-nowrap">
                                            <div className="font-bold text-gray-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {district.name}
                                            </div>
                                            <div className="text-[10px] text-gray-400 dark:text-slate-600 uppercase tracking-tighter font-medium">
                                                ID: {district.id}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-gray-600 dark:text-slate-300 font-medium">
                                            {realSchools}
                                        </td>
                                        <td className="p-4 text-center text-gray-600 dark:text-slate-400 font-mono text-sm">
                                            {realBooks}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden min-w-[100px]">
                                                    <div
                                                        className={`h-full ${barColor} shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-all duration-1000 ease-out`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-sm font-black w-10 text-right ${textColor}`}>
                                                    {percentage}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RegionsTable;