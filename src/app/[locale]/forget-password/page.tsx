"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Lock, Mail, Eye, EyeOff, KeyRound } from "lucide-react";
import Link from "next/link";
import { useLoginUserMutation } from "@/api/api";
import { useForm } from "react-hook-form";
import { SaveToken } from "@/utils/axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

function Page() {

    const router = useRouter()
    const locale = useLocale();
    const t = useTranslations('ForgetPassword')
    const l = useTranslations('LoginPage')
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const [showPassword, setShowPassword] = useState(false);


    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (formData: any) => {
        try {
            const result = await loginUser(formData).unwrap();

            if (result.access_token) {
                SaveToken(result.access_token, result.refresh_token);

                const decoded = jwtDecode<any>(result.access_token);
                const role = decoded.role;

                localStorage.setItem("user", JSON.stringify({
                    role: role,
                    email: decoded.email,
                    id: decoded.sub
                }));

                toast.success(l('welcomeMessage'));

                setTimeout(() => {
                    let path = '/dashboard';
                    if (role === 'school') path = '/dashboard-school';
                    else if (role === 'region') path = '/dashboard-region';
                    else if (role === 'district') path = '/dashboard-district';

                    router.push(`/${locale}${path}`);
                }, 500);
            }
        } catch (error: any) {
            if (error.status === 401) {
                toast.error(l('emailOrPasswordError'));
                return;
            }

            const serverMessage = error.data?.detail?.[0]?.msg || error.data?.detail || null;

            if (serverMessage) {
                toast.error(typeof serverMessage === 'string' ? serverMessage : l('dataError'));
            } else {
                toast.error(l('wifiError'));
            }
        }
    };

    return (
        <div className="flex justify-center px-4 md:py-10">
            <Toaster />
            <div className="w-full max-w-100 m-auto">
                <div className="text-center md:mb-6 mb-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-xl mb-4 shadow-lg">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">{l('systemName')}</h1>
                    <p className="text-muted-foreground mt-1">{l('systemDescription')}</p>
                </div>

                <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 sm:p-8 border border-border shadow-xl">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-semibold text-foreground">{t('title')}</h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            {t('subtitle')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                {l('LabelEmail')}
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    {...register("email", { required: l('emailRequired') })}
                                    type="email"
                                    placeholder={l('emailPlaceholder')}
                                    className={`pl-10 h-12 rounded-xl ${errors.email ? "border-red-500" : ""}`}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message as string}</p>}
                        </div>

                        <Button
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-blue-600 h-12 cursor-pointer hover:bg-blue-700 disabled:opacity-80 disabled:cursor-not-allowed rounded-xl text-base font-semibold text-white shadow-md mt-2 transition-all duration-200 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                                </div>
                            ) : (
                                t('sendButton')
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                        >
                            {t('backToLogin')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page