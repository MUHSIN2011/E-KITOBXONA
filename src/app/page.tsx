"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useLoginUserMutation } from "../api/api";
import { useForm } from "react-hook-form";
import { SaveToken } from "@/utils/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter()
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (formData: any) => {
    try {
      const result = await loginUser(formData).unwrap();

      if (result.access_token && result.refresh_token) {
        SaveToken(result.access_token, result.refresh_token);
      }
      router.push('/dashboard')

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full flex justify-center px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-xl mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">E-KITOBXONA</h1>
          <p className="text-muted-foreground mt-1">Системаи идоракунии китобхона</p>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-2xl p-8 border border-border shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-foreground">Хуш омадед!</h2>
            <p className="text-sm text-muted-foreground mt-1">Барои ворид шудан маълумотро нависед</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Почтаи электронӣ</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  {...register("email", { required: "Email ҳатмист" })}
                  type="email"
                  placeholder="email@example.com"
                  className={`pl-10 h-12 rounded-xl ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message as string}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium">Рамз</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  Рамзро фаромӯш кардед?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  {...register("password", { required: "Рамз ҳатмист" })}
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 h-12 rounded-xl ${errors.password ? "border-red-500" : ""}`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message as string}</p>}
            </div>

            <Button
              disabled={isLoading}
              type="submit"
              className="w-full bg-blue-500 h-12 hover:bg-blue-600 rounded-xl text-base font-semibold text-white shadow-md mt-2"
            >
              {isLoading ? "Дар ҳоли воридшавӣ..." : "Ворид шудан"}
            </Button>
          </form>

          <p className="text-center mt-8 text-sm text-muted-foreground">
            Ҳисоб надоред?{" "}
            <Link href='/register' className="text-blue-500 hover:text-blue-600 font-bold">
              Бақайдгирӣ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}