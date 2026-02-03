import { Card } from '@/components/ui/card'
import { Award, CheckCircle2, FileCheck, Shield } from 'lucide-react'

export function IndianCertificationsSection() {
    const certifications = [
        {
            name: 'ISO 9001:2015',
            issuer: 'Quality Management System',
            icon: Award,
            color: 'emerald',
            description: 'International quality standard'
        },
        {
            name: 'DGFT IEC',
            issuer: 'Directorate General of Foreign Trade',
            icon: FileCheck,
            color: 'blue',
            description: 'Import Export Code'
        },
        {
            name: 'GST Registration',
            issuer: 'Goods and Services Tax Network',
            icon: Shield,
            color: 'amber',
            description: 'Active GST compliance'
        },
        {
            name: 'FSSAI License',
            issuer: 'Food Safety and Standards Authority',
            icon: CheckCircle2,
            color: 'cyan',
            description: 'Business operations license'
        },
        {
            name: 'Udyam Registration',
            issuer: 'Ministry of MSME',
            icon: FileCheck,
            color: 'purple',
            description: 'MSME registration certificate'
        },
        {
            name: 'Customs Clearance Authorization',
            issuer: 'Indian Customs',
            icon: Shield,
            color: 'emerald',
            description: 'Import clearance authority'
        }
    ]

    const colorClasses = {
        emerald: {
            bg: 'bg-emerald-100 dark:bg-emerald-900/30',
            text: 'text-emerald-600 dark:text-emerald-400',
            border: 'border-emerald-200 dark:border-emerald-800'
        },
        blue: {
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            text: 'text-blue-600 dark:text-blue-400',
            border: 'border-blue-200 dark:border-blue-800'
        },
        amber: {
            bg: 'bg-amber-100 dark:bg-amber-900/30',
            text: 'text-amber-600 dark:text-amber-400',
            border: 'border-amber-200 dark:border-amber-800'
        },
        cyan: {
            bg: 'bg-cyan-100 dark:bg-cyan-900/30',
            text: 'text-cyan-600 dark:text-cyan-400',
            border: 'border-cyan-200 dark:border-cyan-800'
        },
        purple: {
            bg: 'bg-purple-100 dark:bg-purple-900/30',
            text: 'text-purple-600 dark:text-purple-400',
            border: 'border-purple-200 dark:border-purple-800'
        }
    }

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                        Indian Certifications & Compliance
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Fully compliant with Indian government regulations and international standards
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certifications.map((cert, idx) => {
                        const Icon = cert.icon
                        const colors = colorClasses[cert.color as keyof typeof colorClasses]

                        return (
                            <Card key={idx} className={`p-6 border-2 ${colors.border} hover:shadow-xl transition-shadow`}>
                                <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center mb-4`}>
                                    <Icon className={`h-6 w-6 ${colors.text}`} />
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">
                                    {cert.name}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    {cert.issuer}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {cert.description}
                                </p>
                            </Card>
                        )
                    })}
                </div>

                <Card className="max-w-4xl mx-auto mt-12 p-8 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20 border-2 border-emerald-200 dark:border-emerald-800">
                    <div className="text-center">
                        <Award className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                            Verified & Compliant Business
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            All our certifications are valid and up-to-date. We maintain full compliance with Indian import/export regulations, GST laws, and international quality standards.
                        </p>
                        <p className="text-sm text-slate-500">
                            Certificate copies available upon request
                        </p>
                    </div>
                </Card>
            </div>
        </section>
    )
}
