'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Building2 } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/admin')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-industrial via-background to-tech/20">
            <div className="w-full max-w-md p-8 m-4">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-industrial to-tech rounded-2xl mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-1">GVG Global Group</h1>
                    <p className="text-sm text-muted-foreground">Enterprise Resource Planning Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-2xl p-8">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Sign In</h2>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@gvg.com"
                                    required
                                    className="w-full pl-11 pr-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-tech focus:border-tech outline-none transition-all text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-foreground">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-11 pr-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-tech focus:border-tech outline-none transition-all text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-industrial to-tech hover:opacity-90 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-xs text-center text-muted-foreground">
                            Access restricted to authorized personnel only
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
