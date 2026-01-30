"use client"
import { TrendingUp, Wallet, ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// Барои ин бояд GET /api/v1/finance/budgets/.../summary-ро истифода баред

export default  function SchoolFinancialStatus() {
  // Намунаи маълумот аз Swagger SchoolFinancialSummary
  const financialData = {
    total_budget: 50000,
    total_spent: 12000,
    total_revenue: 4500, // Аз иҷора ва ҷаримаҳо
    balance: 42500
  }

  const spentPercentage = (financialData.total_spent / financialData.total_budget) * 100

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-blue-50 border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Wallet className="h-4 w-4 text-blue-600" /> Бюджети умумӣ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{financialData.total_budget} смн.</div>
          <p className="text-xs text-muted-foreground mt-1">Маблағи ҷудошудаи вазорат</p>
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ArrowDownCircle className="h-4 w-4 text-red-600" /> Хароҷот
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">-{financialData.total_spent} смн.</div>
          <div className="w-full bg-red-200 h-1.5 mt-3 rounded-full">
            <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${spentPercentage}%` }}></div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4 text-green-600" /> Даромад (Иҷора)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">+{financialData.total_revenue} смн.</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +12% нисбат ба соли гузашта
          </p>
        </CardContent>
      </Card>
    </div>
  )
}