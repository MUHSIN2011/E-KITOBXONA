"use client"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BookOpen, MoveLeft } from "lucide-react";
import Link from "next/link";
import { useForgotPasswordMutation, useVerifyResetCodeMutation } from "@/api/api";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { useTranslations } from "next-intl";
import { useRef, useState, useEffect } from "react";

function Page() {
    const router = useRouter();
    const t = useTranslations('ForgetPassword');
    const l = useTranslations('LoginPage');
    const finalData = JSON.parse(localStorage.getItem("ForgetPassword") || "{}");
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [VerifyResetCode, { isLoading, isSuccess }] = useVerifyResetCodeMutation();
    const [ForgotPassword, { isLoading: isLoading2 }] = useForgotPasswordMutation();

    const {
        handleSubmit,
        setValue,
        setError,      // Илова шуд
        clearErrors,   // Илова шуд
        formState: { errors }
    } = useForm();

    useEffect(() => {
        const fullCode = code.join('');
        setValue('code', fullCode);

        // Агар корбар камаш як рақам монад, хатогиро тоза мекунем
        if (fullCode.length > 0) {
            clearErrors('code');
        }
    }, [code, setValue, clearErrors]);

    const onSubmit = async () => {
        const fullCode = code.join('');

        if (fullCode.length < 6) {
            setError('code', {
                type: 'manual',
                message: 'Лутфан кодро пурра ворид кунед (6 рақам)'
            });
            return;
        }

        try {
            const savedData = JSON.parse(localStorage.getItem("ForgetPassword") || "{}");
            localStorage.setItem("ForgetPassword", JSON.stringify({ ...savedData, code: fullCode }));

            const email = finalData?.email;
            await VerifyResetCode({ email, code: fullCode }).unwrap();

            toast.success('Код тасдиқ шуд!');
            router.push(`/Reset-Password`);
        } catch {
            toast.error('Код Хато Аст!');
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pasteData)) return;

        const newCode = [...code];
        pasteData.split('').forEach((char, index) => {
            newCode[index] = char;
        })

        setCode(newCode);

        const focusIndex = pasteData.length < 6 ? pasteData.length : 5;
        inputRefs.current[focusIndex]?.focus();
    };

    const handleChange = (index: number, value: string) => {
        const char = value.slice(-1);
        if (!/^\d?$/.test(char)) return;

        const newCode = [...code];
        newCode[index] = char;
        setCode(newCode);

        if (char && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };


    const handleSendAgain = async (finalData: any) => {
        if (isLoading2) return;
        try {
            await ForgotPassword({ email: finalData.email }).unwrap()
            toast.success('письмо будет отправлено на вашу почту');
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error) {
            toast.error('Хатоги ҳангоми равон куни!')
        }
    };
    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
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

                <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 sm:p-8 border border-border shadow-xl">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-semibold">Ворид кардани код</h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            Код ба <span className='font-bold underline'>{finalData.email}</span> фиристода шуд
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Коди тасдиқ</Label>
                            <div className="flex flex-col gap-2 items-center">
                                <div className="flex gap-2 sm:gap-4 justify-center">
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { inputRefs.current[index] = el; }}
                                            onPaste={handlePaste}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg transition-all duration-300
                                            ${errors.code ? 'border-red-500' : isSuccess ? 'border-green-500 bg-green-50' : 'border-gray-200 focus:border-blue-500 outline-none'}
                                            ${isLoading2 ? 'border-2  border-gray-200' : ''}`}
                                        />
                                    ))}
                                </div>
                                {errors.code && (
                                    <p className="text-red-500 text-xs font-medium animate-bounce mt-1">
                                        {errors.code.message as string}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button disabled={isLoading} type="submit" className="w-full bg-blue-600 h-12 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                            {isLoading ? "Дар ҳоли фиристодан..." : t('sendButton')}
                        </Button>
                    </form>

                    <button
                        disabled={isLoading2}
                        onClick={() => handleSendAgain(finalData)}
                        className={`disabled:opacity-50 mt-4 text-center w-full  ${!isLoading2 ? 'cursor-pointer' : 'cursor-not-allowed'} text-sm text-blue-500 disabled:cursor-not-allowed`}
                    >
                        {isLoading2 ? "Дар ҳоли фиристодан..." : "Дубора равон кардани код!"}
                    </button>

                    <div className="mt-4 text-center m-auto ">
                        <Link href="/forget-password" className="text-sm text-blue-500 flex items-center justify-center gap-2"><MoveLeft />{t('backToLogin')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;