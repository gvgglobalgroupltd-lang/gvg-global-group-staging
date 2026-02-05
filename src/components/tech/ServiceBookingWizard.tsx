
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
        <Card className="max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-900 shadow-xl border-slate-200 dark:border-slate-800">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -z-0"></div>
                {[1, 2, 3].map((s) => (
                    <div key={s} className={cn(
                        "relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300",
                        step >= s ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    )}>
                        {s}
                    </div>
                ))}
            </div>

            <form action={formAction}>
                {/* SUCCESS STATE */}
                {formState.success ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Booking Confirmed!</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            {formState.message}
                        </p>
                        <Button
                            className="mt-8"
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
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Select a Service</h2>
                                    <p className="text-slate-500">Choose the service you need assistance with</p>
                                </div>

                                {loadingServices ? (
                                    <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {services.map(service => (
                                            <div
                                                key={service.id}
                                                className={cn(
                                                    "cursor-pointer p-6 rounded-xl border-2 transition-all hover:border-indigo-300 dark:hover:border-indigo-700",
                                                    selectedServiceId === service.id
                                                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10"
                                                        : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950"
                                                )}
                                                onClick={() => handleServiceSelect(service.id)}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-slate-900 dark:text-white">{service.name}</h3>
                                                    <span className={cn(
                                                        "text-xs px-2 py-1 rounded-full font-medium",
                                                        service.category === 'Hardware' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                                    )}>
                                                        {service.category}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-3">{service.description}</p>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{service.price_range}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <input type="hidden" name="service_id" value={selectedServiceId} />

                                {/* Geofencing Check for Hardware */}
                                {selectedService?.category === 'Hardware' && (
                                    <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-xl border border-amber-100 dark:border-amber-900/30 animate-in fade-in slide-in-from-top-4">
                                        <h4 className="font-bold flex items-center gap-2 text-amber-800 dark:text-amber-400 mb-4">
                                            <MapPin className="h-5 w-5" /> Location Check Required
                                        </h4>
                                        <div className="flex gap-3">
                                            <Input
                                                placeholder="Enter Postal Code (e.g., B3J 2K9)"
                                                value={postalCode}
                                                onChange={(e) => {
                                                    setPostalCode(e.target.value)
                                                    setAvailability(null) // Reset checks on change
                                                }}
                                                className="bg-white dark:bg-slate-900"
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleCheckAvailability}
                                                disabled={!postalCode || checkingAvailability}
                                            >
                                                {checkingAvailability ? "Checking..." : "Verify"}
                                            </Button>
                                        </div>

                                        {availability && (
                                            <div className={cn(
                                                "mt-4 p-3 rounded-lg text-sm font-medium flex items-start gap-2",
                                                availability.available
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                            )}>
                                                {availability.available ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                                                {availability.message}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 2: DETAILS */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Booking Details</h2>
                                    <p className="text-slate-500">Please provide your contact and location information</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input name="customer_name" placeholder="John Doe" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input name="email" type="email" placeholder="john@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input name="phone" placeholder="+1 (555) 000-0000" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Address</Label>
                                        <Input name="address" placeholder="123 Main St, Apt 4B" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Postal Code</Label>
                                        <Input
                                            name="postal_code"
                                            defaultValue={postalCode}
                                            placeholder="B3K ..."
                                            readOnly={selectedService?.category === 'Hardware'}
                                            className={selectedService?.category === 'Hardware' ? "bg-slate-100 cursor-not-allowed" : ""}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <Label className="text-base font-semibold">Preferred Schedule</Label>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Date</Label>
                                            <Input name="booking_date" type="date" required min={new Date().toISOString().split('T')[0]} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2"><Clock className="h-4 w-4" /> Time Slot</Label>
                                            <Select name="slot" required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select slot" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Morning">Morning (9AM - 12PM)</SelectItem>
                                                    <SelectItem value="Afternoon">Afternoon (1PM - 5PM)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Additional Notes (Optional)</Label>
                                    <Textarea name="notes" placeholder="Describe the issue or device details..." />
                                </div>
                            </div>
                        )}

                        {/* STEP 3: CONFIRM */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review & Confirm</h2>
                                    <p className="text-slate-500">Please review your booking details before submitting</p>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl space-y-4">
                                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                                        <span className="text-slate-500">Service</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{selectedService?.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                                        <span className="text-slate-500">Price Estimate</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{selectedService?.price_range}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                                        <span className="text-slate-500">Location</span>
                                        <span className="font-medium text-slate-900 dark:text-white">{postalCode}</span>
                                    </div>
                                    <div className="text-sm text-slate-500 italic pt-2">
                                        * You will receive a confirmation email with preparation instructions shortly.
                                    </div>
                                </div>

                                {formState.success === false && formState.message && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                                        {formState.message}
                                    </div>
                                )}
                            </div>
                        )}


                        {/* NAVIGATION BUTTONS */}
                        <div className="flex justify-between pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
                            {step > 1 ? (
                                <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
                                    <ArrowLeft className="h-4 w-4" /> Back
                                </Button>
                            ) : (
                                <div></div> // Spacer
                            )}

                            {step < 3 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                                    disabled={
                                        !selectedService ||
                                        (selectedService.category === 'Hardware' && !availability?.available)
                                    }
                                >
                                    Next Step <ArrowRight className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button type="submit" className="gap-2 bg-indigo-600 hover:bg-indigo-700 min-w-[140px]">
                                    Confirm Booking
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </form>
        </Card>
    )
}
