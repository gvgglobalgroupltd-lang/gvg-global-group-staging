'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { PaymentScheduleTable } from '@/components/finance/PaymentScheduleTable'
import { PLSummaryCard } from '@/components/finance/PLSummaryCard'
import { AddPaymentModal } from '@/components/finance/AddPaymentModal'
import { AddExpenseModal } from '@/components/finance/AddExpenseModal'
import { LCAlertSummary } from '@/components/finance/LCAlertBadge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { PaymentScheduleItem, ActualExpense, LCAlert } from '@/lib/finance/payment-calculations'

interface FinancePageProps {
    params: { id: string }
}

export default function FinancePage({ params }: FinancePageProps) {
    const [payments, setPayments] = useState<PaymentScheduleItem[]>([])
    const [expenses, setExpenses] = useState<ActualExpense[]>([])
    const [lcAlerts, setLCAlerts] = useState<LCAlert[]>([])
    const [deal, setDeal] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const { toast } = useToast()

    useEffect(() => {
        loadFinanceData()
    }, [params.id, refreshTrigger])

    async function loadFinanceData() {
        setIsLoading(true)

        try {
            const supabase = createClient()

            // Load deal
            const { data: dealData, error: dealError } = await supabase
                .from('deals')
                .select('*')
                .eq('id', params.id)
                .single()

            if (dealError) throw dealError
            setDeal(dealData)

            // Load payments
            const { data: paymentsData, error: paymentsError } = await supabase
                .from('deal_payments')
                .select('*')
                .eq('deal_id', params.id)
                .order('due_date', { ascending: true })

            if (paymentsError) throw paymentsError
            setPayments(paymentsData || [])

            // Load expenses
            const { data: expensesData, error: expensesError } = await supabase
                .from('deal_expenses_actual')
                .select('*')
                .eq('deal_id', params.id)
                .order('paid_date', { ascending: false })

            if (expensesError) throw expensesError
            setExpenses(expensesData || [])

            // Load LC alerts
            const { data: alertsData, error: alertsError } = await supabase
                .rpc('get_lc_alerts', { p_days_threshold: 5 })

            if (alertsError) throw alertsError
            setLCAlerts((alertsData || []).filter((a: LCAlert) => a.deal_id === params.id))

        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to load finance data',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleMarkPaid = async (paymentId: string) => {
        // TODO: Open modal to mark payment as paid with proof upload
        toast({
            title: 'Feature Coming Soon',
            description: 'Mark payment as paid functionality'
        })
    }

    const handleDownloadProof = async (paymentId: string) => {
        // TODO: Download payment proof
        toast({
            title: 'Feature Coming Soon',
            description: 'Download proof functionality'
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Financial Management</h1>
                <p className="text-muted-foreground mt-1">
                    Deal: {deal?.deal_ref || params.id}
                </p>
            </div>

            {/* LC Alerts */}
            {lcAlerts.length > 0 && (
                <Card className="p-4">
                    <h3 className="text-sm font-semibold mb-3">⚠️ Letter of Credit Alerts</h3>
                    <LCAlertSummary alerts={lcAlerts} />
                </Card>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: P&L Summary */}
                <div className="lg:col-span-1">
                    <PLSummaryCard dealId={params.id} refreshTrigger={refreshTrigger} />
                </div>

                {/* Right Column: Payments & Expenses */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="payments" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="payments">Payment Schedule</TabsTrigger>
                            <TabsTrigger value="expenses">Actual Expenses</TabsTrigger>
                        </TabsList>

                        <TabsContent value="payments" className="space-y-4">
                            <div className="flex justify-end">
                                <AddPaymentModal
                                    dealId={params.id}
                                    totalDealValueINR={deal?.target_sell_price_inr || 0}
                                    onSuccess={() => setRefreshTrigger(prev => prev + 1)}
                                />
                            </div>

                            <PaymentScheduleTable
                                payments={payments}
                                onMarkPaid={handleMarkPaid}
                                onDownloadProof={handleDownloadProof}
                                isAdmin={true}
                            />
                        </TabsContent>

                        <TabsContent value="expenses" className="space-y-4">
                            <div className="flex justify-end">
                                <AddExpenseModal
                                    dealId={params.id}
                                    onSuccess={() => setRefreshTrigger(prev => prev + 1)}
                                />
                            </div>

                            {/* Expense Table */}
                            <Card className="p-6">
                                {expenses.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-sm text-muted-foreground">
                                            No expenses recorded yet
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {expenses.map((expense) => (
                                            <div
                                                key={expense.id}
                                                className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/30"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium">{expense.description}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {expense.expense_type}
                                                        {expense.vendor_name && ` • ${expense.vendor_name}`}
                                                        {expense.invoice_number && ` • Invoice: ${expense.invoice_number}`}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        ₹{expense.amount_inr.toLocaleString('en-IN')}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(expense.paid_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
