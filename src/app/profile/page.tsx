'use client'
import React from 'react'
import { useGetMeQuery } from '@/src/api/api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    User,
    Mail,
    Calendar,
    Clock,
    MapPin,
    CheckCircle2,
    XCircle
} from 'lucide-react'

function ProfilePage() {
    const { data: user, isLoading } = useGetMeQuery()
    console.log(user);
    

    if (isLoading) return (
        <div className="flex h-[85vh] items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    )

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="h-24 w-24 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg border-2 border-blue-400/50">
                        <User size={48} />
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-black">{user?.full_name || 'Корбари система'}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            <Badge className="bg-blue-500 hover:bg-blue-600 px-4 py-1 text-sm uppercase">
                                {user?.role}
                            </Badge>
                            {user?.is_active ? (
                                <Badge className="bg-green-500/20 text-green-400 border border-green-500/50 px-3">
                                    <CheckCircle2 size={12} className="mr-1" /> Фаъол
                                </Badge>
                            ) : (
                                <Badge className="bg-red-500/20 text-red-400 border border-red-500/50 px-3">
                                    <XCircle size={12} className="mr-1" />Ғайрифаъол
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-xl bg-white/80 dark:bg-[#1a1a1a] backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-slate-700 dark:text-white">
                            <Mail className="text-blue-500" size={18} /> Маълумоти тамос
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 bg-slate-50 dark:bg-black rounded-xl flex justify-between items-center">
                            <span className="text-slate-500 text-sm dark:text-slate-400">Почтаи электронӣ:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-300">{user?.email}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl  dark:bg-black flex justify-between items-center">
                            <span className="text-slate-500  dark:text-slate-400 text-sm">Статуси верификатсия:</span>
                            <span className={user?.is_verified ? "text-green-600 font-bold  " : "text-amber-600 font-bold"}>
                                {user?.is_verified ? "Тасдиқшуда" : "Мунтазири тасдиқ"}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white/80 dark:bg-[#1a1a1a] backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-slate-700 dark:text-white">
                            <MapPin className="text-red-500" size={18} /> Ҳудуди фаъолият
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-2 text-center text-xs font-bold uppercase tracking-wider">
                        <div className="p-3 bg-orange-50 dark:bg-red-900/60 rounded-xl text-orange-700 dark:text-white">
                            <p className="text-[10px] text-orange-500 opacity-70">Вилоят</p>
                            ID: {user?.region_name}
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-700 dark:bg-black">
                            <p className="text-[10px] text-blue-500 opacity-70">Ноҳия</p>
                            ID: {user?.district_name}
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl text-green-700 dark:text-green-300 dark:bg-green-500/50">
                            <p className="text-[10px] text-green-500 opacity-70 dark:text-green-300">Мактаб</p>
                            ID: {user?.full_name}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl md:col-span-2">
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-black rounded-2xl">
                            <div className="p-3 bg-white rounded-xl dark:bg-[#1a1a1a] shadow-sm">
                                <Calendar className="text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase">Санаи бақайдгирӣ</p>
                                <p className="font-bold text-slate-800">
                                    {new Date(user?.created_at).toLocaleDateString('tg-TJ')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-black rounded-2xl">
                            <div className="p-3 bg-white rounded-xl dark:bg-[#1a1a1a] shadow-sm">
                                <Clock className="text-purple-500" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase">Вуруди охирин</p>
                                <p className="font-bold text-slate-800">
                                    {new Date(user?.last_login).toLocaleString('tg-TJ')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center">
                <p className="text-slate-400 text-xs">ID-и беназири корбар: {user?.id} — Назорат аз ҷониби Вазорати Маориф</p>
            </div>
        </div>
    )
}

export default ProfilePage