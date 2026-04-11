"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetCopiesByIdQuery } from '@/api/api';
import Image from 'next/image';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const BookById = Number(params?.GetById);

  const { data: book, isLoading, error } = useGetCopiesByIdQuery(BookById, {
    skip: isNaN(BookById),
  });

  if (isLoading) {
    return (
      <div className="flex h-[85vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold">Хатогӣ!</h2>
        <p className="text-gray-500">Маълумот ёфт нашуд ё хатои сервер.</p>
        <button onClick={() => router.back()} className="mt-6 px-8 py-2 bg-gray-800 text-white rounded-xl">Ба қафо</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-gray-900 ">
      <div className="bg-white dark:bg-gray-800 border-b ">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-300 dark:hover:text-blue-600 hover:text-blue-600 transition-all font-semibold">
            <span>←</span> Рӯйхати китобҳо
          </button>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${book.status === 'rented' ? 'bg-orange-100 dark:bg-orange-900 dark:text-orange-300 text-orange-600' : 'bg-green-100 dark:bg-green-900 dark:text-green-300 text-green-600'}`}>
              {book.status === 'rented' ? 'Ба иҷора дода шудааст' : 'Дастрас'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row">
            <div className="bg-gray-50 dark:bg-gray-700 border-r border-gray-100 dark:border-gray-600">
              <div className="relative group">
                <div className="relative w-full md:h-[400px] h-[500px]">
                  <img
                    src={`https://student4.softclub.tj${book.textbook.cover_image_url}`}
                    alt={book.textbook?.title}
                    // fill

                    className=" shadow-md w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 md:-right-4 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                  {book.textbook?.grade} синф
                </div>
              </div>
            </div>

            <div className="md:w-2/3 p-8 md:p-12">
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                {book.textbook?.title}
              </h1>
              <p className="text-sm md:text-xl  text-blue-600 font-semibold mt-2">{book.textbook?.author}</p>

              <div className="mt-8 space-y-4">
                <p className="text-gray-600 leading-relaxed italic dark:text-gray-300 border-l-4 border-blue-200 pl-4">
                  "{book.textbook?.description}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/60 rounded-2xl">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">ISBN</span>
                    <p className="text-gray-800 font-mono dark:text-gray-200">{book.textbook?.isbn || "Мавҷуд нест"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/60 rounded-2xl">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Нашриёт</span>
                    <p className="text-gray-800 font-semibold dark:text-gray-200">{book.textbook?.publisher} ({book.textbook?.publication_year})</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50/50 dark:bg-gray-800 border-t border-gray-100 p-8 md:p-12">
            <h3 className="text-lg font-bold text-gray-800 mb-6 dark:text-gray-200">Ҷузъиёти техникӣ</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <span className="block text-xs text-gray-400 font-bold mb-1 uppercase dark:text-gray-400">Инвентар №</span>
                <span className="text-gray-900 font-mono font-bold dark:text-gray-200">{book.inventory_number}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-bold mb-1 uppercase dark:text-gray-400">Ҳолат</span>
                <span className="text-green-600 font-bold dark:text-green-400">{book.condition === 'new' ? 'Нав' : book.condition}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-bold mb-1 uppercase dark:text-gray-400">Нархи чоп</span>
                <span className="text-gray-900 font-bold dark:text-gray-200">{book.textbook?.print_price} сомонӣ</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-bold mb-1 uppercase dark:text-gray-400">Иҷораи солона</span>
                <span className="text-blue-600 font-bold dark:text-blue-400">{book.textbook?.rent_value_per_year} сомонӣ</span>
              </div>
            </div>

            <div className="mt-10 p-6 bg-blue-600 dark:bg-gray-900/60 rounded-[1.5rem] flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-xl shadow-blue-200 dark:shadow-gray-800">
              <div>
                <p className="text-blue-100 text-sm">Санаи қабул:</p>
                <p className="text-xl font-bold">{new Date(book.received_at).toLocaleDateString('tg-TJ')}</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button className="flex-1 md:flex-none dark:bg-gray-700 dark:text-white px-10 py-4 bg-white text-blue-600 rounded-xl font-black hover:bg-gray-100 transition-colors shadow-lg">
                  ИҶОРА ГИРИФТАН
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}