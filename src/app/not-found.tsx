"use client";
import Link from 'next/link'
import { BookOpen, Home, Search, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="relative mb-8">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

          <div className="relative z-10 mx-auto w-48 h-48 flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-20 blur-3xl"></div>
            <div className="relative w-40 h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 transform rotate-12">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative transform -rotate-12">
                <BookOpen className="w-24 h-24 text-white/90" />
                <AlertCircle className="absolute -top-2 -right-2 w-12 h-12 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-7xl md:text-9xl font-black mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>

        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Саҳифа ёфт нашуд
          </h2>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Саҳифае, ки шумо ҷустуҷӯ мекунед, вуҷуд надорад ё ба ҷои дигар кӯчонида шудааст.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Ҷустуҷӯи дубора</h3>
            <p className="text-sm text-slate-600">Номи саҳифаро дубора санҷед</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-xl mb-3">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Саҳифаи асосӣ</h3>
            <p className="text-sm text-slate-600">Ба саҳифаи асосии система баргардед</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-600 rounded-xl mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Хатогӣ</h3>
            <p className="text-sm text-slate-600">Хатои системаро гузориш диҳед</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <Button
            variant="outline"
            size="lg"
            className="px-8 h-12 text-base font-semibold border-blue-200 hover:bg-blue-50"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Баргаштан
          </Button>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Агар ин хаторо такрор дидед, лутфан ба мудири система муроҷиат кунед.
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
              Тамос бо дастгирӣ
            </Link>
          </p>
        </div>

        {/* <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style> */}
      </div>
    </div>
  )
}