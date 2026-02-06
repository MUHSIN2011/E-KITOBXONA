"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetCopiesByIdQuery } from '@/src/api/api';
import Image from 'next/image';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const BookById = Number(params?.BookById);

  const { data: book, isLoading, error } = useGetCopiesByIdQuery(BookById, {
    skip: isNaN(BookById),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Маълумот боргузорӣ мешавад...</p>
        </div>
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
    <div className="min-h-screen bg-[#F3F4F6] pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all font-semibold">
            <span>←</span> Рӯйхати китобҳо
          </button>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${book.status === 'rented' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
              {book.status === 'rented' ? 'Ба иҷора дода шудааст' : 'Дастрас'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-200">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gray-50 p-6 flex items-center justify-center border-r border-gray-100">
              <div className="relative group">
                <div className="relative w-full h-[400px]">
                  <img
                    src={book.textbook?.cover_image_url || "Book cover"}
                    alt={book.textbook?.title || "Book cover"}
                    // fill
                    className="rounded-xl shadow-md object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                  {book.textbook?.grade} синф
                </div>
              </div>
            </div>

            <div className="md:w-2/3 p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                {book.textbook?.title}
              </h1>
              <p className="text-xl text-blue-600 font-semibold mt-2">{book.textbook?.author}</p>

              <div className="mt-8 space-y-4">
                <p className="text-gray-600 leading-relaxed italic border-l-4 border-blue-200 pl-4">
                  "{book.textbook?.description}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">ISBN</span>
                    <p className="text-gray-800 font-mono">{book.textbook?.isbn || "Мавҷуд нест"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Нашриёт</span>
                    <p className="text-gray-800 font-semibold">{book.textbook?.publisher} ({book.textbook?.publication_year})</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Бахши техникӣ ва нархҳо */}
          <div className="bg-gray-50/50 border-t border-gray-100 p-8 md:p-12">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Ҷузъиёти техникӣ</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <span className="block text-xs text-gray-400 font-bold mb-1 uppercase">Инвентар №</span>
                <span className="text-gray-900 font-mono font-bold">{book.inventory_number}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-bold mb-1 uppercase">Ҳолат</span>
                <span className="text-green-600 font-bold">{book.condition === 'new' ? 'Нав' : book.condition}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-bold mb-1 uppercase">Нархи чоп</span>
                <span className="text-gray-900 font-bold">{book.textbook?.print_price} сомонӣ</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-bold mb-1 uppercase">Иҷораи солона</span>
                <span className="text-blue-600 font-bold">{book.textbook?.rent_value_per_year} сомонӣ</span>
              </div>
            </div>

            <div className="mt-10 p-6 bg-blue-600 rounded-[1.5rem] flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-xl shadow-blue-200">
              <div>
                <p className="text-blue-100 text-sm">Санаи қабул:</p>
                <p className="text-xl font-bold">{new Date(book.received_at).toLocaleDateString('tg-TJ')}</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-10 py-4 bg-white text-blue-600 rounded-xl font-black hover:bg-gray-100 transition-colors shadow-lg">
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