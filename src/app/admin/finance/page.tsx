import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { DollarSign, AlertCircle, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface FinanceStats {
    totalRevenue: number
    pendingAmount: number
    overdueAmount: number
}

async function getFinanceStats(): Promise<FinanceStats> {
    const supabase = await createClient()

    // Fetch payments
    const { data: payments } = await supabase
        .from('deal_payments' as any)
        .select('amount_usd, status') as any

    const totalPayments = (payments || []) as { amount_usd: number | null, status: string }[]
    const totalRevenue = totalPayments
        .filter(p => p.status === 'Paid')
        .reduce((sum, p) => sum + (p.amount_usd || 0), 0)

    const pendingAmount = totalPayments
        .filter(p => p.status === 'Pending')
        .reduce((sum, p) => sum + (p.amount_usd || 0), 0)

    const overdueAmount = totalPayments
        .filter(p => p.status === 'Overdue')
        .reduce((sum, p) => sum + (p.amount_usd || 0), 0)

    return { totalRevenue, pendingAmount, overdueAmount }
}

export default async function FinancePage() {
    const stats = await getFinanceStats()

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Finance</h1>
                    <p className="text-muted-foreground mt-1">
                        Track payments, expenses, and financial health
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold">Total Revenue (Paid)</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(stats.totalRevenue)}</p>
                    <p className="text-sm text-muted-foreground">From completed payments</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">Pending Receivables</h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">{formatCurrency(stats.pendingAmount)}</p>
                    <p className="text-sm text-muted-foreground">Expected incoming</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <h3 className="font-semibold">Overdue</h3>
                    </div>
                    <p className="text-2xl font-bold text-red-700">{formatCurrency(stats.overdueAmount)}</p>
                    <p className="text-sm text-muted-foreground">Action required</p>
                </Card>
            </div>

            <Card className="p-12 text-center border-dashed">
                <p className="text-muted-foreground">Detailed transaction ledger coming soon.</p>
            </Card>
        </div>
    )
}
