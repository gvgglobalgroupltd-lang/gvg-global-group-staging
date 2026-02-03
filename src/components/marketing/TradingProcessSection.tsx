import {
    FileSearch,
    MessageSquare,
    FileText,
    DollarSign,
    Package,
    Ship,
    FileCheck,
    CheckCircle2,
    ArrowRight
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function TradingProcessSection() {
    const processSteps = [
        {
            number: 1,
            title: 'Inquiry & Quotation',
            icon: MessageSquare,
            description: 'Submit your requirements. We provide detailed quotation with specifications, pricing (FOB/CIF), and delivery timeline.',
            duration: '24-48 hours',
            color: 'from-blue-600 to-indigo-600'
        },
        {
            number: 2,
            title: 'Quality Verification',
            icon: FileSearch,
            description: 'Product specifications confirmed. Third-party inspection arranged if required. Mill test certificates provided.',
            duration: '2-3 days',
            color: 'from-indigo-600 to-purple-600'
        },
        {
            number: 3,
            title: 'Contract & Documentation',
            icon: FileText,
            description: 'Sales contract signed. Pro forma invoice issued. All trade documentation prepared (LC, inspection certificates).',
            duration: '3-5 days',
            color: 'from-purple-600 to-pink-600'
        },
        {
            number: 4,
            title: 'Payment Processing',
            icon: DollarSign,
            description: 'Payment via LC, TT, or agreed terms. Advance payment or LC establishment. Banking coordination handled.',
            duration: '5-7 days',
            color: 'from-pink-600 to-red-600'
        },
        {
            number: 5,
            title: 'Production & Packaging',
            icon: Package,
            description: 'Order processed at mill/warehouse. Quality inspection conducted. Professional export packaging and labeling.',
            duration: '15-30 days',
            color: 'from-red-600 to-orange-600'
        },
        {
            number: 6,
            title: 'Shipping & Logistics',
            icon: Ship,
            description: 'Container booking and loading. Bill of lading issued. Real-time tracking provided. Customs clearance arranged.',
            duration: '20-45 days',
            color: 'from-orange-600 to-amber-600'
        },
        {
            number: 7,
            title: 'Documentation Delivery',
            icon: FileCheck,
            description: 'All original documents couriered. Commercial invoice, packing list, BL, certificates. LC documents presented to bank.',
            duration: '1-2 days',
            color: 'from-amber-600 to-yellow-600'
        },
        {
            number: 8,
            title: 'Delivery & Support',
            icon: CheckCircle2,
            description: 'Cargo delivered to destination. Post-delivery support provided. Feedback collected. Ready for next order.',
            duration: 'Ongoing',
            color: 'from-yellow-600 to-green-600'
        }
    ]

    const documentChecklist = [
        'Commercial Invoice',
        'Packing List',
        'Bill of Lading (B/L)',
        'Certificate of Origin',
        'Mill Test Certificate',
        'Quality Inspection Report',
        'Insurance Certificate',
        'Letter of Credit',
        'Export License',
        'Customs Declaration'
    ]

    const qualityAssurance = [
        { step: 'Supplier Audit', description: 'Verified mills and manufacturers' },
        { step: 'Pre-Shipment Inspection', description: 'Independent third-party inspection' },
        { step: 'Laboratory Testing', description: 'Chemical composition and mechanical properties' },
        { step: 'Documentation Review', description: 'All certificates and test reports verified' },
        { step: 'Final QC', description: 'Before container sealing and shipment' }
    ]

    return (
        <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Badge className="mb-4" variant="outline">
                        Streamlined Process
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Our Trading Process
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Transparent, efficient, and secure end-to-end trading process designed for your peace of mind
                    </p>
                </div>

                {/* Process Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {processSteps.map((step, index) => (
                        <Card key={index} className="p-6 hover:shadow-xl transition-shadow relative group">
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color} rounded-t-lg`} />

                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xl`}>
                                    {step.number}
                                </div>
                                <step.icon className="h-8 w-8 text-blue-600" />
                            </div>

                            <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

                            <Badge variant="outline" className="text-xs">
                                {step.duration}
                            </Badge>

                            {index < processSteps.length - 1 && (
                                <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
                            )}
                        </Card>
                    ))}
                </div>

                {/* Two Column Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Documentation Checklist */}
                    <Card className="p-8">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FileText className="h-6 w-6 text-blue-600" />
                            Complete Documentation
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            We handle all trade documentation to ensure smooth customs clearance and compliance.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {documentChecklist.map((doc, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <span className="text-sm">{doc}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Quality Assurance */}
                    <Card className="p-8">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FileSearch className="h-6 w-6 text-purple-600" />
                            Quality Assurance
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Multi-level quality checks ensure you receive exactly what you ordered.
                        </p>
                        <div className="space-y-4">
                            {qualityAssurance.map((qa, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 font-bold flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{qa.step}</p>
                                        <p className="text-xs text-muted-foreground">{qa.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Timeline Summary */}
                <Card className="p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold mb-2">Typical Timeline</h3>
                        <p className="text-blue-100">From inquiry to delivery</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <p className="text-4xl font-bold mb-2">1-2</p>
                            <p className="text-sm text-blue-100">Days to Quote</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold mb-2">5-7</p>
                            <p className="text-sm text-blue-100">Days to Contract</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold mb-2">15-30</p>
                            <p className="text-sm text-blue-100">Days Production</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold mb-2">20-45</p>
                            <p className="text-sm text-blue-100">Days Shipping</p>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-lg font-semibold">Total: 40-85 days average</p>
                        <p className="text-sm text-blue-100">(Express options available)</p>
                    </div>
                </Card>
            </div>
        </section>
    )
}
