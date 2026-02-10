'use client'

import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { submitQuote, SubmitQuoteState } from '@/actions/quotes'
import { CheckCircle2, Video, Loader2, Scale, Truck, Code2, Globe, Plane } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    const [isPending, setIsPending] = useState(false)


    // Configuration based on mode
    const getTheme = () => {
        switch (mode) {
            case 'tech':
                return {
                    primary: 'bg-emerald-600',
                    hover: 'hover:bg-emerald-700',
                    ring: 'focus:ring-emerald-500',
                    border: 'focus:border-emerald-500',
                    gradient: 'from-emerald-600 to-teal-600',
                    icon: Code2,
                    label: 'Tech Proposal'
                }
            case 'immigration':
                return {
                    primary: 'bg-blue-600',
                    hover: 'hover:bg-blue-700',
                    ring: 'focus:ring-blue-500',
                    border: 'focus:border-blue-500',
                    gradient: 'from-blue-600 to-teal-500',
                    icon: Plane,
                    label: 'Visa Assessment'
                }
            case 'logistics': // Scrap / Metals
                return {
                    primary: 'bg-amber-600',
                    hover: 'hover:bg-amber-700',
                    ring: 'focus:ring-amber-500',
                    border: 'focus:border-amber-500',
                    gradient: 'from-amber-600 to-orange-600',
                    icon: Scale,
                    label: 'Material Quote'
                }
            default:
                return {
                    primary: 'bg-slate-600',
                    hover: 'hover:bg-slate-700',
                    ring: 'focus:ring-slate-500',
                    border: 'focus:border-slate-500',
                    gradient: 'from-slate-600 to-slate-800',
                    icon: CheckCircle2,
                    label: 'Service Request'
                }
        }
    }

    const theme = getTheme()

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
                    'HMS 1&2 (80:20)',
                    'Shredded Steel',
                    'P&S Structural',
                    'Copper Wire (Millberry)',
                    'Aluminum Taint/Tabor',
                    'Brass Honey',
                    'Stainless Steel 304/316',
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
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
                        <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-6 ring-4 ring-opacity-20", theme.primary.replace('bg-', 'bg-').replace('600', '500/20'), theme.ring.replace('focus:ring-', 'ring-'))}>
                            <CheckCircle2 className={cn("h-8 w-8", theme.primary.replace('bg-', 'text-').replace('600', '400'))} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2" id="success-heading">Request Received!</h3>
                        <p className="text-slate-400 mb-8 max-w-xs mx-auto">
                            {state.message}
                        </p>

                        {state.meetingLink && mode !== 'logistics' && (
                            <div className="w-full max-w-sm bg-white/5 p-6 rounded-xl border border-white/10 mb-6 backdrop-blur-sm">
                                <h4 className="font-bold text-white mb-3 flex items-center justify-center gap-2">
                                    <Video className="h-5 w-5" /> Ready to talk now?
                                </h4>
                                <Button asChild className={cn("w-full font-bold", theme.primary, theme.hover)}>
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
                    <form action={formAction} className="space-y-5" onSubmit={() => setIsPending(true)}>
                        {/* Personal Details */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Organization / Name</Label>
                                <Input name="company_name" placeholder="Company or Full Name" required className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-offset-0" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Contact Person</Label>
                                <Input name="contact_person" placeholder="Jane Doe" required className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-offset-0" />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Email</Label>
                                <Input name="email" type="email" placeholder="jane@example.com" required className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-offset-0" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Phone</Label>
                                <Input name="phone" placeholder="+1..." className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-offset-0" />
                            </div>
                        </div>

                        {/* Service Selection */}
                        <div className="space-y-2">
                            <Label className="text-slate-300">
                                {mode === 'logistics' ? 'Material / Commodity' : 'Service Interest'}
                            </Label>
                            <Select
                                onValueChange={(val) => {
                                    const input = document.getElementById('service_interest_input') as HTMLInputElement;
                                    if (input) input.value = val;
                                }}
                                required
                            >
                                <SelectTrigger className="bg-slate-950/50 border-slate-700 text-white">
                                    <SelectValue placeholder={`Select ${mode === 'logistics' ? 'Material' : 'Service'}`} />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                    {getOptions().map((opt) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <input type="hidden" name="service_interest" id="service_interest_input" required />
                        </div>

                        {/* MODE SPECIFIC FIELDS */}
                        {mode === 'tech' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <Label className="text-slate-300">Preferred Tech Stack (Optional)</Label>
                                <Input name="tech_stack" placeholder="e.g. React, Python, AWS" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-offset-0" />
                            </div>
                        )}

                        {mode === 'immigration' && (
                            <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Destination Country</Label>
                                    <Input name="destination_country" placeholder="e.g. Canada, UK" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-offset-0" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Current Citizenship</Label>
                                    <Input name="current_location" placeholder="e.g. India, UAE" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-offset-0" />
                                </div>
                            </div>
                        )}

                        {mode === 'logistics' && (
                            <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Est. Weight / Quantity</Label>
                                    <Input name="commodity_type" placeholder="e.g. 500 Tons / 2 Containers" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-offset-0" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Pickup / Origin</Label>
                                    <Input name="target_port" placeholder="e.g. Toronto Yard / Dubai Port" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-offset-0" />
                                </div>
                            </div>
                        )}

                        {/* Details */}
                        <div className="space-y-2">
                            <Label className="text-slate-300">
                                {mode === 'logistics' ? 'Material Description & Notes' : 'Project details'}
                            </Label>
                            <Textarea
                                name="project_description"
                                placeholder={mode === 'logistics' ? "Describe material condition, attachments, or logistics requirements..." : "Briefly describe your goals..."}
                                className="min-h-[100px] bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-offset-0"
                                required
                            />
                        </div>

                        {/* Footer Fields */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">
                                    {mode === 'logistics' ? 'Target Price (Optional)' : 'Budget Range'}
                                </Label>
                                {mode === 'logistics' ? (
                                    <Input name="budget_range" placeholder="e.g. Market - 2%" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-offset-0" />
                                ) : (
                                    <>
                                        <Select
                                            onValueChange={(val) => {
                                                const input = document.getElementById('budget_range_input') as HTMLInputElement;
                                                if (input) input.value = val;
                                            }}
                                        >
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
                                        <input type="hidden" name="budget_range" id="budget_range_input" />
                                    </>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Timeline</Label>
                                <Input name="timeline" placeholder="e.g. ASAP, Next Month" className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-offset-0" />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className={cn(
                                "w-full font-bold h-12 shadow-lg mt-4 text-white bg-gradient-to-r hover:opacity-90 transition-all",
                                theme.gradient,
                                isPending && "opacity-70 cursor-not-allowed"
                            )}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                mode === 'logistics' ? 'Request Spot Rate' : 'Submit Quote Request'
                            )}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    )
}
