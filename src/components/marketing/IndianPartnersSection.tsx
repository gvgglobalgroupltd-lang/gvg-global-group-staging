import { Card } from '@/components/ui/card'
import { Building2, Award, CheckCircle2 } from 'lucide-react'

export function IndianPartnersSection() {
    const partners = [
        { name: 'Tata Steel', category: 'Client', description: 'Steel manufacturing' },
        { name: 'JSW Steel', category: 'Client', description: 'Integrated steel producer' },
        { name: 'Hindalco Industries', category: 'Client', description: 'Aluminum & copper products' },
        { name: 'Vedanta Limited', category: 'Supplier', description: 'Natural resources' },
        { name: 'SAIL (Steel Authority of India)', category: 'Client', description: 'Public sector steel' },
        { name: 'Adani Ports', category: 'Logistics Partner', description: 'Port operations' },
        { name: 'Container Corporation of India (CONCOR)', category: 'Logistics Partner', description: 'Container transport' },
        { name: 'Bharat Petroleum (BPCL)', category: 'Vendor', description: 'Fuel & energy' },
    ]

    return (
        <section className="py-20 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                        Our Indian Partners & Clients
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Trusted relationships with leading Indian companies in metals, logistics, and manufacturing
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {partners.map((partner, idx) => (
                        <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3 mb-3">
                                <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                                        {partner.name}
                                    </h3>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                                        {partner.category}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {partner.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="max-w-4xl mx-auto mt-12 p-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                    <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Verified Business Relationships</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                All partnerships are established through proper business contracts and verified transactions. We work with companies that meet Indian quality and compliance standards.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    )
}
