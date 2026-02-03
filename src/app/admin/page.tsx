import { ActionCenter } from '@/components/dashboard/ActionCenter'
import { LogisticsTracker } from '@/components/dashboard/LogisticsTracker'
import { ITLeadsWidget } from '@/components/dashboard/ITLeadsWidget'
import { Card } from '@/components/ui/card'
import { TrendingUp, Package, DollarSign, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminDashboardPage() {
    // TODO: Fetch real stats from database
    const stats = [
        {
            title: 'Active Deals',
            value: '12',
            change: '+3 this week',
            icon: Package,
            color: 'text-blue-600'
        },
        {
            title: 'Total Revenue',
            value: '₹45.2L',
            change: '+12% from last month',
            icon: DollarSign,
            color: 'text-green-600'
        },
        {
            title: 'New IT Leads',
            value: '8',
            change: '5 unassigned',
            icon: TrendingUp,
            color: 'text-indigo-600'
        },
        {
            title: 'Active Clients',
            value: '34',
            change: '+2 this month',
            icon: Users,
            color: 'text-purple-600'
        }
    ]

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Overview Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome to GVG Global Group - Your operational command center
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <Card key={index} className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </p>
                                <Icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.change}</p>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Action Center */}
                <div className="lg:col-span-1">
                    <ActionCenter />
                </div>

                {/* Logistics Tracker */}
                <div className="lg:col-span-1">
                    <LogisticsTracker />
                </div>

                {/* IT Leads Widget - Full Width */}
                <div className="lg:col-span-2">
                    <ITLeadsWidget />
                </div>
            </div>

            {/* Quick Actions */}
            <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a
                        href="/admin/deals/create"
                        className="p-4 bg-white dark:bg-slate-800 rounded-lg border hover:shadow-md transition-shadow text-center"
                    >
                        <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm font-medium">New Deal</p>
                    </a>

                    <a
                        href="/admin/inventory"
                        className="p-4 bg-white dark:bg-slate-800 rounded-lg border hover:shadow-md transition-shadow text-center"
                    >
                        <Package className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <p className="text-sm font-medium">View Inventory</p>
                    </a>

                    <a
                        href="/admin/partners"
                        className="p-4 bg-white dark:bg-slate-800 rounded-lg border hover:shadow-md transition-shadow text-center"
                    >
                        <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <p className="text-sm font-medium">Manage Partners</p>
                    </a>

                    <a
                        href="/admin/reports"
                        className="p-4 bg-white dark:bg-slate-800 rounded-lg border hover:shadow-md transition-shadow text-center"
                    >
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                        <p className="text-sm font-medium">View Reports</p>
                    </a>
                </div>
            </Card>
        </div>
    )
}
