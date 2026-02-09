
'use client'

import { useState, useRef, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { manageImmigrationService } from '@/actions/immigration-admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { X, Plane, FileText, Stamp, MapPin, Save, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'

const initialState: any = {
    success: false,
    message: '',
    errors: {}
}

interface ImmigrationServiceFormProps {
    service?: any
    onClose: () => void
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
            ) : (
                <>
                    <Save className="mr-2 h-4 w-4" /> Save Service
                </>
            )}
        </Button>
    )
}

export function ImmigrationServiceForm({ service, onClose }: ImmigrationServiceFormProps) {
    const [state, formAction] = useActionState(manageImmigrationService, initialState)
    const formRef = useRef<HTMLFormElement>(null)

    // Icons map for selection
    const icons = [
        { name: 'Stamp', icon: Stamp },
        { name: 'MapPin', icon: MapPin },
        { name: 'Plane', icon: Plane },
        { name: 'FileText', icon: FileText },
    ]

    const [selectedIcon, setSelectedIcon] = useState(service?.icon_name || 'FileText')

    // Close on success
    if (state.success) {
        // Find a cleaner way in real app, but for now specific timeout or just close
        setTimeout(() => onClose(), 500)
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-all" onClick={onClose}>
            <div
                className="w-full max-w-md bg-background h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right-full duration-300"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold">{service ? 'Edit Service' : 'New Service'}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {state.message && (
                    <div className={`p-4 rounded-md mb-6 ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {state.message}
                    </div>
                )}

                <form ref={formRef} action={formAction} className="space-y-6">
                    <input type="hidden" name="id" value={service?.id || ''} />

                    <div className="space-y-2">
                        <Label>Service Title</Label>
                        <Input name="title" defaultValue={state.payload?.title || service?.title} placeholder="e.g. OCI Full Service" required />
                        {state.errors?.title && <p className="text-sm text-red-500">{state.errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Code (Unique)</Label>
                            <Input name="code" defaultValue={state.payload?.code || service?.code} placeholder="OCI_FULL" required disabled={!!service} />
                            {state.errors?.code && <p className="text-sm text-red-500">{state.errors.code}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Processing Time</Label>
                            <Input name="processing_time" defaultValue={state.payload?.processing_time || service?.processing_time} placeholder="4-6 Weeks" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Price</Label>
                            <Input name="price" type="number" step="0.01" defaultValue={state.payload?.price || service?.price} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Currency</Label>
                            <select name="currency" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={state.payload?.currency || service?.currency || 'USD'}>
                                <option value="USD">USD ($)</option>
                                <option value="CAD">CAD (C$)</option>
                                <option value="INR">INR (₹)</option>
                                <option value="AED">AED (د.إ)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea name="description" defaultValue={state.payload?.description || service?.description} rows={3} required />
                        {state.errors?.description && <p className="text-sm text-red-500">{state.errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Requirements (One per line)</Label>
                        <Textarea
                            name="requirements"
                            defaultValue={state.payload?.requirements || (Array.isArray(service?.requirements) ? service.requirements.join('\n') : service?.requirements)}
                            rows={5}
                            placeholder="Passport&#10;Photo&#10;Proof of Address"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Icon</Label>
                        <input type="hidden" name="icon_name" value={selectedIcon} />
                        <div className="flex gap-2">
                            {icons.map((item) => (
                                <button
                                    key={item.name}
                                    type="button"
                                    onClick={() => setSelectedIcon(item.name)}
                                    className={`p-3 rounded-md border transition-all ${selectedIcon === item.name ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20' : 'border-input hover:bg-muted'}`}
                                >
                                    <item.icon className="h-5 w-5" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    )
}
