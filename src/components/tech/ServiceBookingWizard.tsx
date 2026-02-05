
'use client'

import { useState, useEffect, useActionState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
// import { useFormState } from 'react-dom' // Deprecated in React 19
import { createBooking, CreateBookingState } from '@/actions/bookings'
import { checkServiceAvailability, ServiceItem, getServices } from '@/actions/services'
import { AlertCircle, CheckCircle2, MapPin, Calendar, Clock, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const initialState: CreateBookingState = {
    success: false,
    message: ''
}

export function ServiceBookingWizard() {
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [services, setServices] = useState<ServiceItem[]>([])
    const [selectedServiceId, setSelectedServiceId] = useState<string>('')
    const [availability, setAvailability] = useState<{ available: boolean, message: string } | null>(null)
    const [postalCode, setPostalCode] = useState('')
    const [loadingServices, setLoadingServices] = useState(true)
    const [checkingAvailability, setCheckingAvailability] = useState(false)
    const [formState, formAction] = useActionState(createBooking, initialState)

    // Load services on mount
    useEffect(() => {
        getServices().then(data => {
            setServices(data)
            setLoadingServices(false)
        })
    }, [])

    const selectedService = services.find(s => s.id === selectedServiceId)

    const handleServiceSelect = async (serviceId: string) => {
        setSelectedServiceId(serviceId)
        setAvailability(null) // Reset availability check
    }

    const handleCheckAvailability = async () => {
        if (!selectedService || !postalCode) return

        setCheckingAvailability(true)
        const result = await checkServiceAvailability(postalCode, selectedService.category)
        setAvailability(result)
        setCheckingAvailability(false)
    }

    const nextStep = () => {
        if (step === 1) {
            if (!selectedService) return
            // If hardware, ensure valid availability check
            if (selectedService.category === 'Hardware') {
                if (!availability?.available) return
            }
        }
        setStep(prev => (prev + 1) as 1 | 2 | 3)
    }

    const prevStep = () => setStep(prev => (prev - 1) as 1 | 2 | 3)

    return (
        <div className="w-full">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 relative px-4">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-white/10 -z-0"></div>
                {[1, 2, 3].map((s) => (
                    <div key={s} className={cn(
                        "relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ring-4 ring-slate-900",
                        step >= s ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-500"
                    )}>
                        {s}
                    </div>
                ))}
            </div>

            <form action={formAction}>
                {/* SUCCESS STATE */}
                {formState.success ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-green-500/30">
                            <CheckCircle2 className="h-8 w-8 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                        <p className="text-slate-400 mb-8">
                            {formState.message}
                        </p>
                        <Button
                            className="bg-white/10 hover:bg-white/20 text-white"
                            variant="outline"
                            onClick={() => window.location.reload()}
                        >
                            Book Another Service
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* STEP 1: SELECT SERVICE */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h2 className="text-xl font-bold text-white">Select a Service</h2>
                                    <p className="text-sm text-slate-400">Choose the service you need assistance with</p>
                                </div>

                                {loadingServices ? (
                                    <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-indigo-500" /></div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {services.map(service => (
                                            <div
                                                key={service.id}
                                                className={cn(
                                                    "cursor-pointer p-4 rounded-xl border transition-all text-left",
                                                    selectedServiceId === service.id
                                                        ? "border-indigo-500 bg-indigo-500/20"
                                                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                                )}
                                                onClick={() => handleServiceSelect(service.id)}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-white text-sm">{service.name}</h3>
                                                    <span className={cn(
                                                        "text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide",
                                                        service.category === 'Hardware' ? "bg-amber-500/20 text-amber-300" : "bg-blue-500/20 text-blue-300"
                                                    )}>
                                                        {service.category}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 mb-2 line-clamp-2">{service.description}</p>
                                                <p className="text-xs font-semibold text-indigo-300">{service.price_range}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <input type="hidden" name="service_id" value={selectedServiceId} />

                                {/* Geofencing Check for Hardware */}
                                {selectedService?.category === 'Hardware' && (
                                    <div className="bg-amber-900/20 p-4 rounded-xl border border-amber-500/30 animate-in fade-in slide-in-from-top-4">
                                        <h4 className="font-bold flex items-center gap-2 text-amber-400 mb-3 text-sm">
                                            <MapPin className="h-4 w-4" /> Location Check Required
                                        </h4>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Postal Code (e.g. B3K)"
                                                value={postalCode}
                                                onChange={(e) => {
                                                    setPostalCode(e.target.value)
                                                    setAvailability(null)
                                                }}
                                                className="bg-slate-950/50 border-amber-500/30 text-white placeholder:text-slate-600 h-9 text-sm"
                                            />
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="bg-amber-600 hover:bg-amber-700 text-white"
                                                onClick={handleCheckAvailability}
                                                disabled={!postalCode || checkingAvailability}
                                            >
                                                {checkingAvailability ? "Checking..." : "Verify"}
                                            </Button>
                                        </div>

                                        {availability && (
                                            <div className={cn(
                                                "mt-3 p-2 rounded text-xs font-medium flex items-center gap-2",
                                                availability.available
                                                    ? "bg-green-500/20 text-green-300"
                                                    : "bg-red-500/20 text-red-300"
                                            )}>
                                                {availability.available ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                                {availability.message}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 2: DETAILS */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="text-center mb-4">
                                    <h2 className="text-xl font-bold text-white">Booking Details</h2>
                                    <p className="text-sm text-slate-400">Your contact info</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-300 text-xs">Name</Label>
                                        <Input name="customer_name" placeholder="John Doe" required className="bg-slate-950/50 border-slate-700 text-white h-9" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-300 text-xs">Email</Label>
                                        <Input name="email" type="email" placeholder="john@example.com" required className="bg-slate-950/50 border-slate-700 text-white h-9" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-300 text-xs">Phone</Label>
                                        <Input name="phone" placeholder="+1..." required className="bg-slate-950/50 border-slate-700 text-white h-9" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-300 text-xs">Address</Label>
                                        <Input name="address" placeholder="123 Main St" required className="bg-slate-950/50 border-slate-700 text-white h-9" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-300 text-xs">Postal Code</Label>
                                        <Input
                                            name="postal_code"
                                            defaultValue={postalCode}
                                            readOnly={selectedService?.category === 'Hardware'}
                                            className="bg-slate-950/50 border-slate-700 text-white h-9"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 pt-3 border-t border-white/10">
                                    <Label className="text-sm font-semibold text-white">Preferred Schedule</Label>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-slate-300 text-xs">Date</Label>
                                            <Input name="booking_date" type="date" required min={new Date().toISOString().split('T')[0]} className="bg-slate-950/50 border-slate-700 text-white h-9 scheme-dark" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-slate-300 text-xs">Time Slot</Label>
                                            <Select name="slot" required>
                                                <SelectTrigger className="bg-slate-950/50 border-slate-700 text-white h-9">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                                    <SelectItem value="Morning">Morning (9AM - 12PM)</SelectItem>
                                                    <SelectItem value="Afternoon">Afternoon (1PM - 5PM)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-slate-300 text-xs">Notes (Optional)</Label>
                                    <Textarea name="notes" placeholder="Details..." className="bg-slate-950/50 border-slate-700 text-white min-h-[60px]" />
                                </div>
                            </div>
                        )}

                        {/* STEP 3: CONFIRM */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="text-center mb-4">
                                    <h2 className="text-xl font-bold text-white">Confirm Booking</h2>
                                    <p className="text-sm text-slate-400">Review your details</p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-xl space-y-3 text-sm border border-white/10">
                                    <div className="flex justify-between border-b border-white/10 pb-2">
                                        <span className="text-slate-400">Service</span>
                                        <span className="font-bold text-white">{selectedService?.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/10 pb-2">
                                        <span className="text-slate-400">Price Estimate</span>
                                        <span className="font-bold text-white">{selectedService?.price_range}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/10 pb-2">
                                        <span className="text-slate-400">Location</span>
                                        <span className="font-medium text-white">{postalCode}</span>
                                    </div>
                                    <div className="text-xs text-slate-500 italic pt-1">
                                        * You will receive a confirmation email shortly.
                                    </div>
                                </div>

                                {formState.success === false && formState.message && (
                                    <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-xs border border-red-500/30">
                                        {formState.message}
                                    </div>
                                )}
                            </div>
                        )}


                        {/* NAVIGATION BUTTONS */}
                        <div className="flex justify-between pt-6 mt-4 border-t border-white/10">
                            {step > 1 ? (
                                <Button type="button" variant="ghost" onClick={prevStep} className="gap-2 text-slate-400 hover:text-white hover:bg-white/10">
                                    <ArrowLeft className="h-4 w-4" /> Back
                                </Button>
                            ) : (
                                <div></div>
                            )}

                            {step < 3 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                                    disabled={
                                        !selectedService ||
                                        (selectedService.category === 'Hardware' && !availability?.available)
                                    }
                                >
                                    Next <ArrowRight className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button type="submit" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]">
                                    Confirm
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </form>
        </div>
    )
}
