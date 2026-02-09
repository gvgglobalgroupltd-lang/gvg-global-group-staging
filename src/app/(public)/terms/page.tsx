import { Scale, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                    <Scale className="h-10 w-10 text-blue-600" />
                    <h1 className="text-4xl font-bold">Terms of Service</h1>
                </div>
                <p className="text-muted-foreground mb-8">
                    Last Updated: February 3, 2026
                </p>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    {/* Introduction */}
                    <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                        <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
                        <p>
                            Welcome to GVG Global Group. By accessing our website and using our services, you agree to be bound by these Terms of Service. These terms apply to all users, including browsers, vendors, customers, and contributors of content.
                        </p>
                        <p className="mt-4">
                            If you do not agree with any part of these terms, you must not use our services.
                        </p>
                    </Card>

                    {/* Definitions */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">1. Definitions</h2>
                        <ul className="space-y-2">
                            <li><strong>&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot;</strong> refers to GVG Global Group</li>
                            <li><strong>&quot;Services&quot;</strong> includes metals trading, IT consulting, and related services</li>
                            <li><strong>&quot;User,&quot; &quot;you,&quot;</strong> refers to individuals or entities using our services</li>
                            <li><strong>&quot;Platform&quot;</strong> refers to our website and associated systems</li>
                            <li><strong>&quot;Content&quot;</strong> includes text, graphics, data, and other materials</li>
                        </ul>
                    </Card>

                    {/* Services */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">2. Our Services</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Metals Trading Division</h3>
                        <p>We facilitate international trade in metals and commodities through:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Import and export services</li>
                            <li>Logistics and shipping coordination</li>
                            <li>Quality assurance and inspection</li>
                            <li>Documentation and compliance support</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">2.2 IT Consulting Division</h3>
                        <p>We provide technology solutions including:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Custom ERP development</li>
                            <li>Mobile application development</li>
                            <li>Quality assurance and testing</li>
                            <li>IT consulting services</li>
                        </ul>
                    </Card>

                    {/* User Obligations */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">3. User Obligations</h2>

                        <p>Users agree to:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Provide accurate, current, and complete information</li>
                            <li>Maintain the security of account credentials</li>
                            <li>Comply with all applicable laws and regulations</li>
                            <li>Not engage in fraudulent activities</li>
                            <li>Not interfere with service operations</li>
                            <li>Respect intellectual property rights</li>
                        </ul>
                    </Card>

                    {/* Trading Terms */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">4. Trading Terms & Conditions</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Orders and Contracts</h3>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>All orders are subject to acceptance and confirmation</li>
                            <li>Pricing is subject to market conditions and availability</li>
                            <li>Payment terms as agreed in individual contracts</li>
                            <li>Delivery timelines are estimates, not guarantees</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Incoterms</h3>
                        <p>
                            International transactions follow Incoterms® 2020. Responsibilities and risks transfer according to the agreed Incoterm (FOB, CIF, CFR, etc.).
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Quality and Inspection</h3>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Quality specifications as per contract</li>
                            <li>Independent inspection available (costs as agreed)</li>
                            <li>Claims must be submitted within specified timeframes</li>
                        </ul>
                    </Card>

                    {/* Payment */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">5. Payment Terms</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Accepted Methods</h3>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Wire transfer / Bank transfer</li>
                            <li>Letter of Credit (LC)</li>
                            <li>Other methods as mutually agreed</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Payment Schedule</h3>
                        <p>
                            Payment terms are specified in individual contracts. Standard terms may include advance payment, balance against documents, or credit arrangements for qualified customers.
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Late Payments</h3>
                        <p>
                            Overdue payments may incur interest charges and may result in suspension of services.
                        </p>
                    </Card>

                    {/* Shipping & Delivery */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">6. Shipping and Delivery</h2>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Shipping timelines are estimates based on logistics partners</li>
                            <li>Risk of loss transfers per agreed Incoterm</li>
                            <li>Insurance available as per contract terms</li>
                            <li>Force majeure events may delay delivery without liability</li>
                        </ul>
                    </Card>

                    {/* Intellectual Property */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">7.1 Our IP</h3>
                        <p>
                            All content, trademarks, logos, and materials on our platform are owned by GVG Global Group and protected by copyright and trademark laws.
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-6">7.2 IT Consulting IP</h3>
                        <p>
                            For IT consulting projects, intellectual property rights are defined in individual project agreements. Custom developments typically transfer to client upon full payment, unless otherwise specified.
                        </p>
                    </Card>

                    {/* Limitation of Liability */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by law:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>We are not liable for indirect, incidental, or consequential damages</li>
                            <li>Our liability is limited to the contract value of the specific transaction</li>
                            <li>We are not responsible for acts of third-party logistics providers</li>
                            <li>Force majeure events exempt us from liability</li>
                        </ul>

                        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                            <p className="flex items-start gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <span>
                                    <strong>Important:</strong> Some jurisdictions do not allow limitations on liability. In such cases, our liability shall be limited to the fullest extent permitted by applicable law.
                                </span>
                            </p>
                        </div>
                    </Card>

                    {/* Warranties */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">9. Warranties and Disclaimers</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">9.1 Product Warranties</h3>
                        <p>
                            Products are warranted to meet specifications in the contract. No other warranties are provided unless explicitly stated.
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-6">9.2 Service Availability</h3>
                        <p>
                            Services are provided &quot;as is.&quot; We do not guarantee uninterrupted or error-free platform access.
                        </p>
                    </Card>

                    {/* Compliance */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">10. Export Control and Compliance</h2>
                        <p>
                            Users agree to comply with all applicable export control laws and regulations, including but not limited to:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>U.S. Export Administration Regulations (EAR)</li>
                            <li>International Traffic in Arms Regulations (ITAR)</li>
                            <li>EU Dual-Use Regulation</li>
                            <li>UN Security Council Resolutions</li>
                            <li>Local import/export regulations</li>
                        </ul>
                    </Card>

                    {/* Termination */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate access to services for:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Violation of these terms</li>
                            <li>Fraudulent activity</li>
                            <li>Non-payment</li>
                            <li>Conduct harmful to our business or other users</li>
                        </ul>
                    </Card>

                    {/* Governing Law */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">12. Governing Law and Dispute Resolution</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">12.1 Governing Law</h3>
                        <p>
                            These terms are governed by laws applicable to the jurisdiction of the contracting entity (specified in individual contracts).
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-6">12.2 Dispute Resolution</h3>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Negotiation:</strong> Parties agree to attempt good-faith negotiations first</li>
                            <li><strong>Arbitration:</strong> Disputes may be submitted to binding arbitration</li>
                            <li><strong>Venue:</strong> As specified in individual contracts</li>
                        </ul>
                    </Card>

                    {/* Changes */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">13. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. Material changes will be communicated via email or platform notification. Continued use after changes constitutes acceptance.
                        </p>
                    </Card>

                    {/* Contact */}
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                        <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
                        <p className="mb-4">For questions about these terms:</p>

                        <div className="space-y-2">
                            <p><strong>Email:</strong> legal@gvgglobal.com</p>
                            <p><strong>Metals Trading:</strong> metals@gvgglobal.com</p>
                            <p><strong>IT Consulting:</strong> tech@gvgglobal.com</p>
                            <p className="mt-4">
                                <Link href="/contact" className="text-blue-600 hover:underline font-semibold">
                                    View all regional contact information →
                                </Link>
                            </p>
                        </div>
                    </Card>

                    {/* Acceptance */}
                    <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-bold mb-2">Acceptance of Terms</h2>
                                <p>
                                    By using GVG Global Group services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Footer Links */}
                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>Related Documents:</p>
                    <div className="flex gap-4 justify-center mt-2 flex-wrap">
                        <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                        <Link href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link>
                        <Link href="/disclaimer" className="text-blue-600 hover:underline">Disclaimer</Link>
                        <Link href="/contact" className="text-blue-600 hover:underline">Contact Us</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
