'use client'

import React, { useMemo, useState } from 'react'
import { useGetMeQuery, usePatchMeMutation, useDeleteMeMutation } from '@/api/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import {
    User,
    Clock,
    CheckCircle2,
    Pen,
    ShieldCheck,
    Trash2,
} from 'lucide-react'

function ProfilePage() {
    const { data: user, isLoading } = useGetMeQuery()
    const [message, setMessage] = useState('')

    const [patchMe, { isLoading: isUpdating, error: updateError }] = usePatchMeMutation()
    const [deleteMe, { isLoading: isDeleting }] = useDeleteMeMutation()

    const profileFields = useMemo(
        () => {
            const allFields = [
                { label: 'ID', value: user?.id ?? '—' },
                { label: 'Ному насаб', value: user?.full_name ?? '—' },
                {label: 'Роҳбарият', value: user?.role === 'ministry' ? 'Маориф' : user?.role === 'region' ? 'Вилоят' : user?.role === 'district' ? 'Ноҳия' : user?.role || '—'},
                { label: 'Почтаи электронӣ', value: user?.email ?? '—' },
                { label: 'Ҳолати фаъолият', value: user?.is_active ? 'Фаъол' : 'Ғайрифаъол' },
                { label: 'Верификатсия', value: user?.is_verified ? 'Тасдиқшуда' : 'Мунтазири тасдиқ' },
                { label: 'ID Вилоят', value: user?.region_id ?? '—', key: 'region_id' },
                { label: 'Номи Вилоят', value: user?.region_name ?? '—', key: 'region_name' },
                { label: 'ID Ноҳия', value: user?.district_id ?? '—', key: 'district_id' },
                { label: 'Номи Ноҳия', value: user?.district_name ?? '—', key: 'district_name' },
                { label: 'ID Мактаб', value: user?.school_id ?? '—' },
                { label: 'Санаи эҷод', value: user?.created_at ? new Date(user.created_at).toLocaleString('tg-TJ') : '—' },
                { label: 'Вуруди охирин', value: user?.last_login ? new Date(user.last_login).toLocaleString('tg-TJ') : '—' },
            ];

            if (user?.role === 'ministry') {
                return allFields.filter(field =>
                    !['region_id', 'region_name', 'district_id', 'district_name', 'school_id'].includes(field.key || '')
                );
            }

            return allFields;
        },
        [user]
    )

    const handleEmailUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setMessage('')

        const formData = new FormData(event.currentTarget)
        const emailValue = String(formData.get('email') || '')

        try {
            await patchMe({ email: emailValue }).unwrap()
            setMessage('Почтаи электронӣ бо муваффақият навсозӣ шуд.')
        } catch {
            setMessage('Хатогӣ ҳангоми навсозӣ. Лутфан баъдтар бозгардед.')
        }
    }

    const handleDeleteAccount = async () => {
        setMessage('')

        try {
            await deleteMe().unwrap()
            setMessage('Аккаунт бо муваффақият нест карда шуд. Лутфан дубора ворид шавед.')
        } catch {
            setMessage('Хатогӣ ҳангоми нест кардан. Лутфан баъдтар бозгардед.')
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[85vh] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <section className="overflow-hidden rounded-[2rem] bg-slate-950/95 shadow-2xl shadow-slate-900/40 ring-1 ring-white/10">
                <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 px-8 py-10 sm:px-12 sm:py-12">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_40%)]" />
                    <div className="relative grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
                        <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-blue-500 shadow-[0_30px_80px_-40px_rgba(59,130,246,0.85)]">
                            <User className="text-white" size={48} />
                        </div>
                        <div className="space-y-4 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">
                                <ShieldCheck className="text-emerald-300" size={16} />
                                Профили корбарӣ
                            </div>
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                    {user?.full_name || 'Корбари система'}
                                </h1>
                                <p className="mt-2 text-sm text-slate-300 sm:text-base">
                                    Ин саҳифа ҳамаи маълумоти профил ва мавқеи шумо дар системаро нишон медиҳад.
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                                <Badge className="rounded-full bg-blue-500/95 px-4 py-1 text-xs uppercase tracking-[0.12em] text-slate-100">
                                    {user?.role || '—'}
                                </Badge>
                                <Badge className={`rounded-full px-4 py-1 text-xs uppercase tracking-[0.12em] ${user?.is_active ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/15 text-rose-200'}`}>
                                    {user?.is_active ? 'Фаъол' : 'Ғайрифаъол'}
                                </Badge>
                                <Badge className={`rounded-full px-4 py-1 text-xs uppercase tracking-[0.12em] ${user?.is_verified ? 'bg-emerald-500/15 text-emerald-200' : 'bg-amber-500/15 text-amber-200'}`}>
                                    {user?.is_verified ? 'Тасдиқшуда' : 'Мунтазири тасдиқ'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.9fr]">
                <div className="space-y-6">
                    <Card className="py-4 shadow-xl bg-white/90 dark:bg-[#111827] border border-slate-200/70 dark:border-slate-800/70 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                Ҳисоб ва тамос
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-gray-800">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Почтаи электронӣ</p>
                                    <p className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">{user?.email ?? '—'}</p>
                                </div>
                                <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-gray-800">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Номи пурра</p>
                                    <p className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">{user?.full_name ?? '—'}</p>
                                </div>
                            </div>

                            <form onSubmit={handleEmailUpdate} className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Нав кардани email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={user?.email ?? ''}
                                        placeholder="example@mail.com"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="text-sm text-slate-500">Дар ин ҷо метавонед email-и худро тағйир диҳед.</div>
                                    <Button type="submit" disabled={isUpdating}>
                                        {isUpdating ? 'Дар ҳоли навсозӣ...' : 'Навсозӣ'}
                                    </Button>
                                </div>
                                {message && <p className="rounded-2xl border border-emerald-200/70 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-200">{message}</p>}
                                {updateError && (
                                    <p className="rounded-2xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-900/20 dark:text-rose-200">
                                        Хатогӣ ҳангоми навсозӣ. Лутфан баъдтар бозгардед.
                                    </p>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    <Card className=" border-slate-200/70 dark:border-slate-800/70 py-4 shadow-xl bg-white/90 dark:bg-gray-900/10 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                Мавқеъ ва маълумот
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            {profileFields.map((field) => (
                                <div key={field.label} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4 dark:border-slate-800/70 dark:bg-gray-800">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{field.label}</p>
                                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{String(field.value)}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="  py-4 shadow-xl bg-white/90 dark:bg-[#111827] backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                Амалиётҳои фаврӣ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-gray-800">
                                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                                    <Pen size={18} className="text-blue-500" />
                                    <div>
                                        <p className="font-semibold">Тағйир додани email</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Почтаи электрониро дар системаи корбарӣ навсозӣ кунед.</p>
                                    </div>
                                </div>
                            </div>

                            <Card className="border border-rose-200/70 bg-rose-50/80 p-5 text-rose-900 dark:border-rose-500/30 dark:bg-rose-950/50 dark:text-rose-100">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 rounded-2xl bg-rose-100 p-3 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
                                        <Trash2 size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold">Ҳисоби корбариро нобуд кардан</h3>
                                        <p className="mt-2 text-sm text-rose-700/90 dark:text-rose-200/90">
                                            Агар шумо аккаунтро нест кунед, дигар ба ин система дастрасӣ нахоҳед дошт.
                                        </p>
                                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm" disabled={isDeleting}>
                                                        {isDeleting ? 'Дар ҳоли несткунӣ...' : 'Нест кардан'}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Оё шумо итминон доред?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Ин амалиёт ба таври доимӣ ҳисобро нест мекунад ва барқарор намешавад.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Бекор кардан</AlertDialogCancel>
                                                        <AlertDialogAction variant="destructive" onClick={handleDeleteAccount}>
                                                            Барадории доимӣ
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </CardContent>
                    </Card>

                    <Card className=" py-4 shadow-xl bg-white/90 dark:bg-gray-900/10 border backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                Суръатманд ва нишондиҳандаҳо
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-gray-800">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Маълумоти охирин</p>
                                        <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{user?.last_login ? new Date(user.last_login).toLocaleString('tg-TJ') : '—'}</p>
                                    </div>
                                    <Clock className="text-violet-500" />
                                </div>
                            </div>
                            <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-gray-800">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Созкорӣ</p>
                                        <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{user?.is_active ? 'Ҳозир фаъол' : 'Ҳозир ғайрифаъол'}</p>
                                    </div>
                                    <CheckCircle2 className={user?.is_active ? 'text-emerald-500' : 'text-amber-500'} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage