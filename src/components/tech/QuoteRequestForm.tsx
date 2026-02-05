
'use client'

import { useActionState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { submitQuote, SubmitQuoteState } from '@/actions/quotes'
import { CheckCircle2, Video, ArrowRight, Loader2 } from 'lucide-react'

const initialState: SubmitQuoteState = {
    success: false,
    message: ''
}

export function QuoteRequestForm() {
    // @ts-ignore - Temporary ignore for type mismatch if types aren't fully synced
    const [state, formAction] = useActionState(submitQuote, initialState)

    return (
        <Card className="max-w-4xl mx-auto bg-white dark:bg-slate-900 shadow-xl border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="grid md:grid-cols-5 h-full">
                {/* Sidebar / Info Panel */}
                <div className="md:col-span-2 bg-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 opacity-90"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4">Start Your Project</h3>
                        <p className="text-indigo-100 mb-8 leading-relaxed">
                            Share your vision with us. We provide detailed technical proposals including architecture, timeline, and cost breakdown.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm font-medium text-indigo-100">
                                <span className="p-1 bg-white/10 rounded-full"><CheckCircle2 className="h-4 w-4" /></span>
                                Confidentiality NDA
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-indigo-100">
                                <span className="p-1 bg-white/10 rounded-full"><CheckCircle2 className="h-4 w-4" /></span>
                                Free Initial Architecture Review
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-indigo-100">
                                <span className="p-1 bg-white/10 rounded-full"><CheckCircle2 className="h-4 w-4" /></span>
                                Fixed Price or T&M Options
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 mt-12">
                        <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                            <p className="text-xs text-indigo-200 uppercase tracking-widest mb-1">Direct Contact</p>
                            <p className="font-bold text-lg">tech@gvg-group.com</p>
                        </div>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="md:col-span-3 p-8">
                    {state.success ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quote Requested!</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-8">
                                {state.message}
                            </p>

                            {/* Video Bridge */}
                            {state.meetingLink && (
                                <div className="w-full max-w-sm bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800 mb-6">
                                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center justify-center gap-2">
                                        <Video className="h-5 w-5" /> Ready to talk now?
                                    </h4>
                                    <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                                        <a href={state.meetingLink} target="_blank" rel="noopener noreferrer">
                                            Join Instant Consultation
                                        </a>
                                    </Button>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Powered by Jitsi Meet - No install required
                                    </p>
                                </div>
                            )}

                            <Button variant="ghost" onClick={() => window.location.reload()}>
                                Submit another request
                            </Button>
                        </div>
                    ) : (
                        <form action={formAction} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input name="company_name" placeholder="Acme Inc." required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Contact Person</Label>
                                    <Input name="contact_person" placeholder="Jane Doe" required />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input name="email" type="email" placeholder="jane@acme.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone (Optional)</Label>
                                    <Input name="phone" placeholder="+1..." />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Service Interest</Label>
                                <Select name="service_interest" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select primary interest" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Custom ERP Development">Custom ERP Development</SelectItem>
                                        <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                                        <SelectItem value="QA & Testing Services">QA & Testing Services</SelectItem>
                                        <SelectItem value="Cloud Solutions">Cloud Solutions</SelectItem>
                                        <SelectItem value="Agentic AI Consulting">Agentic AI Consulting</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Project Description</Label>
                                <Textarea name="project_description" placeholder="Briefly describe your goals, requirements, and current challenges..." className="min-h-[100px]" required />
                            </div>

                            <div className="space-y-2">
                                <Label>Preferred Tech Stack (Optional)</Label>
                                <Input name="tech_stack" placeholder="e.g. React, Python, AWS, etc." />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Budget Range (Optional)</Label>
                                    <Select name="budget_range">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Under $5k">Under $5k</SelectItem>
                                            <SelectItem value="$5k - $15k">$5k - $15k</SelectItem>
                                            <SelectItem value="$15k - $50k">$15k - $50k</SelectItem>
                                            <SelectItem value="$50k+">$50k+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Target Timeline (Optional)</Label>
                                    <Input name="timeline" placeholder="e.g. 3 months" />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 mt-4 h-11 text-base">
                                Request Quote
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </Card>
    )
}
