"use client"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, Lock, MoveLeft } from "lucide-react";
import Link from "next/link";
import { useResetPasswordMutation } from "@/api/api";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Input } from "@/components/ui/input";

function Page() {
    const router = useRouter();
    const t = useTranslations('ForgetPassword');
    const l = useTranslations('LoginPage');

    const [showPassword, setShowPassword] = useState(false);
    const [ResetPassword, { isLoading }] = useResetPasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (formData: any) => {
        try {
            const savedData = JSON.parse(localStorage.getItem("ForgetPassword") || "{}");

            const payload = {
                email: savedData.email,
                code: savedData.code,
                new_password: formData.password
            };

            if (!payload.email || !payload.code) {
                toast.error("Маълумот ёфт нашуд, аз аввал оғоз кунед");
                return;
            }

            await ResetPassword(payload).unwrap();

            toast.success('Парол бо муваффақият иваз шуд!');

            localStorage.removeItem("ForgetPassword");

            router.push(`/`);
        } catch (error: any) {
            toast.error('Хатогӣ ҳангоми ивази парол!');
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
                        <h2 className="text-xl font-semibold">Ивази пароли нав</h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            Пароли нави худро ворид кунед
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="password">{l('LabelPassWord')}</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    {...register("password", {
                                        required: l('passwordRequired'),
                                        minLength: { value: 6, message: "Ҳадди ақал 6 аломат" }
                                    })}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Пароли нав"
                                    className={`pl-10 pr-10 h-12 rounded-xl ${errors.password ? "border-red-500" : ""}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message as string}</p>}
                        </div>

                        <Button disabled={isLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-white rounded-xl font-semibold">
                            {isLoading ? "Дар ҳоли фиристодан..." : "Иваз кардани парол"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <Link href="/" className="text-sm text-blue-500 flex items-center justify-center gap-2">
                            <MoveLeft className="w-4 h-4" /> {t('backToLogin')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;