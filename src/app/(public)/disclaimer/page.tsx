import { AlertTriangle, Shield, FileWarning } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-10 w-10 text-amber-600" />
                    <h1 className="text-4xl font-bold">Disclaimer</h1>
                </div>
                <p className="text-muted-foreground mb-8">
                    Last Updated: February 3, 2026
                </p>

                <Card className="p-6 mb-8 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                        <FileWarning className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                        <div>
                            <h2 className="text-xl font-bold mb-2">Important Notice</h2>
                            <p>
                                The information provided on this website is for general informational purposes only. While we strive for accuracy, we make no representations or warranties of any kind about the completeness, accuracy, reliability, or availability of information, products, or services.
                            </p>
                        </div>
                    </div>
                </Card>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    {/* General Disclaimer */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">1. General Disclaimer</h2>
                        <p>
                            All content and services provided by GVG Global Group are offered on an &quot;as is&quot; and &quot;as available&quot; basis. Your use of this website and our services is at your sole risk.
                        </p>
                        <p className="mt-4">
                            We disclaim all warranties of any kind, whether express or implied, including but not limited to:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Warranties of merchantability</li>
                            <li>Fitness for a particular purpose</li>
                            <li>Non-infringement</li>
                            <li>Accuracy or completeness of content</li>
                            <li>Uninterrupted or error-free service</li>
                        </ul>
                    </Card>

                    {/* Trading Disclaimer */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">2. Metals Trading Disclaimer</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Market Risks</h3>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Price Volatility:</strong> Metal prices are subject to market fluctuations. Past performance does not guarantee future results.</li>
                            <li><strong>No Investment Advice:</strong> Information on this site is not financial or investment advice. Consult professionals before making trading decisions.</li>
                            <li><strong>Market Conditions:</strong> Orders are subject to market availability and conditions at the time of execution.</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Product Specifications</h3>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Product descriptions and specifications are provided by suppliers and may vary</li>
                            <li>We recommend independent inspection and testing</li>
                            <li>Quality certifications are subject to verification</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">2.3 International Trade</h3>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Customs & Duties:</strong> Import duties, taxes, and customs clearance are buyer&apos;s responsibility unless specified</li>
                            <li><strong>Regulatory Compliance:</strong> Buyers must ensure compliance with local import regulations</li>
                            <li><strong>Export Controls:</strong> Products may be subject to export restrictions</li>
                        </ul>
                    </Card>

                    {/* IT Consulting Disclaimer */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">3. IT Consulting Disclaimer</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Professional Services</h3>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Consultation requests do not constitute binding agreements</li>
                            <li>Project timelines and estimates are subject to change</li>
                            <li>Final deliverables depend on requirements and scope agreed in formal contracts</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Software Development</h3>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>We do not guarantee bug-free or error-free software</li>
                            <li>Compatibility with third-party systems is not guaranteed</li>
                            <li>Software performance depends on infrastructure and implementation</li>
                        </ul>
                    </Card>

                    {/* Limitation of Liability */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">4. Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by applicable law, GVG Global Group shall not be liable for:
                        </p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li><strong>Indirect Damages:</strong> Loss of profits, revenue, data, or business opportunities</li>
                            <li><strong>Third-Party Actions:</strong> Acts or omissions of suppliers, carriers, customs authorities, or other third parties</li>
                            <li><strong>Force Majeure:</strong> Events beyond our reasonable control (natural disasters, wars, pandemics, government actions)</li>
                            <li><strong>Website Errors:</strong> Typographical errors, inaccuracies, or omissions on the website</li>
                            <li><strong>Unauthorized Access:</strong> Security breaches or unauthorized access to user data</li>
                        </ul>
                    </Card>

                    {/* External Links */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">5. External Links Disclaimer</h2>
                        <p>
                            Our website may contain links to external websites operated by third parties. We have no control over and assume no responsibility for:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Content, privacy policies, or practices of third-party sites</li>
                            <li>Accuracy or reliability of information on external sites</li>
                            <li>Products or services offered by third parties</li>
                        </ul>
                        <p className="mt-4">
                            Clicking on external links is at your own risk. We recommend reviewing the terms and privacy policies of any website you visit.
                        </p>
                    </Card>

                    {/* Professional Advice */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">6. Professional Advice Disclaimer</h2>
                        <p>
                            The information on this website is not intended as:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><strong>Legal Advice:</strong> Consult a qualified attorney for legal matters</li>
                            <li><strong>Financial Advice:</strong> Consult financial advisors for investment decisions</li>
                            <li><strong>Tax Advice:</strong> Consult tax professionals for tax implications</li>
                            <li><strong>Technical Advice:</strong> Formal IT consulting engagements require contracts</li>
                        </ul>
                    </Card>

                    {/* Regional Variations */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">7. Regional Variations</h2>
                        <p>
                            Laws and regulations vary by jurisdiction. This disclaimer is subject to applicable local laws in:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>United States and Canada (North America)</li>
                            <li>India (Asia-Pacific)</li>
                            <li>United Arab Emirates (Middle East)</li>
                            <li>South Africa (Africa)</li>
                            <li>Other jurisdictions where we operate</li>
                        </ul>
                        <p className="mt-4">
                            Where local laws provide greater consumer protection, those laws shall prevail over this disclaimer.
                        </p>
                    </Card>

                    {/* Changes */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">8. Changes to Disclaimer</h2>
                        <p>
                            We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting. Your continued use of our website and services after changes constitutes acceptance of the revised disclaimer.
                        </p>
                    </Card>

                    {/* Contact */}
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                        <div className="flex items-start gap-3">
                            <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-bold mb-2">Questions or Concerns?</h2>
                                <p className="mb-3">
                                    If you have questions about this disclaimer or need clarification on any matter:
                                </p>
                                <p>
                                    Email: <a href="mailto:legal@gvgglobal.com" className="text-blue-600 hover:underline">legal@gvgglobal.com</a>
                                </p>
                                <p className="mt-2">
                                    <Link href="/contact" className="text-blue-600 hover:underline font-semibold">
                                        View all contact information →
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Acceptance */}
                    <Card className="p-6 border-2 border-amber-500 dark:border-amber-600">
                        <h2 className="text-2xl font-bold mb-4">Acceptance of Disclaimer</h2>
                        <p>
                            By using this website and our services, you acknowledge that you have read, understood, and agree to be bound by this disclaimer. If you do not agree with any part of this disclaimer, please discontinue use of our services immediately.
                        </p>
                    </Card>
                </div>

                {/* Footer Links */}
                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>Related Documents:</p>
                    <div className="flex gap-4 justify-center mt-2 flex-wrap">
                        <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                        <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                        <Link href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link>
                        <Link href="/contact" className="text-blue-600 hover:underline">Contact Us</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
