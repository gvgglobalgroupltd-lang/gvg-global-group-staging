'use client'

import { Card } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Reports</h1>
                    <p className="text-muted-foreground mt-1">
                        Business analytics and performance metrics
                    </p>
                </div>
            </div>

            <Card className="p-12 text-center border-dashed">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">Detailed reports and charts coming soon.</p>
            </Card>
        </div>
    )
}
