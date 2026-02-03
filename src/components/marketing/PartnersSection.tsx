import { Card } from '@/components/ui/card'
import Image from 'next/image'

export function PartnersSection() {
    // Major partner categories
    const partnerCategories = [
        {
            title: 'Shipping & Logistics Partners',
            partners: [
                { name: 'Maersk Line', type: 'Shipping' },
                { name: 'MSC Mediterranean', type: 'Shipping' },
                { name: 'CMA CGM Group', type: 'Shipping' },
                { name: 'DHL Global', type: 'Logistics' },
            ]
        },
        {
            title: 'Port Authorities',
            partners: [
                { name: 'Port of Los Angeles', type: 'USA' },
                { name: 'Jawaharlal Nehru Port', type: 'India' },
                { name: 'Port of Dubai', type: 'UAE' },
                { name: 'Port of Durban', type: 'South Africa' },
            ]
        },
        {
            title: 'Financial Partners',
            partners: [
                { name: 'HSBC', type: 'Banking' },
                { name: 'Citibank', type: 'Banking' },
                { name: 'ICICI Bank', type: 'Banking' },
                { name: 'Emirates NBD', type: 'Banking' },
            ]
        },
        {
            title: 'Technology Partners',
            partners: [
                { name: 'Microsoft Azure', type: 'Cloud' },
                { name: 'Amazon Web Services', type: 'Cloud' },
                { name: 'SAP', type: 'ERP' },
                { name: 'Oracle', type: 'Database' },
            ]
        },
        {
            title: 'Industry Associations',
            partners: [
                { name: 'International Chamber of Commerce', type: 'Global' },
                { name: 'Federation of Indian Export', type: 'India' },
                { name: 'American Iron & Steel Institute', type: 'USA' },
                { name: 'Dubai Chamber of Commerce', type: 'UAE' },
            ]
        },
        {
            title: 'Quality & Certification',
            partners: [
                { name: 'Bureau Veritas', type: 'Quality' },
                { name: 'SGS Inspection', type: 'Quality' },
                { name: 'Lloyd\'s Register', type: 'Quality' },
                { name: 'TÜV SÜD', type: 'Certification' },
            ]
        }
    ]

    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Our Global Partners
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We collaborate with world-class organizations to deliver exceptional value
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {partnerCategories.map((category, index) => (
                        <Card key={index} className="p-6">
                            <h3 className="text-lg font-bold mb-4 text-blue-600">
                                {category.title}
                            </h3>
                            <div className="space-y-3">
                                {category.partners.map((partner, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                    >
                                        <div>
                                            <p className="font-semibold text-sm">{partner.name}</p>
                                            <p className="text-xs text-muted-foreground">{partner.type}</p>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                            ✓
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Card className="inline-block p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                        <p className="text-lg font-semibold mb-2">
                            Partnered with 50+ Organizations Worldwide
                        </p>
                        <p className="text-muted-foreground">
                            Building a network of trust across continents
                        </p>
                    </Card>
                </div>
            </div>
        </section>
    )
}
