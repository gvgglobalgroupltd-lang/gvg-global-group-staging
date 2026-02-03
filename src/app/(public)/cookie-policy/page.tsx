import { Cookie, CheckSquare, XSquare, Settings } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                    <Cookie className="h-10 w-10 text-amber-600" />
                    <h1 className="text-4xl font-bold">Cookie Policy</h1>
                </div>
                <p className="text-muted-foreground mb-8">
                    Last Updated: February 3, 2026
                </p>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    {/* Introduction */}
                    <Card className="p-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                        <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
                        <p>
                            Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
                        </p>
                    </Card>

                    {/* Types of Cookies */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">1. Types of Cookies We Use</h2>

                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckSquare className="h-5 w-5 text-green-600" />
                                    <h3 className="text-xl font-semibold">Strictly Necessary Cookies</h3>
                                </div>
                                <p className="ml-7">
                                    <strong>Purpose:</strong> Essential for website functionality. These cookies enable core features like security, network management, and accessibility.
                                </p>
                                <p className="ml-7 mt-2 text-sm text-muted-foreground">
                                    <strong>Examples:</strong> Session cookies, authentication cookies, security tokens
                                </p>
                                <p className="ml-7 mt-2 text-sm">
                                    <strong>Can be disabled:</strong> No - required for site operation
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Settings className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-xl font-semibold">Functional Cookies</h3>
                                </div>
                                <p className="ml-7">
                                    <strong>Purpose:</strong> Remember your preferences and choices to provide enhanced, personalized features.
                                </p>
                                <p className="ml-7 mt-2 text-sm text-muted-foreground">
                                    <strong>Examples:</strong> Language preference, currency selection, UI customization
                                </p>
                                <p className="ml-7 mt-2 text-sm">
                                    <strong>Can be disabled:</strong> Yes - but may affect user experience
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Settings className="h-5 w-5 text-purple-600" />
                                    <h3 className="text-xl font-semibold">Analytics Cookies</h3>
                                </div>
                                <p className="ml-7">
                                    <strong>Purpose:</strong> Collect information about how visitors use our website to help us improve it.
                                </p>
                                <p className="ml-7 mt-2 text-sm text-muted-foreground">
                                    <strong>Examples:</strong> Google Analytics, page views, bounce rate, session duration
                                </p>
                                <p className="ml-7 mt-2 text-sm">
                                    <strong>Can be disabled:</strong> Yes - via cookie preferences
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <XSquare className="h-5 w-5 text-red-600" />
                                    <h3 className="text-xl font-semibold">Marketing Cookies</h3>
                                </div>
                                <p className="ml-7">
                                    <strong>Purpose:</strong> Track visitor activity to deliver targeted advertising.
                                </p>
                                <p className="ml-7 mt-2 text-sm text-muted-foreground">
                                    <strong>Examples:</strong> Ad retargeting, campaign tracking, social media pixels
                                </p>
                                <p className="ml-7 mt-2 text-sm">
                                    <strong>Can be disabled:</strong> Yes - highly recommended to manage via preferences
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Specific Cookies */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">2. Cookies We Set</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 px-2">Cookie Name</th>
                                        <th className="text-left py-2 px-2">Purpose</th>
                                        <th className="text-left py-2 px-2">Duration</th>
                                        <th className="text-left py-2 px-2">Type</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="py-2 px-2 font-mono text-xs">sb-access-token</td>
                                        <td className="py-2 px-2">User authentication</td>
                                        <td className="py-2 px-2">Session</td>
                                        <td className="py-2 px-2">Necessary</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 px-2 font-mono text-xs">sb-refresh-token</td>
                                        <td className="py-2 px-2">Session management</td>
                                        <td className="py-2 px-2">7 days</td>
                                        <td className="py-2 px-2">Necessary</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 px-2 font-mono text-xs">theme-preference</td>
                                        <td className="py-2 px-2">Remember dark/light mode</td>
                                        <td className="py-2 px-2">1 year</td>
                                        <td className="py-2 px-2">Functional</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 px-2 font-mono text-xs">_ga</td>
                                        <td className="py-2 px-2">Google Analytics tracking</td>
                                        <td className="py-2 px-2">2 years</td>
                                        <td className="py-2 px-2">Analytics</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 px-2 font-mono text-xs">cookie-consent</td>
                                        <td className="py-2 px-2">Remember cookie preferences</td>
                                        <td className="py-2 px-2">1 year</td>
                                        <td className="py-2 px-2">Necessary</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Third-Party Cookies */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">3. Third-Party Cookies</h2>
                        <p className="mb-4">
                            Some cookies are placed by third-party services that appear on our pages:
                        </p>

                        <ul className="space-y-3">
                            <li>
                                <strong>Google Analytics:</strong> We use Google Analytics to understand how visitors interact with our site.{' '}
                                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    Google Privacy Policy
                                </a>
                            </li>
                            <li>
                                <strong>Payment Processors:</strong> Secure payment page cookies (if applicable)
                            </li>
                            <li>
                                <strong>Social Media:</strong> Social sharing buttons may set cookies
                            </li>
                        </ul>
                    </Card>

                    {/* Managing Cookies */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">4. How to Control Cookies</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Browser Settings</h3>
                        <p className="mb-3">Most browsers allow you to control cookies through settings:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Chrome</a></li>
                            <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
                            <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Safari</a></li>
                            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Our Cookie Preferences</h3>
                        <p className="mb-3">You can manage your cookie preferences directly on our site:</p>
                        <Button variant="outline">
                            Manage Cookie Preferences
                        </Button>

                        <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Opt-Out Tools</h3>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Analytics Opt-out</a></li>
                            <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Your Online Choices (EU)</a></li>
                            <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Digital Advertising Alliance (US)</a></li>
                        </ul>
                    </Card>

                    {/* Impact of Disabling */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">5. Impact of Disabling Cookies</h2>
                        <p>
                            If you disable certain cookies, some features of our website may not function properly:
                        </p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li>You may need to re-enter information on subsequent visits</li>
                            <li>Personalized features may not work</li>
                            <li>Some pages may not display correctly</li>
                            <li>You may not be able to complete transactions</li>
                        </ul>
                    </Card>

                    {/* Updates */}
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">6. Updates to This Policy</h2>
                        <p>
                            We may update this Cookie Policy to reflect changes in our practices or for operational, legal, or regulatory reasons. Please revisit this page periodically to stay informed.
                        </p>
                    </Card>

                    {/* Contact */}
                    <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
                        <h2 className="text-2xl font-bold mb-4">7. Questions?</h2>
                        <p>
                            If you have questions about our use of cookies, please contact us at{' '}
                            <a href="mailto:privacy@gvgglobal.com" className="text-blue-600 hover:underline">
                                privacy@gvgglobal.com
                            </a>
                        </p>
                    </Card>
                </div>

                {/* Footer Links */}
                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>Related Policies:</p>
                    <div className="flex gap-4 justify-center mt-2 flex-wrap">
                        <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                        <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                        <Link href="/disclaimer" className="text-blue-600 hover:underline">Disclaimer</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
