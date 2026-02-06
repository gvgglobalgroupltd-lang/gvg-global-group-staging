'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, AlertCircle, ArrowRight, Globe, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { calculateEligibility, UserProfile } from '@/lib/immigration/eligibilityEngine'
import { DocumentChecklistModal } from './DocumentChecklistModal'

// --- CONSTANTS ---
const PROVINCES = [
    'Ontario', 'British Columbia', 'Alberta', 'Saskatchewan', 'Manitoba',
    'Nova Scotia', 'New Brunswick', 'Newfoundland', 'PEI', 'Quebec', 'Yukon/Territories', 'None'
]

const OCCUPATION_SECTORS = [
    'Tech / IT', 'Healthcare', 'Trades', 'Agriculture', 'Transport', 'Finance', 'Other'
]

export function UnifiedEligibilityCalculator() {
    const [step, setStep] = useState(1)

    // --- STATE ---
    // 1. Personal
    const [age, setAge] = useState<string>('29')

    // 2. Education
    const [education, setEducation] = useState<UserProfile['education']>('Masters')

    // 3. Language
    const [clbEnglish, setClbEnglish] = useState('9')
    const [clbFrench, setClbFrench] = useState('0') // 0 = None

    // 4. Work
    const [workExpCanada, setWorkExpCanada] = useState('0')
    const [workExpForeign, setWorkExpForeign] = useState('3')
    const [sector, setSector] = useState('Tech / IT')

    // 5. Job Offer & Connections
    const [jobOfferDest, setJobOfferDest] = useState('None')
    const [connections, setConnections] = useState<string[]>([]) // Family
    const [connectionsFriend, setConnectionsFriend] = useState<string[]>([]) // Friends

    const toggleConnection = (prov: string, type: 'Family' | 'Friend') => {
        if (type === 'Family') {
            setConnections(prev => prev.includes(prov) ? prev.filter(p => p !== prov) : [...prev, prov])
        } else {
            setConnectionsFriend(prev => prev.includes(prov) ? prev.filter(p => p !== prov) : [...prev, prov])
        }
    }

    // --- LOGIC ENGINE INTEGRATION ---
    const results = useMemo(() => {
        const profile: UserProfile = {
            age: parseInt(age),
            education,
            clbEnglish: parseInt(clbEnglish),
            clbFrench: parseInt(clbFrench),
            workExpCanada: parseInt(workExpCanada),
            workExpForeign: parseInt(workExpForeign),
            sector,
            jobOfferDest,
            connections,
            connectionsFriend
        }
        return calculateEligibility(profile)
    }, [age, education, clbEnglish, clbFrench, workExpCanada, workExpForeign, sector, jobOfferDest, connections, connectionsFriend])


    // --- RENDER HELPERS ---
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Age</Label>
                                <Select value={age} onValueChange={setAge}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 30 }, (_, i) => i + 18).map(a => (
                                            <SelectItem key={a} value={a.toString()}>{a}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Education Level</Label>
                                <Select value={education} onValueChange={(v) => setEducation(v as any)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High School">High School</SelectItem>
                                        <SelectItem value="Diploma">Diploma (2 Years)</SelectItem>
                                        <SelectItem value="Bachelors">Bachelors Degree</SelectItem>
                                        <SelectItem value="Masters">Masters Degree</SelectItem>
                                        <SelectItem value="PhD">PhD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>English Level (CLB)</Label>
                                <Select value={clbEnglish} onValueChange={setClbEnglish}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">CLB 10 (Advanced)</SelectItem>
                                        <SelectItem value="9">CLB 9 (Proficient)</SelectItem>
                                        <SelectItem value="7">CLB 7 (Intermediate)</SelectItem>
                                        <SelectItem value="5">CLB 5 (Basic)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>French Level (CLB)</Label>
                                <Select value={clbFrench} onValueChange={setClbFrench}>
                                    <SelectTrigger className="border-indigo-200 bg-indigo-50/50"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">None / Basic</SelectItem>
                                        <SelectItem value="5">CLB 5 (Intermediate)</SelectItem>
                                        <SelectItem value="7">CLB 7+ (Advanced)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-slate-500">Crucial for Quebec & NB.</p>
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Occupation Sector</Label>
                                <Select value={sector} onValueChange={setSector}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {OCCUPATION_SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Work Experience (Foreign Years)</Label>
                                <Select value={workExpForeign} onValueChange={setWorkExpForeign}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">None</SelectItem>
                                        <SelectItem value="1">1 Year</SelectItem>
                                        <SelectItem value="2">2 Years</SelectItem>
                                        <SelectItem value="3">3+ Years</SelectItem>
                                        <SelectItem value="5">5+ Years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Work Experience (Canadian Years)</Label>
                                <Select value={workExpCanada} onValueChange={setWorkExpCanada}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">None</SelectItem>
                                        <SelectItem value="1">1 Year</SelectItem>
                                        <SelectItem value="2">2+ Years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Do you have a valid Job Offer in Canada?</Label>
                                <Select value={jobOfferDest} onValueChange={setJobOfferDest}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="None">No Job Offer</SelectItem>
                                        {PROVINCES.filter(p => p !== 'None').map(p => (
                                            <SelectItem key={p} value={p}>Yes, in {p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Label>Connections (Family in Province)</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {['Ontario', 'Manitoba', 'Saskatchewan', 'Alberta', 'New Brunswick', 'Nova Scotia'].map(prov => (
                                        <div key={prov}
                                            onClick={() => toggleConnection(prov, 'Family')}
                                            className={`
                                                cursor-pointer border rounded-md p-3 text-sm flex items-center gap-2 transition-all
                                                ${connections.includes(prov) ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}
                                            `}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${connections.includes(prov) ? 'border-indigo-500 bg-indigo-500' : 'border-slate-400'}`}>
                                                {connections.includes(prov) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                            </div>
                                            {prov}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Label>Connections (Friends)</Label>
                                    <Badge variant="outline" className="text-[10px] h-5">Manitoba Only</Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {['Manitoba'].map(prov => (
                                        <div key={prov}
                                            onClick={() => toggleConnection(prov, 'Friend')}
                                            className={`
                                                cursor-pointer border rounded-md p-3 text-sm flex items-center gap-2 transition-all
                                                ${connectionsFriend.includes(prov) ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}
                                            `}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${connectionsFriend.includes(prov) ? 'border-emerald-500 bg-emerald-500' : 'border-slate-400'}`}>
                                                <Users className="w-3 h-3 text-white" />
                                            </div>
                                            Friend in {prov}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            default: return null
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8">
                {/* WIZARD LEFT - 7 Cols */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        {/* Progress */}
                        <div className="flex items-center gap-4 mb-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`flex items-center gap-2 ${step >= i ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= i ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200'}`}>
                                        {i}
                                    </div>
                                    <span className="hidden sm:inline text-sm font-medium">
                                        {i === 1 ? 'Profile' : i === 2 ? 'Experience' : 'Connections'}
                                    </span>
                                    {i < 3 && <div className="w-8 h-px bg-slate-200 mx-2" />}
                                </div>
                            ))}
                        </div>

                        {renderStep()}

                        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <Button variant="ghost" disabled={step === 1} onClick={() => setStep(s => s - 1)}>
                                Back
                            </Button>
                            {step < 3 ? (
                                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setStep(s => s + 1)}>
                                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { }}>
                                    See Results (Live)
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>

                {/* RESULTS RIGHT - 5 Cols */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-5 h-5 text-indigo-500" />
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Immigration Pathway Analysis</h3>
                        </div>

                        <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
                            {results.map((res, idx) => (
                                <Card key={idx} className={`p-4 border-l-4 ${res.probability === 'High' ? 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' :
                                    res.probability === 'Medium' ? 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10' :
                                        'border-l-slate-300 bg-slate-50 dark:bg-slate-900 grayscale opacity-80'
                                    }`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{res.program}</h4>
                                        <Badge variant={res.probability === 'High' ? 'default' : res.probability === 'Medium' ? 'secondary' : 'outline'} className={
                                            res.probability === 'High' ? 'bg-emerald-500 hover:bg-emerald-600 text-[10px]' :
                                                res.probability === 'Medium' ? 'bg-amber-500 hover:bg-amber-600 text-white text-[10px]' : 'text-[10px]'
                                        }>
                                            {res.probability}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                                        {res.score !== undefined && (
                                            <span className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                                Score: {res.score} {res.passScore ? `/ ${res.passScore} (Pass)` : ''}
                                            </span>
                                        )}
                                        {res.reason}
                                    </p>

                                    {/* DOCUMENT CHECKLIST BUTTON */}
                                    {res.eligible && <DocumentChecklistModal checklistId={res.checklistId} programName={res.program} />}
                                </Card>
                            ))}
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800 mt-6">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                                <div className="text-xs text-indigo-800 dark:text-indigo-300">
                                    <strong>Pro Tip:</strong> Eligibility rules change frequently. This tool uses general 2024/2025 guidelines for estimation.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
