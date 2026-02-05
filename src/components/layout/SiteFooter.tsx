import Link from 'next/link'
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react'

export function SiteFooter() {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        company: [
            { name: 'About Us', href: '/about' },
            { name: 'Contact', href: '/contact' },
            { name: 'Current Pricing', href: '/pricing' },
            { name: 'Our Locations', href: '/locations' },
            { name: 'IT Services', href: '/tech' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Cookie Policy', href: '/cookie-policy' },
            { name: 'Disclaimer', href: '/disclaimer' },
        ],
    }

    const regions = [
        { name: 'India HQ', phone: '+1-905-962-2919', email: 'info@gvgglobal.com', whatsapp: true },
    ]

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">GVG Global Group</h3>
                        <p className="text-sm mb-4">
                            International metals trading and IT consulting services trusted worldwide.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://linkedin.com/company/gvgglobal"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-400 transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com/gvgglobal"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-400 transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="https://facebook.com/gvgglobal"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-400 transition-colors"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Contact</h3>
                        <ul className="space-y-3 text-sm">
                            {regions.map((region) => (
                                <li key={region.name}>
                                    <p className="font-semibold text-white mb-1">{region.name}</p>
                                    <a href={`tel:${region.phone}`} className="hover:text-white transition-colors block">
                                        {region.phone}
                                    </a>
                                    <a href={`mailto:${region.email}`} className="hover:text-white transition-colors block text-xs">
                                        {region.email}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <p>
                            © {currentYear} GVG Global Group. All rights reserved.
                        </p>

                        <Link
                            href="/tech"
                            className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-900/50 hover:bg-indigo-900 text-indigo-200 hover:text-white rounded-full transition-all border border-indigo-800"
                        >
                            <span className="font-semibold">Need IT Solutions?</span>
                            <span>Visit GVG Tech →</span>
                        </Link>

                        <div className="flex gap-6 flex-wrap justify-center">
                            <Link href="/privacy" className="hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors">
                                Terms
                            </Link>
                            <Link href="/cookie-policy" className="hover:text-white transition-colors">
                                Cookies
                            </Link>
                            <Link href="/contact" className="hover:text-white transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
