"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Lock, Mail, University, UserCog, UserRoundPlus, MapPin, Map } from "lucide-react";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";

export default function RegisterPage() {
    const [role, setRole] = useState<string>("school");

    return (
        <div className="w-full flex justify-center px-4 py-10">
            <div className="w-full max-w-[400px] m-auto">
                <div className="text-center mb-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-xl mb-4 shadow-lg">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold ">E-KITOBXONA</h1>
                    <p className="text-muted-foreground mt-1">Системаи идоракунии китобхона</p>
                </div>

                <div className="bg-white dark:bg-slate-950 rounded-2xl px-8 py-5 border border-border shadow-xl">
                    <div className="text-center mb-5">
                        <h2 className="text-xl font-semibold text-foreground">Хуш омадед!</h2>
                        <p className="text-sm text-muted-foreground mt-1">Барои бақайдгирӣ маълумотро пур кунед</p>
                    </div>

                    <form className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="Почтаи электронӣ"
                                className="pl-10 h-10 rounded-xl border-slate-200"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="password"
                                placeholder="Рамз"
                                className="pl-10 h-10 rounded-xl border-slate-200"
                            />
                        </div>

                        <div className="relative">
                            <UserRoundPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Ному Насаб"
                                className="pl-10 h-10 rounded-xl border-slate-200"
                            />
                        </div>

                        <div className="relative">
                            <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                            <Select onValueChange={(value) => setRole(value)} defaultValue={role}>
                                <SelectTrigger className="w-full pl-10 h-12 rounded-xl">
                                    <SelectValue placeholder="Интихоби Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ministry">Вазорат</SelectItem>
                                    <SelectItem value="region">Вилоят</SelectItem>
                                    <SelectItem value="district">Ноҳия</SelectItem>
                                    <SelectItem value="school">Мактаб</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {(role === "region" || role === "district" || role === "school") && (
                            <div className="relative">
                                <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                                <Select>
                                    <SelectTrigger className="w-full pl-10 h-12 rounded-xl">
                                        <SelectValue placeholder="Интихоби вилоят" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dushanbe">Душанбе</SelectItem>
                                        <SelectItem value="sughd">Суғд</SelectItem>
                                        <SelectItem value="khatlon">Хатлон</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {(role === "district" || role === "school") && (
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                                <Select>
                                    <SelectTrigger className="w-full pl-10 h-12 rounded-xl">
                                        <SelectValue placeholder="Интихоби ноҳия" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="firdavsi">Фирдавсӣ</SelectItem>
                                        <SelectItem value="shoemansur">Шоҳмансур</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {role === "school" && (
                            <div className="relative">
                                <University className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                                <Select>
                                    <SelectTrigger className="w-full pl-10 h-12 rounded-xl">
                                        <SelectValue placeholder="Интихоби мактаб" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Мактаби №1</SelectItem>
                                        <SelectItem value="2">Мактаби №2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-blue-500 h-12 hover:bg-blue-600 duration-300 cursor-pointer rounded-xl text-base font-semibold text-white shadow-md shadow-blue-200 mt-2"
                        >
                            Бақайдгирӣ
                        </Button>
                    </form>

                    <p className="text-center mt-4 text-sm text-muted-foreground">
                        Ҳисоб доред?{" "}
                        <Link href={'/'} className="text-blue-500 hover:text-blue-600 font-bold">
                            Ворид шудан
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-5 italic">
                    © 2026 E-Kitobxona. Ҳамаи ҳуқуқҳо ҳифз шудаанд!
                </p>
            </div>
        </div>
    );
}