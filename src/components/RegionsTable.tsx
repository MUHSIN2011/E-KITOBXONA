"use client"
import React from 'react'; 
import { useGetRegionsQuery } from '@/src/api/api';

interface Region {
    id: number | string;
    name: string;
}

const RegionsTable: React.FC = () => {
    const { data: regions, isLoading } = useGetRegionsQuery<any>();

    if (isLoading) return (
        <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="animate-spin inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
            <p className="text-gray-500">Дар ҳоли боргузорӣ...</p>
        </div>
    );

    return (
        <div className="overflow-x-auto rounded-sm border-gray-200 bg-white">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Вилоят</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Мактабҳо</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Китобҳо</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Бозпардохт</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {regions?.map((region: Region) => { 
                        const percentage = Math.floor(Math.random() * 100);
                        const barColor = percentage > 70 ? 'bg-green-500' : percentage > 40 ? 'bg-blue-500' : 'bg-red-500';

                        return (
                            <tr key={region.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-semibold text-gray-800">{region.name}</td>
                                <td className="p-4 text-gray-600">100</td>
                                <td className="p-4 text-gray-600 font-mono">125,000</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 max-w-37.5 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${barColor} transition-all duration-500`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-sm font-bold ${percentage > 70 ? 'text-green-600' : 'text-blue-600'}`}>
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
    );
};

export default RegionsTable;