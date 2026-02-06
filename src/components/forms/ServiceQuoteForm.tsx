'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { submitQuote, SubmitQuoteState } from '@/actions/quotes'
import { CheckCircle2, Video, Loader2 } from 'lucide-react'

// Define supported modes
export type QuoteMode = 'tech' | 'immigration' | 'logistics'

interface ServiceQuoteFormProps {
    mode: QuoteMode
}

const initialState: SubmitQuoteState = {
    success: false,
    message: ''
}

export function ServiceQuoteForm({ mode }: ServiceQuoteFormProps) {
    // @ts-ignore
    const [state, formAction] = useActionState(submitQuote, initialState)

    // Configuration based on mode
    const getOptions = () => {
        switch (mode) {
            case 'tech':
                return [
                    'Custom ERP Development',
                    'Mobile App Development',
                    'QA & Testing Services',
                    'Cloud Solutions',
                    'IT Consulting',
                    'Other'
                ]
            case 'immigration':
                return [
                    'Study Visa',
                    'Work Permit',
                    'PR Application',
                    'Visitor Visa',
                    'Business Visa',
                    'Other'
                ]
            case 'logistics':
                return [
                    'Scrap Metal Import',
                    'Scrap Metal Export',
                    'Logistics & Shipping',
                    'Customs Clearance',
                    'Other'
                ]
            default:
                return ['Other']
        }
    }

    return (
        <div className="w-full">
            <div className="p-0">
                {state.success ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-green-500/40">
                            <CheckCircle2 className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Request Received!</h3>
                        <p className="text-slate-400 mb-8">
                            {state.message}
                        </p>

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
                                <Label className="text-slate-300">Organization / Name</Label>
                                <Input name="company_name" placeholder="Company or Full Name" required className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Contact Person</Label>
                                <Input name="contact_person" placeholder="Jane Doe" required className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Email</Label>
                                <Input name="email" type="email" placeholder="jane@example.com" required className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
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
                                    <SelectValue placeholder={`Select ${mode} service`} />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                    {getOptions().map((opt) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* MODE SPECIFIC FIELDS */}
                        {mode === 'tech' && (
                            <div className="space-y-2">
                                <Label className="text-slate-300">Preferred Tech Stack (Optional)</Label>
                                <Input name="tech_stack" placeholder="e.g. React, Python, AWS" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                            </div>
                        )}

                        {mode === 'immigration' && (
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Destination Country</Label>
                                    <Input name="destination_country" placeholder="e.g. Canada, UK" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Current Location</Label>
                                    <Input name="current_location" placeholder="e.g. India, UAE" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                                </div>
                            </div>
                        )}

                        {mode === 'logistics' && (
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Commodity / Item</Label>
                                    <Input name="commodity_type" placeholder="e.g. Copper Scrap" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Target Port / Location</Label>
                                    <Input name="target_port" placeholder="e.g. Mundra, Nhava Sheva" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-slate-300">Project / Request Details</Label>
                            <Textarea name="project_description" placeholder="Briefly describe your requirements..." className="min-h-[100px] bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" required />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Budget Range (Optional)</Label>
                                <Select name="budget_range">
                                    <SelectTrigger className="bg-slate-950/50 border-slate-700 text-white">
                                        <SelectValue placeholder="Select range" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                        <SelectItem value="Under $5k">Small / Under $5k</SelectItem>
                                        <SelectItem value="$5k - $15k">Medium / $5k - $15k</SelectItem>
                                        <SelectItem value="$15k - $50k">Large / $15k - $50k</SelectItem>
                                        <SelectItem value="$50k+">Enterprise / $50k+</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Target Timeline</Label>
                                <Input name="timeline" placeholder="e.g. ASAP, 3 months" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold h-12 shadow-lg shadow-indigo-500/20 mt-2">
                            Submit Request
                        </Button>
                    </form>
                )}
            </div>
        </div>
    )
}
