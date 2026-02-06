'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { CheckCircle2, AlertCircle, ArrowRight, Globe, Users, BookOpen, MapPin, Briefcase, FileText, ShieldAlert, Timer, Gavel, Scale, GraduationCap, ChevronRight, ChevronLeft, Lock } from 'lucide-react'
import { CandidateProfile, ProgramResult } from '@/lib/immigration/programs/types'
import { calculateAllStreams } from '@/lib/immigration/eligibilityEngineV2'
import { DocumentChecklists } from '@/lib/immigration/data/documentChecklists'
import { calculateCRS } from '@/lib/immigration/CRSEngine'
import { validateWorkExperience } from '@/lib/immigration/compliance/workExperienceValidator'
import { analyzeStatusStrategy } from '@/lib/immigration/compliance/statusStrategy'
import { analyzeLegalDefense } from '@/lib/immigration/legal/legalDefenseEngine'
import { format } from 'date-fns'

const PROVINCES = [
    'Ontario', 'British Columbia', 'Alberta', 'Saskatchewan', 'Manitoba',
    'Nova Scotia', 'New Brunswick', 'PEI', 'Newfoundland', 'Quebec'
];

const STEPS = [
    { title: 'Profile', icon: Users },
    { title: 'Language', icon: Globe },
    { title: 'Work', icon: Briefcase },
    { title: 'Status', icon: Timer },
    { title: 'Legal', icon: Scale },
    { title: 'Intent', icon: MapPin },
]

export function UnifiedEligibilityCalculator() {
    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(0)

    // --- STATE (Identical logic to previous version) ---
    const [age, setAge] = useState('29')
    const [marital, setMarital] = useState<'Single' | 'Married'>('Single')
    const [eduLevel, setEduLevel] = useState<CandidateProfile['educationLevel']>('Masters')
    const [fieldOfStudy, setFieldOfStudy] = useState<CandidateProfile['fieldOfStudy']>('STEM_Health_Trades')
    const [canEduProv, setCanEduProv] = useState<string>('Ontario')
    const [canEduCompleted, setCanEduCompleted] = useState(true)

    const [lSpeak, setLSpeak] = useState('9')
    const [lRead, setLRead] = useState('9')
    const [lWrite, setLWrite] = useState('9')
    const [lListen, setLListen] = useState('9')
    const [hasFrench, setHasFrench] = useState(false)
    const [fSpeak, setFSpeak] = useState('0')
    const [fRead, setFRead] = useState('0')
    const [fWrite, setFWrite] = useState('0')
    const [fListen, setFListen] = useState('0')

    const [workCan, setWorkCan] = useState('1')
    const [workFor, setWorkFor] = useState('3')
    const [hrsPerWeek, setHrsPerWeek] = useState('40')
    const [weeksWorked, setWeeksWorked] = useState('52')
    const [isSeasonal, setIsSeasonal] = useState(false)
    const [isStudentWork, setIsStudentWork] = useState(false)
    const [isCoop, setIsCoop] = useState(false)

    const [jobOfferType, setJobOfferType] = useState<'None' | 'Teer0123' | 'Teer45'>('None')
    const [jobOfferProv, setJobOfferProv] = useState('None')
    const [jobOfferWage, setJobOfferWage] = useState('35')
    const [jobOfferNoc, setJobOfferNoc] = useState('Tech')

    const [expiryDate, setExpiryDate] = useState<string>(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0])
    const [statusApplied, setStatusApplied] = useState(false)

    const [hasCriminal, setHasCriminal] = useState(false)
    const [isSeriousCrime, setIsSeriousCrime] = useState(false)
    const [sentenceDate, setSentenceDate] = useState<string>('')
    const [hasMedical, setHasMedical] = useState(false)
    const [medicalCost, setMedicalCost] = useState('0')
    const [hasRefusal, setHasRefusal] = useState(false)
    const [refusalReason, setRefusalReason] = useState<'Misrepresentation' | 'ReferenceLetter' | 'Funds' | 'Other'>('Other')

    const [relatives, setRelatives] = useState<string[]>([])
    const [friends, setFriends] = useState<string[]>([])
    const [pastStudy, setPastStudy] = useState<string[]>([])
    const [pastWork, setPastWork] = useState<string[]>([])
    const [intent, setIntent] = useState<string[]>(['Ontario', 'British Columbia'])

    // --- HOOKS ---
    const compliance = useMemo(() => validateWorkExperience({
        hoursPerWeek: parseFloat(hrsPerWeek || '0'),
        weeksWorked: parseFloat(weeksWorked || '0'),
        isSeasonal, isStudent: isStudentWork, isSelfEmployed: false, isCoop, programTarget: 'CEC'
    }), [hrsPerWeek, weeksWorked, isSeasonal, isStudentWork, isCoop])

    const statusStrategy = useMemo(() => analyzeStatusStrategy({
        expiryDate: new Date(expiryDate),
        hasSubmittedExtension: statusApplied,
        currentLocation: 'InsideCanada'
    }), [expiryDate, statusApplied])

    const legalDefense = useMemo(() => analyzeLegalDefense({
        hasCriminalRecord: hasCriminal,
        offenseMaxSentenceInCanada: isSeriousCrime ? 10 : 5,
        sentenceCompletedDate: sentenceDate ? new Date(sentenceDate) : undefined,
        hasMedicalCondition: hasMedical,
        annualTreatmentCost: parseFloat(medicalCost || '0'),
        hasRefusalHistory: hasRefusal,
        refusalReason: hasRefusal ? refusalReason : undefined,
        isFlagpolingConsidered: false
    }), [hasCriminal, isSeriousCrime, sentenceDate, hasMedical, medicalCost, hasRefusal, refusalReason])

    const results = useMemo(() => {
        const crsProfile = {
            maritalStatus: marital,
            age: parseInt(age || '0'),
            education: eduLevel,
            canadianDegree: canEduCompleted ? (canEduProv !== 'None' ? 'OneTwoYear' : 'None') : 'None',
            language: { speaking: parseInt(lSpeak), reading: parseInt(lRead), writing: parseInt(lWrite), listening: parseInt(lListen) },
            secondLanguage: hasFrench ? { speaking: parseInt(fSpeak), reading: parseInt(fRead), writing: parseInt(fWrite), listening: parseInt(fListen) } : undefined,
            workGen: { canadian: parseInt(workCan || '0'), foreign: parseInt(workFor || '0') },
            spouse: undefined,
            additional: { siblingInCanada: relatives.length > 0, jobOffer: jobOfferType === 'None' ? 'None' : 'NOC_0_1_2_3' }
        }
        // @ts-ignore
        const crsResult = calculateCRS(crsProfile).total

        const p: CandidateProfile = {
            age: parseInt(age || '0'),
            maritalStatus: marital,
            educationLevel: eduLevel,
            fieldOfStudy,
            canadianEducation: { province: canEduProv === 'None' ? '' : canEduProv, level: 'Degree', completed: canEduCompleted },
            clbEnglish: { s: parseInt(lSpeak), r: parseInt(lRead), w: parseInt(lWrite), l: parseInt(lListen) },
            clbFrench: { s: parseInt(fSpeak), r: parseInt(fRead), w: parseInt(fWrite), l: parseInt(fListen) },
            workExperience: {
                canadian: parseInt(workCan || '0'), foreign: parseInt(workFor || '0'), province: canEduProv,
                currentJobOffer: jobOfferType, jobOfferProvince: jobOfferProv === 'None' ? '' : jobOfferProv,
                jobOfferWage: parseFloat(jobOfferWage || '0'), jobOfferNoc, workHistory: []
            },
            connections: { relativeInProvince: relatives, friendInProvince: friends, pastStudy, pastWork },
            intentProvinces: intent
        }
        return calculateAllStreams(p, crsResult)
    }, [age, marital, eduLevel, fieldOfStudy, canEduProv, canEduCompleted, lSpeak, lRead, lWrite, lListen, hasFrench, fSpeak, fRead, fWrite, fListen,
        workCan, workFor, jobOfferType, jobOfferProv, jobOfferWage, jobOfferNoc, relatives, friends, pastStudy, pastWork, intent])

    const nextStep = () => { if (step < STEPS.length) { setDirection(1); setStep(s => s + 1) } }
    const prevStep = () => { if (step > 1) { setDirection(-1); setStep(s => s - 1) } }

    const variants = {
        enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
    }

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 p-4">
            {/* HEADER */}
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    Immigration <span className="text-indigo-600">Master Tool</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Advanced Eligibility, Compliance Validation, and Legal Strategy Engine.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">

                {/* LEFT COLUMN: WIZARD */}
                <div className="lg:col-span-7">
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                        {/* PROGRESS BAR */}
                        <div className="bg-slate-50 dark:bg-slate-950 p-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between relative">
                                {/* Connector Line */}
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />
                                {STEPS.map((s, i) => {
                                    const isActive = step === i + 1;
                                    const isCompleted = step > i + 1;
                                    return (
                                        <div key={i} className="flex flex-col items-center gap-1 bg-slate-50 dark:bg-slate-950 px-2 z-10 transition-colors duration-300">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white scale-110 shadow-lg ring-4 ring-indigo-100 dark:ring-indigo-900' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'}`}>
                                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : (s.icon ? <s.icon className="w-4 h-4" /> : i + 1)}
                                            </div>
                                            <span className={`text-[10px] font-medium uppercase tracking-wide ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>{s.title}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="p-6 md:p-8 min-h-[500px] flex flex-col">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={step}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    className="flex-1"
                                >
                                    {/* CONTENT RENDERER */}
                                    {renderStepContent(step)}
                                </motion.div>
                            </AnimatePresence>

                            {/* FOOTER ACTIONS */}
                            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <Button variant="outline" onClick={prevStep} disabled={step === 1} className="gap-2">
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </Button>
                                {step < 6 ? (
                                    <Button onClick={nextStep} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all">
                                        Next Step <ChevronRight className="w-4 h-4" />
                                    </Button>
                                ) : (
                                    <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
                                        Complete Assessment
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* RIGHT COLUMN: RESULTS */}
                <div className="lg:col-span-5 space-y-6">
                    {/* RISK ALERT (Sticky if present) */}
                    <AnimatePresence>
                        {step >= 5 && legalDefense.inadmissibility.isInadmissible && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <Alert variant="destructive" className="bg-red-50 border-red-200 dark:bg-red-900/20 shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
                                    <ShieldAlert className="w-5 h-5 text-red-700 dark:text-red-400" />
                                    <AlertTitle className="font-bold text-red-800 dark:text-red-300 text-lg flex items-center gap-2">
                                        Inadmissibility Risk Detected
                                    </AlertTitle>
                                    <AlertDescription className="mt-3">
                                        <div className="p-2 bg-white/50 dark:bg-black/20 rounded mb-3">
                                            <span className="font-semibold text-red-900 dark:text-red-200 block text-xs uppercase tracking-wider mb-1">Risk Factor</span>
                                            <span className="text-red-800 dark:text-red-300 text-sm font-medium">{legalDefense.inadmissibility.ground}</span>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1">
                                                <Briefcase className="w-3 h-3" /> Proposed Legal Defense Strategy
                                            </p>
                                            <ul className="space-y-2">
                                                {legalDefense.defenseStrategy.map((d, i) => (
                                                    <li key={i} className="text-sm bg-white dark:bg-slate-800 p-2 rounded shadow-sm border border-slate-100 dark:border-slate-700">
                                                        <strong className="block text-indigo-700 dark:text-indigo-400 mb-1">{d.title}</strong>
                                                        <span className="text-slate-600 dark:text-slate-400 text-xs">{d.arguments[0]}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* RESULTS HEADER */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Analysis Results</h3>
                            <p className="text-sm text-slate-500">Real-time eligibility calculation</p>
                        </div>
                        <Badge className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-3 py-1 text-sm font-mono">
                            {results.filter(r => r.eligible).length} Pathways
                        </Badge>
                    </div>

                    <ScrollArea className="h-[600px] pr-4">
                        <div className="space-y-3 pb-8">
                            {results.map((r, i) => (
                                <ResultCard key={i} result={r} />
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )

    // --- HELPER RENDERS ---

    function renderStepContent(step: number) {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><GraduationCap className="text-indigo-500" /> Education & Personal Details</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2"><Label>Age</Label><Input type="number" value={age} onChange={e => setAge(e.target.value)} className="h-10" /></div>
                            <div className="space-y-2">
                                <Label>Education Level</Label>
                                <Select value={eduLevel} onValueChange={(v: any) => setEduLevel(v)}>
                                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="Masters">Masters</SelectItem><SelectItem value="PhD">PhD</SelectItem><SelectItem value="Bachelors">Bachelors</SelectItem><SelectItem value="TwoYear">Diploma (2yr)</SelectItem><SelectItem value="OneYear">Certificate (1yr)</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2"><Label>Field of Study</Label><Select value={fieldOfStudy} onValueChange={(v: any) => setFieldOfStudy(v)}><SelectTrigger className="h-10"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="STEM_Health_Trades">STEM, Health, or Trades</SelectItem><SelectItem value="Business_Admin">Business or Administration</SelectItem><SelectItem value="Arts_Humanities">Arts, Humanities, Social Science</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2"><Label>Canadian Education?</Label><Select value={canEduProv} onValueChange={setCanEduProv}><SelectTrigger className="h-10"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="None">None</SelectItem>{PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                            <div className="flex items-center pt-8 space-x-2"><Checkbox checked={canEduCompleted} onCheckedChange={(c: any) => setCanEduCompleted(c)} id="ce" /><Label htmlFor="ce" className="cursor-pointer">Completed?</Label></div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Globe className="text-indigo-500" /> Language Proficiency</h2>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                            <Label className="mb-3 block text-indigo-900 dark:text-indigo-300 font-bold">English (CLB Level)</Label>
                            <div className="grid grid-cols-4 gap-3">
                                {['Speaking', 'Reading', 'Writing', 'Listening'].map((l, i) => (
                                    <div key={l}><span className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">{l}</span><Input type="number" max={10} min={1} value={[lSpeak, lRead, lWrite, lListen][i]} onChange={e => [setLSpeak, setLRead, setLWrite, setLListen][i](e.target.value)} className="text-center font-mono font-bold" /></div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2"><Checkbox checked={hasFrench} onCheckedChange={(c: any) => setHasFrench(c)} id="fr" /><Label htmlFor="fr" className="cursor-pointer font-semibold">Do you speak French?</Label></div>
                        {hasFrench && (
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 animate-in fade-in slide-in-from-top-2">
                                <Label className="mb-3 block text-indigo-900 dark:text-indigo-300 font-bold">French (NCLC Level)</Label>
                                <div className="grid grid-cols-4 gap-3">
                                    {['Speaking', 'Reading', 'Writing', 'Listening'].map((l, i) => (
                                        <div key={l}><span className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">{l}</span><Input type="number" max={10} min={1} value={[fSpeak, fRead, fWrite, fListen][i]} onChange={e => [setFSpeak, setFRead, setFWrite, setFListen][i](e.target.value)} className="text-center font-mono font-bold" /></div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Briefcase className="text-indigo-500" /> Work Experience & Compliance</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1"><Label>Canadian Experience (Yrs)</Label><Input type="number" value={workCan} onChange={e => setWorkCan(e.target.value)} className="h-12 text-lg" /></div>
                            <div className="space-y-1"><Label>Foreign Experience (Yrs)</Label><Input type="number" value={workFor} onChange={e => setWorkFor(e.target.value)} className="h-12 text-lg" /></div>
                        </div>

                        {/* Compliance Box */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-inner">
                            <Label className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm uppercase tracking-wide mb-4">
                                <ShieldAlert className="w-4 h-4" /> Compliance Validator
                            </Label>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div><Label className="text-xs text-slate-500">Avg Hours/Week</Label><Input value={hrsPerWeek} onChange={e => setHrsPerWeek(e.target.value)} className="bg-white" /></div>
                                <div><Label className="text-xs text-slate-500">Weeks Worked</Label><Input value={weeksWorked} onChange={e => setWeeksWorked(e.target.value)} className="bg-white" /></div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center space-x-2"><Checkbox checked={isSeasonal} onCheckedChange={(c: any) => setIsSeasonal(c)} /><Label className="text-sm">Seasonal?</Label></div>
                                <div className="flex items-center space-x-2"><Checkbox checked={isStudentWork} onCheckedChange={(c: any) => setIsStudentWork(c)} /><Label className="text-sm">Student Status?</Label></div>
                                <div className="flex items-center space-x-2"><Checkbox checked={isCoop} onCheckedChange={(c: any) => setIsCoop(c)} /><Label className="text-sm">Co-op?</Label></div>
                            </div>
                            {compliance.warnings.length > 0 && (
                                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded text-xs text-red-700 dark:text-red-300">
                                    <strong className="flex items-center gap-1 mb-1"><AlertCircle className="w-3 h-3" /> Compliance Issues:</strong>
                                    <ul className="list-disc pl-4 space-y-1">{compliance.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
                                </div>
                            )}
                        </div>

                        {/* Job Offer */}
                        <div className="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                            <Label className="font-semibold flex items-center gap-2 mb-3"><Briefcase className="w-4 h-4 text-slate-400" /> Current Job Offer (Optional)</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label className="text-xs">Location</Label><Select value={jobOfferProv} onValueChange={setJobOfferProv}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="None">None</SelectItem>{PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                                <div><Label className="text-xs">Level/TEER</Label><Select value={jobOfferType} onValueChange={(v: any) => setJobOfferType(v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="None">None</SelectItem><SelectItem value="Teer0123">Skilled (TEER 0-3)</SelectItem><SelectItem value="Teer45">Semi-Skilled (TEER 4-5)</SelectItem></SelectContent></Select></div>
                            </div>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Timer className="text-indigo-500" /> Status & Expiry</h2>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Work/Study Permit Expiry Date</Label>
                                <Input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="h-12 text-lg" />
                            </div>

                            <div className="flex items-start space-x-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800">
                                <Checkbox checked={statusApplied} onCheckedChange={(c: any) => setStatusApplied(c)} className="mt-1" id="ext" />
                                <div>
                                    <Label htmlFor="ext" className="font-semibold cursor-pointer">Extension Applied?</Label>
                                    <p className="text-xs text-slate-500">I submitted an application for extension BEFORE my current status expired.</p>
                                </div>
                            </div>

                            {/* Status Analysis Box */}
                            <Alert className={`${statusStrategy.urgentActionRequired ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'}`}>
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-full ${statusStrategy.urgentActionRequired ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                        <Timer className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <AlertTitle className="text-lg font-bold">
                                            {statusStrategy.statusState === 'Valid' && 'Status Valid'}
                                            {statusStrategy.statusState === 'Maintained' && 'Maintained Status (Implied)'}
                                            {statusStrategy.statusState === 'RestorationPeriod' && '⚠️ Restoration Period'}
                                            {statusStrategy.statusState === 'OutOfStatus' && '❌ OUT OF STATUS'}
                                        </AlertTitle>
                                        <AlertDescription className="mt-2 space-y-2">
                                            <p className="font-medium text-sm">{statusStrategy.daysRemaining > 0 ? `${statusStrategy.daysRemaining} Days Remaining` : 'Expired'}</p>
                                            <div className="text-xs bg-white/50 dark:bg-black/20 p-2 rounded">
                                                <strong className="block mb-1">Action Plan:</strong>
                                                <ul className="list-disc pl-4 space-y-1">{statusStrategy.actionPlan.map((s, i) => <li key={i}>{s}</li>)}</ul>
                                            </div>
                                        </AlertDescription>
                                    </div>
                                </div>
                            </Alert>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div className="space-y-6">
                        <div className="bg-amber-50 dark:bg-[#1a1600] p-6 -m-2 rounded-xl border border-amber-200 dark:border-amber-900/50 shadow-lg relative overflow-hidden">
                            {/* Watermark/Background decoration */}
                            <Gavel className="absolute -bottom-10 -right-10 w-64 h-64 text-amber-900/5 rotate-12 pointer-events-none" />

                            <div className="flex items-center gap-3 mb-6 border-b border-amber-200/50 pb-4">
                                <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg">
                                    <Lock className="w-6 h-6 text-amber-800 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-serif font-bold text-amber-900 dark:text-amber-100">Confidential Legal Assessment</h2>
                                    <p className="text-xs text-amber-700 dark:text-amber-500 uppercase tracking-widest">Attorney-Client Privilege Simulation</p>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 hover:bg-amber-100/50 rounded transition-colors">
                                        <Label className="text-amber-900 dark:text-amber-200 font-medium">Criminal Record?</Label>
                                        <Checkbox checked={hasCriminal} onCheckedChange={(c: any) => setHasCriminal(c)} className="border-amber-400 data-[state=checked]:bg-amber-600" />
                                    </div>
                                    <AnimatePresence>
                                        {hasCriminal && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-4 border-l-2 border-amber-300 space-y-3 overflow-hidden">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1"><Label className="text-xs text-amber-800">Sentence Completed</Label><Input type="date" value={sentenceDate} onChange={e => setSentenceDate(e.target.value)} className="bg-white/80 border-amber-200" /></div>
                                                    <div className="flex items-center pt-6 gap-2"><Checkbox checked={isSeriousCrime} onCheckedChange={(c: any) => setIsSeriousCrime(c)} className="border-amber-400" /><Label className="text-xs text-amber-800">Serious (>10yr Max)</Label></div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <Separator className="bg-amber-200/50" />

                                    <div className="flex items-center justify-between p-3 hover:bg-amber-100/50 rounded transition-colors">
                                        <Label className="text-amber-900 dark:text-amber-200 font-medium">Medical Condition?</Label>
                                        <Checkbox checked={hasMedical} onCheckedChange={(c: any) => setHasMedical(c)} className="border-amber-400 data-[state=checked]:bg-amber-600" />
                                    </div>
                                    {hasMedical && (
                                        <div className="pl-4 border-l-2 border-amber-300">
                                            <Label className="text-xs text-amber-800">Est. Annual Cost ($)</Label>
                                            <Input type="number" value={medicalCost} onChange={e => setMedicalCost(e.target.value)} className="bg-white/80 border-amber-200 w-full" />
                                        </div>
                                    )}

                                    <Separator className="bg-amber-200/50" />

                                    <div className="flex items-center justify-between p-3 hover:bg-amber-100/50 rounded transition-colors">
                                        <Label className="text-amber-900 dark:text-amber-200 font-medium">Prior Refusals?</Label>
                                        <Checkbox checked={hasRefusal} onCheckedChange={(c: any) => setHasRefusal(c)} className="border-amber-400 data-[state=checked]:bg-amber-600" />
                                    </div>
                                    {hasRefusal && (
                                        <div className="pl-4 border-l-2 border-amber-300">
                                            <Label className="text-xs text-amber-800">Refusal Reason</Label>
                                            <Select value={refusalReason} onValueChange={(v: any) => setRefusalReason(v)}><SelectTrigger className="bg-white/80 border-amber-200"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Misrepresentation">Misrepresentation</SelectItem><SelectItem value="ReferenceLetter">Reference Letters</SelectItem><SelectItem value="Funds">Funds</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 6:
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><MapPin className="text-indigo-500" /> Connections & Intent</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <CheckBoxGroup label="Relatives in Canada" options={PROVINCES} selected={relatives} onChange={setRelatives} />
                            <CheckBoxGroup label="Friends in Canada" options={PROVINCES} selected={friends} onChange={setFriends} />
                            <CheckBoxGroup label="Past Study" options={PROVINCES} selected={pastStudy} onChange={setPastStudy} />
                            <CheckBoxGroup label="Past Work" options={PROVINCES} selected={pastWork} onChange={setPastWork} />
                        </div>
                    </div>
                )
            default: return null
        }
    }
}

// --- COMPONENTS ---
function CheckBoxGroup({ label, options, selected, onChange }: any) {
    return (
        <div className="space-y-2">
            <Label className="font-semibold text-sm">{label}</Label>
            <ScrollArea className="h-32 border rounded-md p-2 bg-slate-50 dark:bg-slate-900">
                {options.map((opt: string) => (
                    <div key={opt} className="flex items-center space-x-2 mb-2 hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded transition-colors">
                        <Checkbox id={`${label}-${opt}`} checked={selected.includes(opt)} onCheckedChange={() => { if (selected.includes(opt)) onChange(selected.filter((s: string) => s !== opt)); else onChange([...selected, opt]) }} />
                        <Label htmlFor={`${label}-${opt}`} className="font-normal cursor-pointer text-sm w-full">{opt}</Label>
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
        <Card className={`group p-4 border-l-4 transition-all duration-300 hover:shadow-md ${isHigh ? 'border-l-emerald-500 bg-white hover:bg-emerald-50/30' : isMed ? 'border-l-amber-500 bg-white hover:bg-amber-50/30' : 'border-l-slate-300 opacity-75 hover:opacity-100 bg-slate-50'}`}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 transition-colors">{result.stream}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{result.province}</p>
                </div>
                <div className="text-right">
                    <div className="text-xl font-black tracking-tight text-slate-800 dark:text-white">{result.score}{result.maxScore > 0 && <span className="text-xs text-slate-400 font-normal ml-0.5">/{result.maxScore}</span>}</div>
                    <Badge className={`${isHigh ? 'bg-emerald-100 text-emerald-800' : isMed ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'} border-0 px-2 py-0.5 text-[10px]`}>
                        {result.drawProbability} Chance
                    </Badge>
                </div>
            </div>

            {result.warnings.length > 0 && (
                <div className="mb-3 space-y-1 bg-amber-50 p-2 rounded border border-amber-100">
                    {result.warnings.map((w, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[10px] text-amber-700 leading-tight">
                            <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" /> <span>{w}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-500 hover:text-indigo-600 p-0 hover:bg-transparent transition-colors">
                            View Checklist
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

                {isHigh && <Button size="sm" className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 shadow-sm text-white transition-all transform active:scale-95">Apply Now <ArrowRight className="w-3 h-3 ml-1" /></Button>}
            </div>
        </Card>
    )
}
