"use client"
import { TrendingUp, Wallet, ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SchoolFinancialStatusProps {
  balance?: number;
  rentalIncome?: number;
  totalExpenses?: number;
  allocatedBudget?: number; 
}

export default function SchoolFinancialStatus({
  balance = 0,
  rentalIncome = 0,
  totalExpenses = 0,
  allocatedBudget = 1 
}: SchoolFinancialStatusProps) {

  const spentPercentage = Math.min(Math.round((totalExpenses / (allocatedBudget || 1)) * 100), 100);

  return (
    <div data-aos="fade-right" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Бюджет */}
      <Card className="bg-blue-50/50 border-blue-100 dark:bg-[#1a1a1a] dark:border-0 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-600">
            <Wallet className="h-4 w-4" /> Бюджети ҷорӣ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{balance.toLocaleString()} смн.</div>
          <p className="text-[10px] text-blue-400 mt-1 uppercase font-semibold">Баланси умумии мактаб</p>
        </CardContent>
      </Card>

      {/* Хароҷот */}
      <Card className="bg-red-50/50 border-red-100 dark:bg-[#1a1a1a] dark:border-0 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-600">
            <ArrowDownCircle className="h-4 w-4" /> Хароҷот
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">-{totalExpenses.toLocaleString()} смн.</div>
          <div className="w-full bg-red-100 dark: h-1.5 mt-3 rounded-full overflow-hidden">
            <div
              className="bg-red-500 h-1.5 transition-all duration-500"
              style={{ width: `${spentPercentage}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-red-400 mt-1 uppercase font-semibold">{spentPercentage}% сарф шуд</p>
        </CardContent>
      </Card>

      {/* Даромад */}
      <Card className="bg-green-50/50 border-green-100 dark:bg-[#1a1a1a] dark:border-0 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600">
            <ArrowUpCircle className="h-4 w-4" /> Даромад (Иҷора)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">+{rentalIncome.toLocaleString()} смн.</div>
          <p className="text-[10px] text-green-500 mt-1 flex items-center gap-1 uppercase font-semibold">
            <TrendingUp className="h-3 w-3" /> Аз ҳисоби пардохти волидайн
          </p>
        </CardContent>
      </Card>
    </div>
  )
}