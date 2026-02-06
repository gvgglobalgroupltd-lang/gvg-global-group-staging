'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle, ArrowRight, Globe, Users, BookOpen, MapPin, Briefcase, FileText, ShieldAlert, Timer } from 'lucide-react'
import { CandidateProfile, ProgramResult } from '@/lib/immigration/programs/types'
import { calculateAllStreams } from '@/lib/immigration/eligibilityEngineV2'
import { DocumentChecklists } from '@/lib/immigration/data/documentChecklists'
import { calculateCRS } from '@/lib/immigration/CRSEngine'
import { validateWorkExperience, ExperienceValidationResult } from '@/lib/immigration/compliance/workExperienceValidator'
import { analyzeStatusStrategy, StatusStrategyResult } from '@/lib/immigration/compliance/statusStrategy'
import { format } from 'date-fns'

const PROVINCES = [
    'Ontario', 'British Columbia', 'Alberta', 'Saskatchewan', 'Manitoba',
    'Nova Scotia', 'New Brunswick', 'PEI', 'Newfoundland', 'Quebec'
];

export function UnifiedEligibilityCalculator() {
    const [step, setStep] = useState(1)

    // --- STATE ---
    // 1. Personal & Edu
    const [age, setAge] = useState('29')
    const [marital, setMarital] = useState<'Single' | 'Married'>('Single')
    const [eduLevel, setEduLevel] = useState<CandidateProfile['educationLevel']>('Masters')
    const [fieldOfStudy, setFieldOfStudy] = useState<CandidateProfile['fieldOfStudy']>('STEM_Health_Trades')
    const [canEduProv, setCanEduProv] = useState<string>('Ontario')
    const [canEduCompleted, setCanEduCompleted] = useState(true)

    // 2. Language
    const [lSpeak, setLSpeak] = useState('9')
    const [lRead, setLRead] = useState('9')
    const [lWrite, setLWrite] = useState('9')
    const [lListen, setLListen] = useState('9')
    const [hasFrench, setHasFrench] = useState(false)
    const [fSpeak, setFSpeak] = useState('0')
    const [fRead, setFRead] = useState('0')
    const [fWrite, setFWrite] = useState('0')
    const [fListen, setFListen] = useState('0')

    // 3. Work & Compliance
    const [workCan, setWorkCan] = useState('1')
    const [workFor, setWorkFor] = useState('3')
    // Detailed Hours Check
    const [hrsPerWeek, setHrsPerWeek] = useState('40')
    const [weeksWorked, setWeeksWorked] = useState('52')
    const [isSeasonal, setIsSeasonal] = useState(false)
    const [isStudentWork, setIsStudentWork] = useState(false)
    const [isCoop, setIsCoop] = useState(false)

    // Job Offer
    const [jobOfferType, setJobOfferType] = useState<'None' | 'Teer0123' | 'Teer45'>('None')
    const [jobOfferProv, setJobOfferProv] = useState('None')
    const [jobOfferWage, setJobOfferWage] = useState('35')
    const [jobOfferNoc, setJobOfferNoc] = useState('Tech')

    // 4. Status & Legal
    const [expiryDate, setExpiryDate] = useState<string>(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]) // Default 1 yr future
    const [statusApplied, setStatusApplied] = useState(false)

    // 5. Connections
    const [relatives, setRelatives] = useState<string[]>([])
    const [friends, setFriends] = useState<string[]>([])
    const [pastStudy, setPastStudy] = useState<string[]>([])
    const [pastWork, setPastWork] = useState<string[]>([])
    const [intent, setIntent] = useState<string[]>(['Ontario', 'British Columbia'])

    // --- CALCULATION ---
    const compliance = useMemo(() => {
        return validateWorkExperience({
            hoursPerWeek: parseFloat(hrsPerWeek),
            weeksWorked: parseFloat(weeksWorked),
            isSeasonal,
            isStudent: isStudentWork,
            isSelfEmployed: false, // UI simplification
            isCoop,
            programTarget: 'CEC' // Default primary check
        })
    }, [hrsPerWeek, weeksWorked, isSeasonal, isStudentWork, isCoop])

    const statusStrategy = useMemo(() => {
        return analyzeStatusStrategy({
            expiryDate: new Date(expiryDate),
            hasSubmittedExtension: statusApplied,
            currentLocation: 'InsideCanada'
        })
    }, [expiryDate, statusApplied])

    const results = useMemo(() => {
        // Use compliance-adjusted years if less than claimed? 
        // For now using user inputs but displaying warnings.

        const crsProfile = {
            maritalStatus: marital,
            age: parseInt(age),
            education: eduLevel,
            canadianDegree: canEduCompleted ? (canEduProv !== 'None' ? 'OneTwoYear' : 'None') : 'None',
            language: { speaking: parseInt(lSpeak), reading: parseInt(lRead), writing: parseInt(lWrite), listening: parseInt(lListen) },
            secondLanguage: hasFrench ? { speaking: parseInt(fSpeak), reading: parseInt(fRead), writing: parseInt(fWrite), listening: parseInt(fListen) } : undefined,
            workGen: { canadian: parseInt(workCan), foreign: parseInt(workFor) },
            spouse: undefined,
            additional: { siblingInCanada: relatives.length > 0, jobOffer: jobOfferType === 'None' ? 'None' : 'NOC_0_1_2_3', nomination: false, tradeCertificate: false }
        }
        // @ts-ignore
        const crsResult = calculateCRS(crsProfile).total

        const p: CandidateProfile = {
            age: parseInt(age),
            maritalStatus: marital,
            educationLevel: eduLevel,
            fieldOfStudy,
            canadianEducation: { province: canEduProv === 'None' ? '' : canEduProv, level: 'Degree', completed: canEduCompleted },
            clbEnglish: { s: parseInt(lSpeak), r: parseInt(lRead), w: parseInt(lWrite), l: parseInt(lListen) },
            clbFrench: { s: parseInt(fSpeak), r: parseInt(fRead), w: parseInt(fWrite), l: parseInt(fListen) },
            workExperience: {
                canadian: parseInt(workCan),
                foreign: parseInt(workFor),
                province: canEduProv,
                currentJobOffer: jobOfferType,
                jobOfferProvince: jobOfferProv === 'None' ? '' : jobOfferProv,
                jobOfferWage: parseFloat(jobOfferWage),
                jobOfferNoc,
                workHistory: []
            },
            connections: {
                relativeInProvince: relatives,
                friendInProvince: friends,
                pastStudy,
                pastWork
            },
            intentProvinces: intent
        }

        return calculateAllStreams(p, crsResult)
    }, [age, marital, eduLevel, fieldOfStudy, canEduProv, canEduCompleted, lSpeak, lRead, lWrite, lListen, hasFrench, fSpeak, fRead, fWrite, fListen,
        workCan, workFor, jobOfferType, jobOfferProv, jobOfferWage, jobOfferNoc, relatives, friends, pastStudy, pastWork, intent])

    return (
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
            {/* LEFT: WIZARD */}
            <div className="lg:col-span-7">
                <Card className="p-6 bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
                    <div className="mb-6">
                        <div className="text-xs font-bold text-indigo-600 uppercase mb-1">Step {step} of 5</div>
                        <h2 className="text-2xl font-bold">
                            {step === 1 && 'Education & Personal'}
                            {step === 2 && 'Language Profile'}
                            {step === 3 && 'Work Experience Compliance'}
                            {step === 4 && 'Legal Status & Expiry'}
                            {step === 5 && 'Connections & Intent'}
                        </h2>
                    </div>

                    {step === 1 && (
                        <div className="space-y-5">
                            {/* Same as before */}
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Age</Label><Input type="number" value={age} onChange={e => setAge(e.target.value)} /></div>
                                <div>
                                    <Label>Education Level</Label>
                                    <Select value={eduLevel} onValueChange={(v: any) => setEduLevel(v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Masters">Masters</SelectItem>
                                            <SelectItem value="PhD">PhD</SelectItem>
                                            <SelectItem value="Bachelors">Bachelors</SelectItem>
                                            <SelectItem value="TwoYear">Diploma (2yr)</SelectItem>
                                            <SelectItem value="OneYear">Certificate (1yr)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Field of Study</Label>
                                <Select value={fieldOfStudy} onValueChange={(v: any) => setFieldOfStudy(v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="STEM_Health_Trades">STEM, Health, or Trades</SelectItem>
                                        <SelectItem value="Business_Admin">Business or Administration</SelectItem>
                                        <SelectItem value="Arts_Humanities">Arts, Humanities, Social Science</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Canadian Education?</Label>
                                    <Select value={canEduProv} onValueChange={setCanEduProv}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="None">None</SelectItem>
                                            {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center pt-8 space-x-2">
                                    <Checkbox checked={canEduCompleted} onCheckedChange={(c: any) => setCanEduCompleted(c)} />
                                    <Label>Completed?</Label>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5">
                            {/* Same as before */}
                            <Label>English (CLB)</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {['Speaking', 'Reading', 'Writing', 'Listening'].map((l, i) => (
                                    <div key={l}>
                                        <span className="text-xs text-slate-500">{l}</span>
                                        <Input type="number" max={10} min={1}
                                            value={[lSpeak, lRead, lWrite, lListen][i]}
                                            onChange={e => [setLSpeak, setLRead, setLWrite, setLListen][i](e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="flex items-center space-x-2"><Checkbox checked={hasFrench} onCheckedChange={(c: any) => setHasFrench(c)} /><Label>French?</Label></div>
                            {hasFrench && (
                                <div className="grid grid-cols-4 gap-2">
                                    {['Speaking', 'Reading', 'Writing', 'Listening'].map((l, i) => (
                                        <div key={l}>
                                            <span className="text-xs text-slate-500">{l}</span>
                                            <Input type="number" max={10} min={1}
                                                value={[fSpeak, fRead, fWrite, fListen][i]}
                                                onChange={e => [setFSpeak, setFRead, setFWrite, setFListen][i](e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            {/* Deep Dive Work */}
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Canadian Work (Yrs)</Label><Input type="number" value={workCan} onChange={e => setWorkCan(e.target.value)} /></div>
                                <div><Label>Foreign Work (Yrs)</Label><Input type="number" value={workFor} onChange={e => setWorkFor(e.target.value)} /></div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded border border-indigo-100 dark:border-indigo-900 space-y-4">
                                <Label className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-semibold">
                                    <ShieldAlert className="w-4 h-4" /> Compliance Check
                                </Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label className="text-xs">Avg Hours/Week</Label><Input value={hrsPerWeek} onChange={e => setHrsPerWeek(e.target.value)} /></div>
                                    <div><Label className="text-xs">Weeks Worked</Label><Input value={weeksWorked} onChange={e => setWeeksWorked(e.target.value)} /></div>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2"><Checkbox checked={isSeasonal} onCheckedChange={(c: any) => setIsSeasonal(c)} /><Label className="text-sm">Seasonal?</Label></div>
                                    <div className="flex items-center space-x-2"><Checkbox checked={isStudentWork} onCheckedChange={(c: any) => setIsStudentWork(c)} /><Label className="text-sm">Student Status?</Label></div>
                                    <div className="flex items-center space-x-2"><Checkbox checked={isCoop} onCheckedChange={(c: any) => setIsCoop(c)} /><Label className="text-sm">Co-op?</Label></div>
                                </div>
                                {compliance.warnings.length > 0 && (
                                    <Alert variant="destructive" className="mt-2 text-xs">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Compatibility Warning</AlertTitle>
                                        <AlertDescription>
                                            <ul className="list-disc pl-4 space-y-1">
                                                {compliance.warnings.map((w, i) => <li key={i}>{w}</li>)}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Job Offer */}
                            <div className="space-y-3 p-4 border rounded">
                                <Label className="font-semibold flex items-center gap-2"><Briefcase className="w-4 h-4" /> Current Job Offer</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs">Location</Label>
                                        <Select value={jobOfferProv} onValueChange={setJobOfferProv}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="None">No Job Offer</SelectItem>
                                                {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-xs">Level</Label>
                                        <Select value={jobOfferType} onValueChange={(v: any) => setJobOfferType(v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="None">None</SelectItem>
                                                <SelectItem value="Teer0123">Skilled (TEER 0/1/2/3)</SelectItem>
                                                <SelectItem value="Teer45">Semi-Skilled (TEER 4/5)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div><Label className="text-xs">Wage ($/hr)</Label><Input type="number" value={jobOfferWage} onChange={e => setJobOfferWage(e.target.value)} /></div>
                                    <div>
                                        <Label className="text-xs">Sector</Label>
                                        <Select value={jobOfferNoc} onValueChange={setJobOfferNoc}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Tech">Tech / IT</SelectItem>
                                                <SelectItem value="Health">Healthcare</SelectItem>
                                                <SelectItem value="Construction">Construction / Trades</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            {/* Status Check */}
                            <div className="space-y-4">
                                <Label>Work/Study Permit Expiry Date</Label>
                                <Input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />

                                <div className="flex items-center space-x-2 p-4 bg-slate-50 rounded border">
                                    <Checkbox checked={statusApplied} onCheckedChange={(c: any) => setStatusApplied(c)} />
                                    <div>
                                        <Label className="font-semibold">Have you applied for an extension?</Label>
                                        <p className="text-xs text-slate-500">Check this if you submitted an application BEFORE the expiry date.</p>
                                    </div>
                                </div>

                                {/* Status Result */}
                                <Alert className={`${statusStrategy.urgentActionRequired ? 'border-red-500 bg-red-50' : 'border-emerald-500 bg-emerald-50'}`}>
                                    <Timer className="h-4 w-4" />
                                    <AlertTitle>
                                        {statusStrategy.statusState === 'Valid' && 'Status Valid'}
                                        {statusStrategy.statusState === 'Maintained' && 'Maintained Status (Implied)'}
                                        {statusStrategy.statusState === 'RestorationPeriod' && 'CRITICAL: Restoration Period'}
                                        {statusStrategy.statusState === 'OutOfStatus' && 'OUT OF STATUS'}
                                    </AlertTitle>
                                    <AlertDescription className="text-xs mt-2 space-y-2">
                                        <p>{statusStrategy.daysRemaining > 0 ? `${statusStrategy.daysRemaining} Days Remaining` : ''}</p>
                                        <ul className="list-disc pl-4">
                                            {statusStrategy.actionPlan.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                        {statusStrategy.legalNuances.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-slate-200">
                                                <strong className="text-indigo-700">Strategic Tips:</strong>
                                                <ul className="list-disc pl-4 text-slate-700">
                                                    {statusStrategy.legalNuances.map((s, i) => <li key={i}>{s}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <CheckBoxGroup label="Relatives in Canada?" options={PROVINCES} selected={relatives} onChange={setRelatives} />
                                <CheckBoxGroup label="Friends in Canada?" options={PROVINCES} selected={friends} onChange={setFriends} />
                                <CheckBoxGroup label="Past Study in Canada?" options={PROVINCES} selected={pastStudy} onChange={setPastStudy} />
                                <CheckBoxGroup label="Past Work in Canada?" options={PROVINCES} selected={pastWork} onChange={setPastWork} />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-8">
                        <Button disabled={step === 1} variant="ghost" onClick={() => setStep(s => s - 1)}>Back</Button>
                        {step < 5 && <Button onClick={() => setStep(s => s + 1)}>Next</Button>}
                    </div>
                </Card>
            </div>

            {/* RIGHT: RESULTS */}
            <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">Analysis Results</h3>
                    <Badge variant="outline">{results.filter(r => r.eligible).length} pathways</Badge>
                </div>

                <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-3">
                        {results.map((r, i) => (
                            <ResultCard key={i} result={r} />
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}

function CheckBoxGroup({ label, options, selected, onChange }: any) {
    return (
        <div className="space-y-2">
            {/* Same as previous */}
            <Label className="font-semibold">{label}</Label>
            <ScrollArea className="h-32 border rounded p-2">
                {options.map((opt: string) => (
                    <div key={opt} className="flex items-center space-x-2 mb-2">
                        <Checkbox
                            id={`${label}-${opt}`}
                            checked={selected.includes(opt)}
                            onCheckedChange={() => {
                                if (selected.includes(opt)) onChange(selected.filter((s: string) => s !== opt))
                                else onChange([...selected, opt])
                            }}
                        />
                        <Label htmlFor={`${label}-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
                    </div>
                ))}
            </ScrollArea>
        </div>
    )
}

function ResultCard({ result }: { result: ProgramResult }) {
    const isHigh = result.drawProbability === 'High';
    const isMed = result.drawProbability === 'Medium';

    return (
        <Card className={`p-4 border-l-4 ${isHigh ? 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : isMed ? 'border-l-amber-500' : 'border-l-slate-300 opacity-80'}`}>
            {/* Same as previous */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{result.stream}</h4>
                    <p className="text-xs text-slate-500">{result.province}</p>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold">{result.score}{result.maxScore > 0 && <span className="text-xs text-slate-400 font-normal">/{result.maxScore}</span>}</div>
                    <Badge className={`${isHigh ? 'bg-emerald-100 text-emerald-800' : isMed ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'} border-0`}>
                        {result.drawProbability} Chance
                    </Badge>
                </div>
            </div>

            {result.warnings.length > 0 && (
                <div className="mb-3 space-y-1">
                    {result.warnings.map((w, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs text-amber-600">
                            <AlertCircle className="w-3 h-3" /> {w}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-indigo-600 hover:text-indigo-700 p-0 hover:bg-transparent">
                            <FileText className="w-3 h-3 mr-1" /> View Required Documents
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Required Documents</DialogTitle>
                            <DialogDescription>Checklist for {result.stream}</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-64 mt-4">
                            <ul className="space-y-3">
                                {result.checklist.map(key => {
                                    const doc = DocumentChecklists[key];
                                    if (!doc) return <li key={key} className="text-sm text-slate-500">{key}</li>
                                    return (
                                        <li key={key} className="space-y-1">
                                            <p className="text-sm font-semibold">{doc.title}</p>
                                            <ul className="list-disc list-inside text-xs text-slate-600 pl-2">
                                                {doc.items.map((item, idx) => <li key={idx}>{item}</li>)}
                                            </ul>
                                        </li>
                                    )
                                })}
                            </ul>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>

                {isHigh && <Button size="sm" className="h-7 text-xs bg-indigo-600">Start Application</Button>}
            </div>
        </Card>
    )
}
