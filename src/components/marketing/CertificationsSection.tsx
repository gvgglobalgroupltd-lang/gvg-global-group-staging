import { Shield, Award, Lock, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function CertificationsSection() {
    const certifications = [
        {
            category: 'Quality Management',
            icon: Award,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950',
            items: [
                { name: 'ISO 9001:2015', description: 'Quality Management Systems' },
                { name: 'ISO 14001:2015', description: 'Environmental Management' },
                { name: 'ISO 45001:2018', description: 'Occupational Health & Safety' },
            ]
        },
        {
            category: 'Security & Compliance',
            icon: Shield,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-950',
            items: [
                { name: 'ISO 27001:2013', description: 'Information Security Management' },
                { name: 'SOC 2 Type II', description: 'Security & Availability' },
                { name: 'GDPR Compliant', description: 'Data Protection Regulation' },
            ]
        },
        {
            category: 'Industry Standards',
            icon: CheckCircle2,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-950',
            items: [
                { name: 'AEO Certified', description: 'Authorized Economic Operator' },
                { name: 'ICC Member', description: 'International Chamber of Commerce' },
                { name: 'Incoterms® 2020', description: 'International Trade Terms' },
            ]
        },
        {
            category: 'Technology',
            icon: Lock,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50 dark:bg-amber-950',
            items: [
                { name: 'Microsoft Partner', description: 'Gold Certified' },
                { name: 'AWS Partner', description: 'Advanced Tier' },
                { name: 'CMMI Level 3', description: 'Process Maturity' },
            ]
        }
    ]

    return (
        <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Badge className="mb-4" variant="outline">
                        Certified Excellence
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Certifications & Compliance
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Committed to the highest standards of quality, security, and professional excellence
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {certifications.map((cert, index) => (
                        <Card key={index} className="p-6 hover:shadow-xl transition-shadow">
                            <div className={`p-3 ${cert.bgColor} rounded-lg w-fit mb-4`}>
                                <cert.icon className={`h-8 w-8 ${cert.color}`} />
                            </div>

                            <h3 className="text-lg font-bold mb-4">{cert.category}</h3>

                            <div className="space-y-3">
                                {cert.items.map((item, idx) => (
                                    <div key={idx}>
                                        <p className="font-semibold text-sm">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Card className="p-4 text-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                        <p className="text-3xl font-bold mb-1">15+</p>
                        <p className="text-sm text-blue-100">Years Certified</p>
                    </Card>

                    <Card className="p-4 text-center bg-gradient-to-br from-green-600 to-emerald-600 text-white">
                        <p className="text-3xl font-bold mb-1">100%</p>
                        <p className="text-sm text-green-100">Compliance Rate</p>
                    </Card>

                    <Card className="p-4 text-center bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                        <p className="text-3xl font-bold mb-1">Zero</p>
                        <p className="text-sm text-purple-100">Security Breaches</p>
                    </Card>

                    <Card className="p-4 text-center bg-gradient-to-br from-amber-600 to-orange-600 text-white">
                        <p className="text-3xl font-bold mb-1">24/7</p>
                        <p className="text-sm text-amber-100">Security Monitoring</p>
                    </Card>
                </div>

                {/* Additional Trust Indicators */}
                <div className="mt-12 text-center">
                    <Card className="inline-block p-6 max-w-2xl">
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-green-600" />
                                <span className="text-sm font-semibold">SSL Encrypted</span>
                            </div>
                            <div className="h-4 w-px bg-border" />
                            <div className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-semibold">Secure Payments</span>
                            </div>
                            <div className="h-4 w-px bg-border" />
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-purple-600" />
                                <span className="text-sm font-semibold">Privacy Protected</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    )
}
