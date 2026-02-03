import { Building2, Shield, Award, Globe } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function GovernmentPartnersSection() {
    const governmentPartners = [
        {
            country: 'United States',
            flag: '🇺🇸',
            partners: [
                { name: 'U.S. Department of Commerce', role: 'Trade Partner' },
                { name: 'U.S. Customs and Border Protection', role: 'Authorized Economic Operator' },
                { name: 'Export-Import Bank (EXIM)', role: 'Financing Partner' },
                { name: 'Small Business Administration', role: 'Certified Partner' },
            ]
        },
        {
            country: 'India',
            flag: '🇮🇳',
            partners: [
                { name: 'Ministry of Commerce & Industry', role: 'Registered Exporter' },
                { name: 'Federation of Indian Export Organisations', role: 'Active Member' },
                { name: 'Directorate General of Foreign Trade', role: 'IEC Holder' },
                { name: 'Bureau of Indian Standards', role: 'ISI Certified' },
            ]
        },
        {
            country: 'United Arab Emirates',
            flag: '🇦🇪',
            partners: [
                { name: 'Dubai Customs', role: 'Registered Trader' },
                { name: 'Dubai Chamber of Commerce', role: 'Gold Member' },
                { name: 'Free Zone Authority', role: 'Licensed Entity' },
                { name: 'Emirates Authority for Standardization', role: 'ESMA Approved' },
            ]
        },
        {
            country: 'Canada',
            flag: '🇨🇦',
            partners: [
                { name: 'Canada Border Services Agency', role: 'Trusted Trader' },
                { name: 'Export Development Canada', role: 'Approved Exporter' },
                { name: 'Canadian Commercial Corporation', role: 'Registered Supplier' },
                { name: 'Standards Council of Canada', role: 'Accredited' },
            ]
        }
    ]

    const tradeAssociations = [
        { name: 'International Chamber of Commerce (ICC)', membership: 'Global Member' },
        { name: 'World Trade Organization', status: 'Recognized Trader' },
        { name: 'American Iron and Steel Institute', membership: 'Associate Member' },
        { name: 'London Metal Exchange', status: 'Registered Participant' },
        { name: 'International Monetary Fund', status: 'Trade Data Contributor' },
        { name: 'Bureau of International Recycling', membership: 'Active Member' },
    ]

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-full">
                        <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Government Recognized</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                        Official Government Partnerships
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Authorized and certified by government agencies worldwide
                    </p>
                </div>

                {/* Government Partners by Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {governmentPartners.map((country, index) => (
                        <Card key={index} className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-4xl">{country.flag}</span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{country.country}</h3>
                            </div>
                            <div className="space-y-3">
                                {country.partners.map((partner, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600">
                                        <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-sm text-slate-900 dark:text-white">{partner.name}</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">{partner.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* International Trade Associations */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">International Trade Associations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tradeAssociations.map((association, index) => (
                            <Card key={index} className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:scale-105">
                                <div className="flex items-start gap-3">
                                    <Globe className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{association.name}</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{association.membership || association.status}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Compliance Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Card className="p-6 text-center bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:shadow-xl transition-shadow">
                        <Award className="h-10 w-10 mx-auto mb-2" />
                        <p className="font-bold">AEO Certified</p>
                        <p className="text-xs text-emerald-100">Authorized Economic Operator</p>
                    </Card>

                    <Card className="p-6 text-center bg-gradient-to-br from-cyan-500 to-cyan-600 text-white hover:shadow-xl transition-shadow">
                        <Shield className="h-10 w-10 mx-auto mb-2" />
                        <p className="font-bold">C-TPAT Member</p>
                        <p className="text-xs text-cyan-100">Customs-Trade Partnership</p>
                    </Card>

                    <Card className="p-6 text-center bg-gradient-to-br from-slate-600 to-slate-700 text-white hover:shadow-xl transition-shadow">
                        <Building2 className="h-10 w-10 mx-auto mb-2" />
                        <p className="font-bold">IEC License</p>
                        <p className="text-xs text-slate-200">Import Export Code</p>
                    </Card>

                    <Card className="p-6 text-center bg-gradient-to-br from-amber-500 to-amber-600 text-white hover:shadow-xl transition-shadow">
                        <Globe className="h-10 w-10 mx-auto mb-2" />
                        <p className="font-bold">WTO Member</p>
                        <p className="text-xs text-amber-100">World Trade Organization</p>
                    </Card>
                </div>
            </div>
        </section>
    )
}
