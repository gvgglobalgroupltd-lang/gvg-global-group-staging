import { Building2, Mail, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">
                    Last Updated: February 3, 2026
                </p>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    {/* Introduction */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                        <p>
                            GVG Global Group (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, including our metals trading and IT consulting divisions.
                        </p>
                        <p className="mt-4">
                            This policy applies to all users worldwide and complies with applicable data protection regulations including GDPR (EU), CCPA (California), PIPEDA (Canada), and other international privacy laws.
                        </p>
                    </Card>

                    {/* Information We Collect */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Personal Information</h3>
                        <p>We may collect the following personal information:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Contact Information:</strong> Name, email address, phone number, company name, job title</li>
                            <li><strong>Business Information:</strong> Company details, tax identification, trade licenses</li>
                            <li><strong>Financial Information:</strong> Billing address, payment information (processed securely through third-party providers)</li>
                            <li><strong>Communication Data:</strong> Records of correspondence, consultation requests, support tickets</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Automatically Collected Information</h3>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Usage Data:</strong> IP address, browser type, device information, pages visited</li>
                            <li><strong>Cookies:</strong> See our Cookie Policy for details</li>
                            <li><strong>Analytics:</strong> Website performance and user behavior metrics</li>
                        </ul>
                    </Card>

                    {/* How We Use Information */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                        <p>We use collected information for:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Service Delivery:</strong> Processing trade transactions, providing IT consulting services</li>
                            <li><strong>Communication:</strong> Responding to inquiries, sending updates, marketing (with consent)</li>
                            <li><strong>Compliance:</strong> Meeting legal obligations, export controls, trade regulations</li>
                            <li><strong>Improvement:</strong> Enhancing our services, website functionality, user experience</li>
                            <li><strong>Security:</strong> Protecting against fraud, unauthorized access, and security threats</li>
                        </ul>
                    </Card>

                    {/* Data Sharing */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">4. Information Sharing and Disclosure</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">4.1 We Share Information With:</h3>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Service Providers:</strong> Payment processors, shipping partners, logistics providers</li>
                            <li><strong>Business Partners:</strong> Suppliers, customers (with consent, for transaction purposes)</li>
                            <li><strong>Legal Authorities:</strong> When required by law, court order, or regulatory compliance</li>
                            <li><strong>Professional Advisors:</strong> Lawyers, accountants, consultants (under confidentiality)</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">4.2 International Transfers</h3>
                        <p>
                            We operate globally with offices in USA, Canada, India, UAE, and Africa. Your data may be transferred and processed in these jurisdictions. We ensure appropriate safeguards are in place for cross-border data transfers as required by applicable laws.
                        </p>
                    </Card>

                    {/* Data Retention */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
                        <p>
                            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Trade and financial records are retained for 7 years as per international accounting standards.
                        </p>
                    </Card>

                    {/* Your Rights */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">6. Your Privacy Rights</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">6.1 General Rights</h3>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your data (subject to legal obligations)</li>
                            <li><strong>Portability:</strong> Receive your data in a structured format</li>
                            <li><strong>Objection:</strong> Object to processing for certain purposes</li>
                            <li><strong>Restriction:</strong> Request restriction of processing</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Region-Specific Rights</h3>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>EU/EEA (GDPR):</strong> Right to lodge complaint with supervisory authority</li>
                            <li><strong>California (CCPA):</strong> Right to opt-out of sale of personal information</li>
                            <li><strong>Canada (PIPEDA):</strong> Right to withdraw consent</li>
                            <li><strong>India (DPDP Act):</strong> Right to nominate representative</li>
                        </ul>
                    </Card>

                    {/* Security */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">7. Security Measures</h2>
                        <p>
                            We implement appropriate technical and organizational measures to protect your personal information:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Encryption in transit (SSL/TLS) and at rest</li>
                            <li>Access controls and authentication</li>
                            <li>Regular security assessments and audits</li>
                            <li>Employee training on data protection</li>
                            <li>Incident response procedures</li>
                        </ul>
                    </Card>

                    {/* Cookies */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">8. Cookies and Tracking</h2>
                        <p>
                            We use cookies and similar tracking technologies. For detailed information, please see our{' '}
                            <Link href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link>.
                        </p>
                    </Card>

                    {/* Children's Privacy */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">9. Children&apos;s Privacy</h2>
                        <p>
                            Our services are intended for business use only. We do not knowingly collect information from individuals under 18 years of age.
                        </p>
                    </Card>

                    {/* Changes */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy periodically. We will notify you of material changes by posting the new policy with an updated &quot;Last Updated&quot; date. Continued use of our services after changes constitutes acceptance.
                        </p>
                    </Card>

                    {/* Contact */}
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                        <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
                        <p className="mb-4">For privacy-related questions or to exercise your rights, contact us:</p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="font-semibold">Data Protection Officer</p>
                                    <p>Email: privacy@gvgglobal.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Building2 className="h-5 w-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="font-semibold">GVG Global Group</p>
                                    <p>Global Headquarters</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="font-semibold">Regional Offices:</p>
                                    <ul className="text-sm space-y-1 mt-1">
                                        <li>USA: +1-XXX-XXX-XXXX</li>
                                        <li>Canada: +1-XXX-XXX-XXXX</li>
                                        <li>India: +91-XXX-XXX-XXXX</li>
                                        <li>UAE: +971-XX-XXX-XXXX</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Legal Basis (GDPR) */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">12. Legal Basis for Processing (GDPR)</h2>
                        <p>For users in the EU/EEA, we process personal data based on:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Contract Performance:</strong> To fulfill our contractual obligations</li>
                            <li><strong>Legal Obligation:</strong> To comply with laws and regulations</li>
                            <li><strong>Legitimate Interests:</strong> For business operations and fraud prevention</li>
                            <li><strong>Consent:</strong> Where you have given explicit consent (can be withdrawn)</li>
                        </ul>
                    </Card>
                </div>

                {/* Footer Links */}
                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>Related Policies:</p>
                    <div className="flex gap-4 justify-center mt-2 flex-wrap">
                        <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                        <Link href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link>
                        <Link href="/disclaimer" className="text-blue-600 hover:underline">Disclaimer</Link>
                        <Link href="/contact" className="text-blue-600 hover:underline">Contact Us</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
