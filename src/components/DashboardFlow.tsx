"use client";

import { useRef } from "react";
import { CircleUser, Database, School, BookOpen, Landmark, Users, BarChart3, Cloud, Shield } from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { motion } from "framer-motion";

export default function DashboardFlow({UsersCount, total_books, BooksCount, RegionsCount}: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full mx-auto p-4 transition-colors duration-300">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Архитектураи Системаи Китобҳои Дарсӣ
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Раванди марказонидашудаи тақсимот ва идоракунии китобҳо</p>
      </div>

      <div
        className="relative w-full items-center justify-center overflow-hidden rounded-3xl border border-blue-100/50 dark:border-slate-800 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8 md:p-12 shadow-2xl shadow-blue-500/5 backdrop-blur-sm"
        ref={containerRef}
      >
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/10 to-indigo-100/5 dark:via-blue-900/10" />

        <div className="relative size-full flex flex-col items-stretch justify-between gap-16">
          <div className="flex flex-row items-center justify-between px-4">
            <motion.div
              ref={div1Ref}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative z-20 group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative flex size-16 md:size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-4 shadow-2xl shadow-blue-500/30 border-2 border-white/20 dark:border-slate-700/50 group-hover:scale-110 transition-all duration-300">
                <CircleUser className="size-8 md:size-10 text-white" />
              </div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Корбарони система</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Модераторҳо ва мудирон</p>
              </div>
            </motion.div>

            <motion.div
              ref={div2Ref}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative z-20 group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative flex size-16 md:size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 p-4 shadow-2xl shadow-green-500/30 border-2 border-white/20 dark:border-slate-700/50 group-hover:scale-110 transition-all duration-300">
                <BookOpen className="size-8 md:size-10 text-white" />
              </div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Китобҳои дарсӣ</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Нашрияҳо ва китобҳо</p>
              </div>
            </motion.div>

            <motion.div
              ref={div6Ref}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-20 group hidden md:block"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative flex size-16 md:size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-pink-600 to-purple-700 p-4 shadow-2xl shadow-purple-500/30 border-2 border-white/20 dark:border-slate-700/50 group-hover:scale-110 transition-all duration-300">
                <Users className="size-8 md:size-10 text-white" />
              </div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Донишҷӯён</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Истифодабарандагони асосӣ</p>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-row items-center justify-center">
            <motion.div
              ref={div3Ref}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="relative z-30 group"
            >
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30 rounded-full blur-3xl group-hover:blur-4xl transition-all duration-700" />
              <div className="absolute -inset-6 border-[3px] border-dashed border-blue-300/50 dark:border-blue-500/30 rounded-full animate-[spin_20s_linear_infinite]" />

              <div className="relative flex size-32 md:size-40 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 shadow-3xl shadow-indigo-500/40 border-4 border-white/30 dark:border-slate-800/60 group-hover:scale-105 transition-all duration-500">
                <School className="size-16 md:size-20 text-white" />
              </div>
            </motion.div>
          </div>

          <div className="flex flex-row items-center justify-between px-4">
            <motion.div
              ref={div4Ref}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="relative z-20 group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative flex size-16 md:size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 p-4 shadow-2xl shadow-amber-500/30 border-2 border-white/20 dark:border-slate-700/50 group-hover:scale-110 transition-all duration-300">
                <Database className="size-8 md:size-10 text-white" />
              </div>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Пойгоҳи дода</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Маълумотҳои система</p>
              </div>
            </motion.div>

            <motion.div
              ref={div5Ref}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="relative z-20 group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/20 to-red-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative flex size-16 md:size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 p-4 shadow-2xl shadow-rose-500/30 border-2 border-white/20 dark:border-slate-700/50 group-hover:scale-110 transition-all duration-300">
                <Landmark className="size-8 md:size-10 text-white" />
              </div>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Вазорат</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Назароти давлатӣ</p>
              </div>
            </motion.div>

            <motion.div
              ref={div7Ref}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="relative z-20 group hidden md:block"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative flex size-16 md:size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-cyan-700 p-4 shadow-2xl shadow-cyan-500/30 border-2 border-white/20 dark:border-slate-700/50 group-hover:scale-110 transition-all duration-300">
                <BarChart3 className="size-8 md:size-10 text-white" />
              </div>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Аналитика</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Омори система</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div3Ref} duration={3} gradientStartColor="#3b82f6" gradientStopColor="#6366f1" />
          <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div3Ref} duration={3.2} gradientStartColor="#10b981" gradientStopColor="#6366f1" />
          <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div3Ref} duration={2.8} gradientStartColor="#a855f7" gradientStopColor="#6366f1" />
          <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div4Ref} duration={3.5} gradientStartColor="#6366f1" gradientStopColor="#f59e0b" />
          <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div5Ref} duration={3.7} gradientStartColor="#6366f1" gradientStopColor="#f43f5e" reverse />
          <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div7Ref} duration={3.3} gradientStartColor="#6366f1" gradientStopColor="#06b6d4" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            color: "from-blue-500 to-blue-600",
            label: "Корбарони система",
            desc: "Дастрасӣ ба система",
            value: UsersCount
          },
          {
            color: "from-emerald-500 to-green-600",
            label: "Китобҳо",
            desc: "Нашрияҳои дарсӣ",
            value: total_books
          },
          {
            color: "from-indigo-500 to-purple-600",
            label: "Системаи марказӣ",
            desc: "Ядрои идоракунӣ",
            value: "V 1.0"
          },
          {
            color: "from-rose-500 to-red-600",
            label: "Вазорати маориф",
            desc: "Назорати давлатӣ",
            value: "Online"
          },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-3 p-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 min-w-[12px] rounded-full bg-gradient-to-r ${item.color}`}></div>
              <div className="overflow-hidden">
                <p className="font-bold text-[13px] text-slate-800 dark:text-slate-200 truncate">
                  {item.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {item.desc}
                </p>
              </div>
            </div>
            <div className="text-right pl-2">
              <p className={`font-black text-[13px] ${item.value === 'Online' ? 'text-green-500' : 'text-slate-900 dark:text-white'}`}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}