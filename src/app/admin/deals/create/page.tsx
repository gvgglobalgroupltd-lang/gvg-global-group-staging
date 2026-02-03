import { DealWizard } from '@/components/deals/DealWizard'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CreateDealPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/metals">
                        <Button variant="ghost" size="sm" className="mb-2">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Metals Division
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground">
                        Create New Deal
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Smart Deal Calculator with real-time pricing and margin analysis
                    </p>
                </div>
            </div>

            {/* Wizard */}
            <DealWizard />
        </div>
    )
}
