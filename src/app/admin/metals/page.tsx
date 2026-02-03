import { getMetalPrices, getMetalName } from '@/lib/api/metals'
import { getExchangeRates } from '@/lib/api/exchange-rates'
import { TrendingUp, TrendingDown, DollarSign, Package, Truck, FileText } from 'lucide-react'

export default async function MetalsDivisionPage() {
    const metalPrices = await getMetalPrices()
    const exchangeRates = await getExchangeRates()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">GVG Metals Division</h1>
                    <p className="text-muted-foreground">Metal Sourcing, Trading & Supply Chain Management</p>
                </div>
                <div className="px-4 py-2 bg-industrial/10 border border-industrial/20 rounded-lg">
                    <p className="text-xs text-muted-foreground">Division</p>
                    <p className="text-sm font-semibold text-industrial">Industrial</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Package className="w-5 h-5 text-muted-foreground" />
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Active Contracts</p>
                    <p className="text-2xl font-bold text-foreground">24</p>
                    <p className="text-xs text-green-600">+3 this month</p>
                </div>

                <div className="p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Truck className="w-5 h-5 text-muted-foreground" />
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Monthly Volume</p>
                    <p className="text-2xl font-bold text-foreground">1,250 MT</p>
                    <p className="text-xs text-green-600">+12% growth</p>
                </div>

                <div className="p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="w-5 h-5 text-muted-foreground" />
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Revenue (MTD)</p>
                    <p className="text-2xl font-bold text-foreground">$1.8M</p>
                    <p className="text-xs text-green-600">+8% vs last month</p>
                </div>

                <div className="p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <span className="text-xs text-amber-600 bg-amber-500/10 px-2 py-1 rounded">12 Pending</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Pending Orders</p>
                    <p className="text-2xl font-bold text-foreground">32</p>
                    <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </div>
            </div>

            {/* Live Metal Prices */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Live Metal Prices</h2>
                        <p className="text-sm text-muted-foreground">Real-time market rates (per troy ounce)</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Live Data</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metalPrices.slice(0, 8).map((metal) => {
                        const changePercent = (Math.random() * 4 - 2).toFixed(2) // Mock change
                        const isPositive = parseFloat(changePercent) > 0

                        return (
                            <div
                                key={metal.metal}
                                className="p-4 bg-gradient-to-br from-industrial/5 to-transparent border border-border rounded-lg hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">{metal.metal}</p>
                                        <p className="text-sm font-medium text-foreground">{getMetalName(metal.metal)}</p>
                                    </div>
                                    {isPositive ? (
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                    )}
                                </div>
                                <p className="text-2xl font-bold text-foreground mb-1">
                                    ${metal.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {isPositive ? '+' : ''}{changePercent}% today
                                </p>
                            </div>
                        )
                    })}
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                    Last updated: {new Date().toLocaleString()} • Currency: USD
                </p>
            </div>

            {/* Exchange Rates */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Currency Exchange Rates</h2>
                        <p className="text-sm text-muted-foreground">Base: USD</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {exchangeRates.map((rate) => (
                        <div key={rate.to} className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">USD → {rate.to}</p>
                            <p className="text-lg font-bold text-foreground">
                                {rate.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Contracts */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Recent Contracts</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contract ID</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Metal</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Volume</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Value</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                <td className="py-3 px-4 font-mono text-xs">#MTL-2024-001</td>
                                <td className="py-3 px-4">Acme Steel Corp</td>
                                <td className="py-3 px-4">Aluminum</td>
                                <td className="py-3 px-4">250 MT</td>
                                <td className="py-3 px-4 font-semibold">$485,000</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded-full">Active</span>
                                </td>
                            </tr>
                            <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                <td className="py-3 px-4 font-mono text-xs">#MTL-2024-002</td>
                                <td className="py-3 px-4">Global Manufacturing Ltd</td>
                                <td className="py-3 px-4">Copper</td>
                                <td className="py-3 px-4">180 MT</td>
                                <td className="py-3 px-4 font-semibold">$1,350,000</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-amber-500/10 text-amber-600 text-xs rounded-full">Pending</span>
                                </td>
                            </tr>
                            <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                <td className="py-3 px-4 font-mono text-xs">#MTL-2024-003</td>
                                <td className="py-3 px-4">Industrial Supplies Inc</td>
                                <td className="py-3 px-4">Steel</td>
                                <td className="py-3 px-4">500 MT</td>
                                <td className="py-3 px-4 font-semibold">$675,000</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded-full">Active</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
