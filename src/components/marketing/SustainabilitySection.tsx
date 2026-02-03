import { Leaf, Recycle, TrendingDown, Award, Shield, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function SustainabilitySection() {
    const recyclingStats = [
        { label: 'Recycled Materials Processed', value: '50,000+', unit: 'tons/year', icon: Recycle },
        { label: 'Carbon Emissions Reduced', value: '30%', unit: 'vs 2020', icon: TrendingDown },
        { label: 'Renewable Energy Used', value: '75%', unit: 'of operations', icon: Zap },
        { label: 'Waste to Landfill', value: '<5%', unit: 'near-zero', icon: Leaf },
    ]

    const recyclingPartners = [
        { name: 'Nucor Corporation', type: 'Steel Recycling Partner', volume: '15,000 tons/year' },
        { name: 'Commercial Metals Company', type: 'Scrap Processing', volume: '12,000 tons/year' },
        { name: 'SIMS Metal Management', type: 'Ferrous & Non-Ferrous', volume: '10,000 tons/year' },
        { name: 'European Metal Recycling', type: 'Global Recycling', volume: '8,000 tons/year' },
        { name: 'Schnitzer Steel', type: 'Recycled Steel Products', volume: '7,000 tons/year' },
        { name: 'OmniSource Corporation', type: 'Comprehensive Recycling', volume: '5,000 tons/year' },
    ]

    const certifications = [
        { name: 'ISO 14001:2015', description: 'Environmental Management' },
        { name: 'Carbon Neutral Certified', description: 'Net-Zero Operations' },
        { name: 'Responsible Recycling (R2)', description: 'Electronics Recycling' },
        { name: 'LEED Certified Facilities', description: 'Green Buildings' },
        { name: 'UN Global Compact', description: 'Sustainability Goals' },
        { name: 'CDP Climate Leader', description: 'Carbon Disclosure' },
    ]

    return (
        <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Badge className="mb-4 bg-green-600 text-white">
                        Sustainability Committed
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Circular Economy & Sustainability
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Leading the metals industry towards a sustainable future through responsible recycling and environmental stewardship
                    </p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {recyclingStats.map((stat, index) => (
                        <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                            <stat.icon className="h-10 w-10 mx-auto mb-3 text-green-600" />
                            <p className="text-3xl font-bold mb-1 text-green-600">{stat.value}</p>
                            <p className="text-xs text-muted-foreground mb-1">{stat.unit}</p>
                            <p className="text-sm font-semibold">{stat.label}</p>
                        </Card>
                    ))}
                </div>

                {/* Recycling Partners */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold mb-6 text-center">Recycling & Processing Partners</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recyclingPartners.map((partner, index) => (
                            <Card key={index} className="p-5 hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                        <Recycle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm mb-1">{partner.name}</p>
                                        <p className="text-xs text-muted-foreground mb-1">{partner.type}</p>
                                        <Badge variant="outline" className="text-xs">{partner.volume}</Badge>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Circular Economy Process */}
                <Card className="p-8 mb-12 bg-white dark:bg-slate-900">
                    <h3 className="text-2xl font-bold mb-6 text-center">Our Circular Economy Process</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                1
                            </div>
                            <h4 className="font-bold mb-2">Collection</h4>
                            <p className="text-sm text-muted-foreground">
                                Sourcing post-industrial and post-consumer scrap metals globally
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                2
                            </div>
                            <h4 className="font-bold mb-2">Processing</h4>
                            <p className="text-sm text-muted-foreground">
                                Advanced sorting, cleaning, and processing to industry standards
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                3
                            </div>
                            <h4 className="font-bold mb-2">Remanufacturing</h4>
                            <p className="text-sm text-muted-foreground">
                                Transforming recycled materials into high-quality products
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                4
                            </div>
                            <h4 className="font-bold mb-2">Distribution</h4>
                            <p className="text-sm text-muted-foreground">
                                Delivering sustainable materials to manufacturers worldwide
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Environmental Certifications */}
                <div>
                    <h3 className="text-2xl font-bold mb-6 text-center">Environmental Certifications</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {certifications.map((cert, index) => (
                            <Card key={index} className="p-4 text-center hover:shadow-lg transition-shadow">
                                <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                <p className="font-bold text-xs mb-1">{cert.name}</p>
                                <p className="text-xs text-muted-foreground">{cert.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Commitment Statement */}
                <div className="mt-12 text-center">
                    <Card className="inline-block p-8 max-w-3xl bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                        <Leaf className="h-12 w-12 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-4">Our Sustainability Commitment</h3>
                        <p className="text-green-100 mb-4">
                            We are committed to achieving carbon neutrality by 2030 and promoting the circular economy through responsible sourcing, advanced recycling, and sustainable business practices.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap text-sm">
                            <div className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                <span>UN SDG Aligned</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                <span>ESG Reporting</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Recycle className="h-5 w-5" />
                                <span>100% Traceable</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    )
}
