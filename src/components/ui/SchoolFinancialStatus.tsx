"use client"
import { TrendingUp, Wallet, ArrowDownCircle, ArrowUpCircle, Percent } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl";

interface SchoolFinancialStatusProps {
  balance: number;
  rentalIncome: number;
  totalExpenses: number;
  paybackPercent?: number; // Фоизи рӯйпӯшшавии хароҷот
}

export const SchoolFinancialStatus = ({
  balance,
  rentalIncome,
  totalExpenses,
  paybackPercent = 0
}: SchoolFinancialStatusProps) => {
  const t = useTranslations('SchoolFinancialStatus')

  const safePercent = Math.min(Math.max(paybackPercent, 0), 100);

  return (
    <div data-aos="fade-right" className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-blue-50/50 py-2 border-blue-100 dark:bg-gray-800 pt-4 dark:border-0 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-600">
            <Wallet className="h-4 w-4" /> {t('budget.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{balance?.toLocaleString()} смн.</div>
          <p className="text-[10px] text-blue-400 mt-1 uppercase font-semibold">{t('budget.description')}</p>
        </CardContent>
      </Card>

      <Card className="bg-red-50/50 py-2 border-red-100 dark:bg-gray-800 pt-4 dark:border-0 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-600">
            <ArrowDownCircle className="h-4 w-4" /> {t('expenses.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">-{totalExpenses?.toLocaleString()} смн.</div>
          <p className="text-[10px] text-red-400 mt-1 uppercase font-semibold">{t('expenses.description')}</p>
        </CardContent>
      </Card>

      <Card className="bg-green-50/50 py-2 border-green-100 dark:bg-gray-800 pt-4 dark:border-0 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600">
            <ArrowUpCircle className="h-4 w-4" /> {t('income.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">+{rentalIncome?.toLocaleString()} смн.</div>
          <p className="text-[10px] text-green-500 mt-1 flex items-center gap-1 uppercase font-semibold">
            <TrendingUp className="h-3 w-3" /> {t('income.description')}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-orange-50/50 py-2 border-orange-100 dark:bg-gray-800 pt-4 dark:border-0 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-600">
            <Percent className="h-4 w-4" /> {t('payback.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{paybackPercent.toFixed(1)}%</div>
          <div className="w-full bg-orange-100 dark:bg-orange-900/30 h-1.5 mt-3 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-1.5 transition-all duration-500"
              style={{ width: `${safePercent}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-orange-400 mt-1 uppercase font-semibold">
            {paybackPercent >= 100 ? t('payback.fullCovered') : t('payback.notCovered')}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}