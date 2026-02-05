
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
        <div className="w-full">
            {/* Sidebar / Info Panel Removed - Layout handled in Parent Page */}

            {/* Form Panel - Transparent Background */}
            <div className="p-0">
                {state.success ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-green-500/40">
                            <CheckCircle2 className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Quote Requested!</h3>
                        <p className="text-slate-400 mb-8">
                            {state.message}
                        </p>

                        {/* Video Bridge */}
                        {state.meetingLink && (
                            <div className="w-full max-w-sm bg-indigo-900/30 p-6 rounded-xl border border-indigo-500/30 mb-6">
                                <h4 className="font-bold text-indigo-300 mb-3 flex items-center justify-center gap-2">
                                    <Video className="h-5 w-5" /> Ready to talk now?
                                </h4>
                                <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                                    <a href={state.meetingLink} target="_blank" rel="noopener noreferrer">
                                        Join Instant Consultation
                                    </a>
                                </Button>
                                <p className="text-xs text-slate-500 mt-2">
                                    Powered by Jitsi Meet - No install required
                                </p>
                            </div>
                        )}

                        <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => window.location.reload()}>
                            Submit another request
                        </Button>
                    </div>
                ) : (
                    <form action={formAction} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Company Name</Label>
                                <Input name="company_name" placeholder="Acme Inc." required className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Contact Person</Label>
                                <Input name="contact_person" placeholder="Jane Doe" required className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Email</Label>
                                <Input name="email" type="email" placeholder="jane@acme.com" required className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Phone (Optional)</Label>
                                <Input name="phone" placeholder="+1..." className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300">Service Interest</Label>
                            <Select name="service_interest" required>
                                <SelectTrigger className="bg-slate-950/50 border-slate-700 text-white focus:ring-indigo-500">
                                    <SelectValue placeholder="Select primary interest" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700 text-white">
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
                            <Label className="text-slate-300">Project Description</Label>
                            <Textarea name="project_description" placeholder="Briefly describe your goals..." className="min-h-[100px] bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" required />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300">Preferred Tech Stack (Optional)</Label>
                            <Input name="tech_stack" placeholder="e.g. React, Python, AWS" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Budget Range</Label>
                                <Select name="budget_range">
                                    <SelectTrigger className="bg-slate-950/50 border-slate-700 text-white">
                                        <SelectValue placeholder="Select range" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                        <SelectItem value="Under $5k">Under $5k</SelectItem>
                                        <SelectItem value="$5k - $15k">$5k - $15k</SelectItem>
                                        <SelectItem value="$15k - $50k">$15k - $50k</SelectItem>
                                        <SelectItem value="$50k+">$50k+</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Target Timeline</Label>
                                <Input name="timeline" placeholder="e.g. 3 months" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold h-12 shadow-lg shadow-indigo-500/20 mt-2">
                            Submit Request
                        </Button>
                    </form>
                )}
            </div>
        </div>
    )
}
