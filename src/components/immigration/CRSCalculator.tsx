'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Calculator, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'

// --- SCORING LOGIC CONSTANTS ---

// Age Points (Simplified for Single)
const AGE_POINTS: Record<string, number> = {
    '17': 0, '18': 99, '19': 105, '20': 110, '21': 110, '22': 110, '23': 110, '24': 110, '25': 110, '26': 110, '27': 110, '28': 110, '29': 110,
    '30': 105, '31': 99, '32': 94, '33': 88, '34': 83, '35': 77, '36': 72, '37': 66, '38': 61, '39': 55, '40': 50,
    '41': 39, '42': 28, '43': 17, '44': 6, '45+': 0
}

// Education Points (Single)
const EDUCATION_POINTS: Record<string, number> = {
    'None': 0,
    'High School': 30,
    'One Year Post-Sec': 90,
    'Two Year Post-Sec': 98,
    'Bachelors': 120,
    'Two or More Certs': 128,
    'Masters': 135,
    'PhD': 150
}

// Language Points per ability (CLB 9+ is max for First Official Language)
// This is a simplified lookup for generic CLB levels.
// Layout: [Speaking, Reading, Writing, Listening] -> Total usually calculated per band
// For MVP we'll take an average CLB or just a single selection for "Overall CLB" to simplify, 
// OR better, ask for individual bands. Let's do individual bands for accuracy.
const CLB_POINTS_PER_BAND: Record<string, number> = {
    '3': 0, '4': 6, '5': 6, '6': 9, '7': 17, '8': 23, '9': 31, '10+': 34
}

// Work Experience (Canadian)
const CANADIAN_EXP_POINTS: Record<string, number> = {
    'None': 0, '1 Year': 40, '2 Years': 53, '3 Years': 64, '4 Years': 72, '5+ Years': 80
}

// Work Experience (Foreign) - Only adds points via Skill Transferability normally, 
// but for Core Human Capital it's 0. We'll handle Skill Transferability separately.

export function CRSCalculator() {
    const [step, setStep] = useState(1)

    // State
    const [maritalStatus, setMaritalStatus] = useState('Single')
    const [age, setAge] = useState<string>('29')
    const [education, setEducation] = useState<string>('Masters')

    // Language (First Official)
    const [speaking, setSpeaking] = useState('9')
    const [reading, setReading] = useState('9')
    const [writing, setWriting] = useState('9')
    const [listening, setListening] = useState('9')

    const [canadianWork, setCanadianWork] = useState('None')
    const [foreignWork, setForeignWork] = useState('3 Years')

    const [nomination, setNomination] = useState('No')
    const [jobOffer, setJobOffer] = useState('No')

    // Calculated Scores
    const calculateScore = useMemo(() => {
        let core = 0
        let spouse = 0 // Keeping 0 for Single MVP
        let transferability = 0
        let additional = 0

        // 1. Core / Human Capital
        // Age
        core += AGE_POINTS[age] || 0

        // Education
        core += EDUCATION_POINTS[education] || 0

        // Language (First Official)
        const langPoints =
            (CLB_POINTS_PER_BAND[speaking] || 0) +
            (CLB_POINTS_PER_BAND[reading] || 0) +
            (CLB_POINTS_PER_BAND[writing] || 0) +
            (CLB_POINTS_PER_BAND[listening] || 0)
        core += langPoints

        // Canadian Work
        core += CANADIAN_EXP_POINTS[canadianWork] || 0

        // 2. Skill Transferability ( Simplified logic )
        // Education + Language (CLB 9+ in all bands)
        const allCLB9 = [speaking, reading, writing, listening].every(s => s === '9' || s === '10+')

        if (allCLB9 && (education === 'Masters' || education === 'PhD')) {
            transferability += 50
        } else if (allCLB9 && (education === 'Two or More Certs' || education === 'Bachelors')) {
            transferability += 25 // Simplified
        }

        // Education + Canadian Work
        if ((canadianWork === '1 Year' || canadianWork === '2 Years') && education === 'Masters') {
            transferability += 25 // Simplified
        }

        // Foreign Work + Language (CLB 9+)
        const foreignYears = parseInt(foreignWork.charAt(0)) || 0
        if (allCLB9 && foreignYears >= 3) {
            transferability += 50
        } else if (allCLB9 && foreignYears >= 1) {
            transferability += 25
        }

        // Cap Transferability at 100
        if (transferability > 100) transferability = 100

        // 3. Additional Points
        if (nomination === 'Yes') additional += 600
        if (jobOffer === 'Yes') additional += 50 // Valid job offer 00, A, B

        const total = core + spouse + transferability + additional
        return { total, core, transferability, additional }
    }, [age, education, speaking, reading, writing, listening, canadianWork, foreignWork, nomination, jobOffer])

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* INPUT SECTION */}
                <div className="lg:col-span-2 space-y-8">
                    {/* FACTOR 1: Personal Details */}
                    <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm">1</span>
                            Personal Profile
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Marital Status</Label>
                                <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Single">Single / Never Married</SelectItem>
                                        <SelectItem value="Married">Married (Points Adjusted - Coming Soon)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Age</Label>
                                <Select value={age} onValueChange={setAge}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(AGE_POINTS).map(a => (
                                            <SelectItem key={a} value={a}>{a} Years</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>

                    {/* FACTOR 2: Education & Experience */}
                    <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                            <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm">2</span>
                            Education & Experience
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Level of Education</Label>
                                <Select value={education} onValueChange={setEducation}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(EDUCATION_POINTS).map(e => (
                                            <SelectItem key={e} value={e}>{e}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Canadian Work Exp.</Label>
                                    <Select value={canadianWork} onValueChange={setCanadianWork}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(CANADIAN_EXP_POINTS).map(e => (
                                                <SelectItem key={e} value={e}>{e}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Foreign Work Exp.</Label>
                                    <Select value={foreignWork} onValueChange={setForeignWork}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="None">None</SelectItem>
                                            <SelectItem value="1 Year">1 Year</SelectItem>
                                            <SelectItem value="2 Years">2 Years</SelectItem>
                                            <SelectItem value="3 Years">3 Years or more</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* FACTOR 3: Language */}
                    <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                            <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">3</span>
                            Language Ability (IELTS/CELPIP)
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['Speaking', 'Reading', 'Writing', 'Listening'].map((mode) => (
                                <div key={mode} className="space-y-2">
                                    <Label>{mode} (CLB)</Label>
                                    <Select
                                        value={mode === 'Speaking' ? speaking : mode === 'Reading' ? reading : mode === 'Writing' ? writing : listening}
                                        onValueChange={mode === 'Speaking' ? setSpeaking : mode === 'Reading' ? setReading : mode === 'Writing' ? setWriting : setListening}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10+">CLB 10+</SelectItem>
                                            <SelectItem value="9">CLB 9</SelectItem>
                                            <SelectItem value="8">CLB 8</SelectItem>
                                            <SelectItem value="7">CLB 7</SelectItem>
                                            <SelectItem value="6">CLB 6</SelectItem>
                                            <SelectItem value="5">CLB 5</SelectItem>
                                            <SelectItem value="4">CLB 4</SelectItem>
                                            <SelectItem value="3">Below 4</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* FACTOR 4: Additional */}
                    <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                            <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm">4</span>
                            Additional Points
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Do you have a Provincial Nomination?</Label>
                                <RadioGroup value={nomination} onValueChange={setNomination} className="flex gap-4">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="Yes" id="nom-yes" /><Label htmlFor="nom-yes">Yes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="No" id="nom-no" /><Label htmlFor="nom-no">No</Label></div>
                                </RadioGroup>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <Label>Do you have a valid Job Offer?</Label>
                                <RadioGroup value={jobOffer} onValueChange={setJobOffer} className="flex gap-4">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="Yes" id="job-yes" /><Label htmlFor="job-yes">Yes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="No" id="job-no" /><Label htmlFor="job-no">No</Label></div>
                                </RadioGroup>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* SCORE CARD (STICKY) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card className="p-6 bg-slate-950 text-white shadow-xl border-slate-800">
                            <div className="text-center mb-6">
                                <h2 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">Estimated Score</h2>
                                <div className="text-6xl font-bold text-white mt-2 mb-1">{calculateScore.total}</div>
                                <div className="text-xs text-slate-500 max-w-[200px] mx-auto">
                                    Out of 1200 points. Recent cutoff: ~500
                                </div>
                            </div>

                            <Separator className="bg-slate-800 my-4" />

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Core / Human Capital</span>
                                    <span className="font-bold">{calculateScore.core}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Skill Transferability</span>
                                    <span className="font-bold text-emerald-400">+{calculateScore.transferability}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Additional Points</span>
                                    <span className="font-bold text-amber-400">+{calculateScore.additional}</span>
                                </div>
                            </div>

                            <Button className="w-full mt-8 bg-white text-slate-950 hover:bg-slate-200 font-bold">
                                <Calculator className="h-4 w-4 mr-2" /> Detailed Report
                            </Button>

                            <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
                                <AlertCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    This is a simplified estimation. Official scores may vary based on specific document verification and marital factor specifics.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
