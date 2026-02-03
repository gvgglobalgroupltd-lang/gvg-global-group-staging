'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export function EnhancedQuoteForm() {
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement actual form submission
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 5000)
    }

    if (submitted) {
        return (
            <Card className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-emerald-600" />
                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Quote Request Received!</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Thank you for your interest. Our team will review your requirements and respond within 24 hours.
                </p>
                <p className="text-sm text-slate-500">
                    Check your email for confirmation
                </p>
            </Card>
        )
    }

    return (
        <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Request a Quote</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" required placeholder="John Doe" />
                    </div>
                    <div>
                        <Label htmlFor="company">Company Name *</Label>
                        <Input id="company" required placeholder="ABC Industries" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" required placeholder="john@company.com" />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" type="tel" required placeholder="+1 (555) 123-4567" />
                    </div>
                </div>

                {/* Material Details */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Material Requirements</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="metal-type">Metal Type *</Label>
                            <Select required>
                                <SelectTrigger id="metal-type">
                                    <SelectValue placeholder="Select metal type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hms1">HMS 1 (80:20)</SelectItem>
                                    <SelectItem value="hms2">HMS 2 (Shredded)</SelectItem>
                                    <SelectItem value="shredded-steel">Shredded Steel Scrap</SelectItem>
                                    <SelectItem value="cast-iron">Cast Iron Scrap</SelectItem>
                                    <SelectItem value="copper-wire">Copper Wire</SelectItem>
                                    <SelectItem value="copper-millberry">Copper Millberry</SelectItem>
                                    <SelectItem value="aluminum-6063">Aluminum 6063</SelectItem>
                                    <SelectItem value="aluminum-tense">Aluminum Tense</SelectItem>
                                    <SelectItem value="brass">Brass Scrap</SelectItem>
                                    <SelectItem value="stainless-304">Stainless Steel 304</SelectItem>
                                    <SelectItem value="other">Other (specify in notes)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="grade">Material Grade/Specification</Label>
                            <Input id="grade" placeholder="e.g., ISRI 200, 201" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <Label htmlFor="quantity">Quantity *</Label>
                            <Input id="quantity" type="number" required placeholder="1000" />
                        </div>
                        <div>
                            <Label htmlFor="unit">Unit *</Label>
                            <Select required>
                                <SelectTrigger id="unit">
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mt">Metric Tons (MT)</SelectItem>
                                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                    <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                                    <SelectItem value="tons">US Tons</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="frequency">Frequency</Label>
                            <Select>
                                <SelectTrigger id="frequency">
                                    <SelectValue placeholder="One-time / Regular" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="onetime">One-time Order</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="ongoing">Ongoing Supply</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Delivery Details */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Delivery Information</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="delivery-port">Delivery Port/Location *</Label>
                            <Input id="delivery-port" required placeholder="Houston, TX or Mumbai Port" />
                        </div>
                        <div>
                            <Label htmlFor="incoterm">Preferred Incoterm</Label>
                            <Select>
                                <SelectTrigger id="incoterm">
                                    <SelectValue placeholder="FOB, CIF, etc." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fob">FOB - Free On Board</SelectItem>
                                    <SelectItem value="cif">CIF - Cost Insurance Freight</SelectItem>
                                    <SelectItem value="cfr">CFR - Cost and Freight</SelectItem>
                                    <SelectItem value="exw">EXW - Ex Works</SelectItem>
                                    <SelectItem value="dap">DAP - Delivered at Place</SelectItem>
                                    <SelectItem value="ddp">DDP - Delivered Duty Paid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="timeline">Desired Delivery Timeline</Label>
                        <Input id="timeline" placeholder="e.g., Within 30 days, Q2 2026" />
                    </div>
                </div>

                {/* Additional Information */}
                <div>
                    <Label htmlFor="notes">Additional Notes / Special Requirements</Label>
                    <Textarea
                        id="notes"
                        rows={4}
                        placeholder="Please provide any specific requirements, quality standards, certifications needed, or other relevant information..."
                    />
                </div>

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full bg-slate-900 text-white hover:bg-slate-800">
                    Submit Quote Request
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-center text-slate-500">
                    By submitting this form, you agree to our{' '}
                    <a href="/privacy" className="underline hover:text-slate-700">Privacy Policy</a>
                </p>
            </form>
        </Card>
    )
}
