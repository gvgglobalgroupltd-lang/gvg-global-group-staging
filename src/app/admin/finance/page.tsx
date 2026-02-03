'use client'

import { Card } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function FinancePage() {
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
                        <h3 className="font-semibold">Total Revenue</h3>
                    </div>
                    <p className="text-2xl font-bold">₹0.00</p>
                    <p className="text-sm text-muted-foreground">From active deals</p>
                </Card>
                {/* Add more stats */}
            </div>

            <Card className="p-12 text-center border-dashed">
                <p className="text-muted-foreground">Financial transaction records will appear here.</p>
            </Card>
        </div>
    )
}
