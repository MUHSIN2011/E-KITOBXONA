"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetCopiesByIdQuery, useGetFinanceTrackingByCopyIdQuery } from '@/api/api';
import {
  ArrowLeft, BadgeCheck, CircleDollarSign,
  Calendar, History, Landmark, Wallet, Timer
} from 'lucide-react';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const BookById = Number(params?.GetById);

  const { data: book, isLoading } = useGetCopiesByIdQuery(BookById, { skip: isNaN(BookById) });
  const { data: finance } = useGetFinanceTrackingByCopyIdQuery(BookById, { skip: isNaN(BookById) });

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-gray-900 pb-20">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 font-bold transition-all"
          >
            <ArrowLeft size={18} /> Рӯйхати китобҳо
          </button>
          <div className="flex items-center gap-4">
            <span className={`text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest ${book?.status === 'rented' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {book?.status === 'rented' ? 'Дар иҷора' : 'Озод'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          <div className="lg:col-span-4 ">
            <div className="bg-white sticky top-20 dark:bg-gray-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-gray-800">
              <div className="relative rounded-[1.5rem] overflow-hidden bg-gray-100 h-[450px]">
                <img
                  src={`https://student4.softclub.tj${book?.textbook.cover_image_url}`}
                  alt={book?.textbook?.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-sm border border-slate-200 dark:border-gray-800">
              <div className="border-b border-slate-100 dark:border-gray-800 pb-6 mb-6">
                <h1 className="md:text-4xl text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {book?.textbook?.title}
                </h1>
                <p className="text-blue-600 font-bold flex items-center gap-2 mt-2">
                  <BadgeCheck size={20} /> {book?.textbook?.author}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ISBN</span>
                  <p className="font-mono text-slate-700 dark:text-slate-200">{book?.textbook?.isbn || "—"}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Нашриёт</span>
                  <p className="font-bold text-slate-700 dark:text-slate-200">{book?.textbook?.publisher}, {book?.textbook?.publication_year}</p>
                </div>
              </div>

              {finance && (
                <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border-2 border-blue-600/20 p-3 shadow-inner">
                  <div className="flex md:flex-row flex-col md:gap-0 gap-3 md:items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-600 rounded-2xl text-white">
                        <Landmark size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Шиносномаи молиявӣ</h3>
                        <p className="text-xs text-slate-400">Ҳисоботи пардохтпазирии инвентар</p>
                      </div>
                    </div>
                    {finance.is_paid_off ? (
                      <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-black text-xs animate-bounce">ПАРДОХТ ШУД ✅</div>
                    ) : (
                      <div className="bg-blue-50 dark:bg-gray-800 text-blue-600 px-4 py-2 rounded-xl font-black text-xs">ФОИЗ: {finance.payback_percentage}%</div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase"><Wallet size={12} /> Нархи харид</div>
                      <p className="text-xl font-black text-slate-900 dark:text-white">{finance.initial_cost} смн.</p>
                    </div>
                    <div className="space-y-1 ">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase"><CircleDollarSign size={12} /> Ҷамъшуда</div>
                      <p className="text-xl font-black text-emerald-600">+{finance.accumulated_value} смн.</p>
                    </div>
                    <div className="space-y-1 ">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase"><Timer size={12} /> Соли истифода</div>
                      <p className="text-xl font-black text-blue-600">{finance.years_in_use} сол</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="h-3 w-full bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                        style={{ width: `${Math.min(finance.payback_percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 dark:bg-gray-800 rounded-lg text-slate-400"><History size={16} /></div>
                      <div>
                        <span className="block text-[9px] text-slate-400 uppercase font-bold">Аввалин иҷора</span>
                        <span className="text-xs font-bold dark:text-white">{new Date(finance.first_rental_date).toLocaleDateString('tg-TJ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-end text-right">
                      <div>
                        <span className="block text-[9px] text-slate-400 uppercase font-bold">Охирин иҷора</span>
                        <span className="text-xs font-bold dark:text-white">{new Date(finance.last_rental_date).toLocaleDateString('tg-TJ')}</span>
                      </div>
                      <div className="p-2 bg-slate-50 dark:bg-gray-800 rounded-lg text-slate-400"><Calendar size={16} /></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Рақами инвентарӣ</span>
                  <p className="text-xl font-mono font-black text-slate-900 dark:text-white">{book?.inventory_number}</p>
                </div>
                <div className="h-10 w-[2px] bg-slate-100 dark:bg-gray-800"></div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Арзиши иҷора</span>
                  <p className="text-xl font-black text-blue-600">{book?.textbook?.rent_value_per_year} смн.</p>
                </div>
              </div>
              <button onClick={() => router.push('/rentals')} className="px-14 py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-300 dark:shadow-none uppercase tracking-tighter">
                Иҷора додан
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}