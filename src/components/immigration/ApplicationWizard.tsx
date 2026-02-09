'use client'

import { useState, useActionState, useRef } from 'react'
import { submitVisaApplication } from '@/actions/immigration'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Upload, Loader2, ArrowRight, ArrowLeft, CreditCard, FileText, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useFormStatus } from 'react-dom'

interface WizardProps {
    service: any
    user?: any
}

const initialState = {
    success: false,
    message: '',
    applicationId: undefined
}

export function ApplicationWizard({ service, user }: WizardProps) {
    const [step, setStep] = useState(1)
    const [uploadedFiles, setUploadedFiles] = useState<{ name: string, path: string }[]>([])
    const [uploading, setUploading] = useState<string | null>(null)
    const [state, formAction] = useActionState(submitVisaApplication, initialState)
    const formRef = useRef<HTMLFormElement>(null)

    const requirements = Array.isArray(service.requirements) ? service.requirements : []

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, reqName: string) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setUploading(reqName)
            const supabase = createClient()
            const fileExt = file.name.split('.').pop()
            const fileName = `${service.code}/${Date.now()}_${reqName.replace(/\s+/g, '_')}.${fileExt}`

            const { error } = await supabase.storage
                .from('immigration_docs')
                .upload(fileName, file)

            if (error) {
                console.error('Upload error', error)
                alert('Upload failed: ' + error.message)
                return
            }

            setUploadedFiles(prev => [...prev.filter(f => f.name !== reqName), { name: reqName, path: fileName }])
        } catch (error) {
            console.error('Upload Error', error)
            alert('Failed to upload file')
        } finally {
            setUploading(null)
        }
    }

    if (state.success) {
        return (
            <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Application Received!</h2>
                <p className="text-slate-600 max-w-md mx-auto">
                    Your application for <strong>{service.title}</strong> has been submitted successfully to our team.
                </p>
                <div className="p-4 bg-slate-100 rounded-lg max-w-sm mx-auto mt-6">
                    <p className="text-xs text-slate-500 uppercase font-bold">Reference ID</p>
                    <p className="font-mono text-lg font-bold">{state.applicationId || 'PENDING'}</p>
                </div>
                <Button onClick={() => window.location.href = '/immigration/dashboard'} className="mt-8">
                    View My Applications
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 transform -translate-y-1/2"></div>
                {[1, 2, 3].map((s) => (
                    <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-slate-200 text-slate-500'}`}>
                        {s}
                    </div>
                ))}
            </div>

            <form ref={formRef} action={formAction}>
                <input type="hidden" name="visa_type" value={service.code} />
                <input type="hidden" name="documents" value={JSON.stringify(uploadedFiles)} />
                {/* Basic hidden metadata */}
                <input type="hidden" name="application_data" value={JSON.stringify({
                    serviceTitle: service.title,
                    price: service.price,
                    currency: service.currency
                })} />

                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold">Contact Details</h2>
                            <p className="text-slate-500">We&apos;ll use this to contact you about your application.</p>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input defaultValue={user?.user_metadata?.full_name} placeholder="Legal Name as on Passport" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input defaultValue={user?.email} placeholder="email@example.com" type="email" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input placeholder="+1 (555) 000-0000" type="tel" required />
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <Button type="button" onClick={() => setStep(2)}>
                                Next Step <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold">Upload Documents</h2>
                            <p className="text-slate-500">Securely upload the required documents.</p>
                        </div>

                        <div className="space-y-4">
                            {requirements.map((req: string, idx: number) => {
                                const isUploaded = uploadedFiles.some(f => f.name === req)
                                const isUploading = uploading === req

                                return (
                                    <div key={idx} className={`p-4 border rounded-lg transition-all ${isUploaded ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${isUploaded ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                                    {isUploaded ? <CheckCircle2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                                </div>
                                                <span className={`font-medium ${isUploaded ? 'text-green-800' : 'text-slate-700'}`}>{req}</span>
                                            </div>
                                            {isUploaded && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">UPLOADED</span>}
                                        </div>

                                        {!isUploaded && (
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleFileUpload(e, req)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    disabled={!!uploading}
                                                />
                                                <Button type="button" variant="outline" className="w-full" disabled={!!uploading}>
                                                    {isUploading ? (
                                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                                                    ) : (
                                                        <><Upload className="mr-2 h-4 w-4" /> Select File</>
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex items-center justify-between pt-6">
                            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setStep(3)}
                                disabled={uploadedFiles.length < 1} // Enforce at least 1 upload
                            >
                                Next Step <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                        {uploadedFiles.length < 1 && (
                            <p className="text-xs text-center text-amber-600">Please upload at least one document to proceed.</p>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold">Payment & Submit</h2>
                            <p className="text-slate-500">Finalize your application.</p>
                        </div>

                        <Card className="p-6 bg-slate-50 border-indigo-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-500 uppercase">Amount Due</p>
                                    <p className="text-3xl font-bold text-slate-900">
                                        {service.currency === 'USD' ? '$' : service.currency} {service.price}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded border border-slate-200 space-y-3">
                                <p className="font-medium text-slate-700">Payment Instructions:</p>
                                <p className="text-sm text-slate-600">
                                    Please send an Interac e-Transfer to:
                                </p>
                                <div className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-200">
                                    <code className="text-indigo-600 font-bold select-all">vipin.gehlot1505@gmail.com</code>
                                </div>
                                <p className="text-xs text-slate-500">
                                    *Please include your name in the transfer message.
                                </p>
                            </div>
                        </Card>

                        <div className="space-y-4">
                            <Label>Payment Reference / Sender Name</Label>
                            <Input name="payment_reference" placeholder="e.g. John Doe - Ref #12345" required />
                            <p className="text-xs text-slate-500">Enter the name used for the transfer or the reference number.</p>
                        </div>

                        <div className="flex items-center justify-between pt-6">
                            <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                            <SubmitButton />
                        </div>
                        <div className="flex justify-center mt-4">
                            <span className="flex items-center text-xs text-slate-400">
                                <Lock className="h-3 w-3 mr-1" /> Secure SSL Connection
                            </span>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full md:w-auto min-w-[150px]">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
            ) : (
                <>
                    Submit Application <CheckCircle2 className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    )
}
