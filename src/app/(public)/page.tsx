import { ArrowRight, Wrench, Wifi } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="h-screen flex flex-col md:flex-row">
            {/* LEFT SIDE - GVG Metals (Industrial Division) */}
            <div className="flex-1 relative overflow-hidden group">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-industrial via-industrial/95 to-slate-800">
                    {/* Abstract Metal/Factory Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-repeat"></div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-center items-center text-center px-8 z-10">
                    <div className="transform transition-transform duration-500 group-hover:scale-105">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 border border-white/20">
                            <Wrench className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">
                            GVG Metals
                        </h2>

                        <p className="text-xl text-white/90 mb-8 max-w-md mx-auto font-light">
                            Industrial Excellence in Metal Sourcing & Trading
                        </p>

                        <div className="space-y-3">
                            <p className="text-white/80 text-sm uppercase tracking-wider font-medium">
                                Our Services
                            </p>
                            <ul className="space-y-2 text-white/70 text-sm">
                                <li>Steel & Aluminum Trading</li>
                                <li>Industrial Supply Chain</li>
                                <li>Material Procurement</li>
                            </ul>
                        </div>

                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium rounded-xl transition-all hover:gap-4 group/btn"
                        >
                            <span>Access Portal</span>
                            <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* DIVIDER */}
            <div className="w-1 bg-gradient-to-b from-transparent via-amber-500/50 to-transparent hidden md:block"></div>

            {/* RIGHT SIDE - GVG Tech (IT Consulting Division) */}
            <div className="flex-1 relative overflow-hidden group">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-tech via-indigo-700 to-purple-900">
                    {/* Digital Nodes Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:30px_30px]"></div>
                        {/* Animated floating circles */}
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-150"></div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-center items-center text-center px-8 z-10">
                    <div className="transform transition-transform duration-500 group-hover:scale-105">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 border border-white/20">
                            <Wifi className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">
                            GVG Tech
                        </h2>

                        <p className="text-xl text-white/90 mb-8 max-w-md mx-auto font-light">
                            Innovative IT Solutions & Digital Transformation
                        </p>

                        <div className="space-y-3">
                            <p className="text-white/80 text-sm uppercase tracking-wider font-medium">
                                Our Services
                            </p>
                            <ul className="space-y-2 text-white/70 text-sm">
                                <li>Enterprise Software Development</li>
                                <li>Cloud Infrastructure</li>
                                <li>IT Consulting & Support</li>
                            </ul>
                        </div>

                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium rounded-xl transition-all hover:gap-4 group/btn"
                        >
                            <span>Access Portal</span>
                            <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
