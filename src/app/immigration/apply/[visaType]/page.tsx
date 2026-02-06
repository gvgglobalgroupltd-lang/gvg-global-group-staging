
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
    params: Promise<{
        visaType: string
    }>
}

export default async function VisaApplicationPage({ params }: PageProps) {
    // Await params first (Next.js 15 requirement)
    const { visaType } = await params
    const supabase = await createClient()

    // Fetch service details
    const { data: service, error } = await supabase
        .from('immigration_service_catalog')
        .select('*')
        .eq('code', visaType)
        .single() as any

    if (error || !service) {
        return notFound()
    }

    const requirements = Array.isArray(service.requirements) ? service.requirements : []

    // Get user for pre-filling
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <Link href="/immigration" className="text-sm text-slate-500 hover:text-slate-900 mb-4 inline-block">
                        ← Back to Services
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">{service.title}</h1>
                    <p className="text-slate-500 mt-2">{service.description}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Requirements & Info */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4">Application Requirements</h2>
                            <ul className="space-y-3">
                                {requirements.map((req: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                        <span className="text-slate-700">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card className="p-6 bg-amber-50 border-amber-200">
                            <div className="flex gap-4">
                                <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-amber-800">Processing Time: {service.processing_time}</h3>
                                    <p className="text-amber-700 text-sm mt-1">
                                        Timelines are estimates and depend on government processing speeds.
                                        Expedited services may be available for an additional fee.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right: Pricing & CTA */}
                    <div className="space-y-6">
                        <Card className="p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <p className="text-slate-500 text-sm uppercase font-bold tracking-wider">Service Fee</p>
                                <div className="text-4xl font-bold text-slate-900 mt-2">
                                    {service.currency === 'USD' ? '$' : service.currency}{service.price}
                                </div>
                            </div>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="lg" className="w-full font-bold mb-3">
                                        Start Application
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Apply for {service.title}</DialogTitle>
                                    </DialogHeader>
                                    <ApplicationWizard service={service} user={user} />
                                </DialogContent>
                            </Dialog>

                            <p className="text-xs text-center text-slate-400">
                                Secure handling of your data.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ApplicationWizard } from '@/components/immigration/ApplicationWizard'
