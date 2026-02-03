'use client'

import { ReactNode } from 'react'
import {
    Menu,
    User,
    LogOut,
    Building2,
    Cpu,
    LayoutDashboard,
    Package,
    Warehouse,
    Users,
    DollarSign
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const navItems = [
        { icon: 'LayoutDashboard', label: 'Dashboard', href: '/admin' },
        { icon: 'Package', label: 'Deals', href: '/admin/deals' },
        { icon: 'Warehouse', label: 'Inventory', href: '/admin/inventory' },
        { icon: 'Users', label: 'Partners', href: '/admin/partners' },
        { icon: 'DollarSign', label: 'Finance', href: '/admin/finance' },
        { icon: Cpu, label: 'IT Services', href: '/tech' },
    ]

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } transition-all duration-300 bg-industrial border-r border-border flex flex-col`}
            >
                {/* Logo & Toggle */}
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                    {sidebarOpen && (
                        <h1 className="text-lg font-bold text-industrial-foreground">
                            GVG Global
                        </h1>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-muted/10 rounded-md transition-colors"
                    >
                        <Menu className="w-5 h-5 text-industrial-foreground" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const IconComponent = typeof item.icon === 'string'
                            ? { LayoutDashboard, Package, Warehouse, Users, DollarSign, Cpu }[item.icon as keyof typeof item]
                            : item.icon

                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-tech/20 text-industrial-foreground transition-colors group"
                            >
                                {IconComponent && <IconComponent className="w-5 h-5 group-hover:text-tech transition-colors" />}
                                {sidebarOpen && (
                                    <span className="text-sm font-medium">{item.label}</span>
                                )}
                            </a>
                        )
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-border/50">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md hover:bg-destructive/10 text-industrial-foreground hover:text-destructive transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted">
                            <User className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">Admin User</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-background p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
