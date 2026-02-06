'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Calculator, ChevronRight, ChevronLeft, RotateCcw, Award, GraduationCap, Briefcase, Heart } from 'lucide-react'
import { calculateCRS, CRSProfile, CRSResult } from '@/lib/immigration/CRSEngine'

export function CRSCalculator() {
    const [step, setStep] = useState(1)

    // --- STATE ---

    // 1. Personal
    const [maritalStatus, setMaritalStatus] = useState<CRSProfile['maritalStatus']>('Single')
    const [age, setAge] = useState('29')
    const [education, setEducation] = useState<CRSProfile['education']>('Masters')
    const [canadianDegree, setCanadianDegree] = useState<string>('None')

    // 2. Language (English)
    const [lSpeak, setLSpeak] = useState('9')
    const [lRead, setLRead] = useState('9')
    const [lWrite, setLWrite] = useState('9')
    const [lListen, setLListen] = useState('9')

    // French (Optional)
    const [hasFrench, setHasFrench] = useState(false)
    const [fSpeak, setFSpeak] = useState('0')
    const [fRead, setFRead] = useState('0')
    const [fWrite, setFWrite] = useState('0')
    const [fListen, setFListen] = useState('0')

    // 3. Work
    const [workCan, setWorkCan] = useState('1')
    const [workFor, setWorkFor] = useState('3')
    const [tradeCert, setTradeCert] = useState(false)

    // 4. Spouse (If Married)
    const [spouseEdu, setSpouseEdu] = useState<string>('Bachelors')
    const [spouseWork, setSpouseWork] = useState('1')
    const [spouseLang, setSpouseLang] = useState('5') // All bands same simplified for MVP

    // 5. Additional
    const [sibling, setSibling] = useState(false)
    const [jobOffer, setJobOffer] = useState<'None' | 'NOC_00' | 'NOC_0_1_2_3'>('None')
    const [nomination, setNomination] = useState(false)

    // --- CALCULATION ---
    const result: CRSResult = useMemo(() => {
        const profile: CRSProfile = {
            maritalStatus,
            age: parseInt(age),
            education,
            canadianDegree,
            language: {
                speaking: parseInt(lSpeak),
                reading: parseInt(lRead),
                writing: parseInt(lWrite),
                listening: parseInt(lListen)
            },
            secondLanguage: hasFrench ? {
                speaking: parseInt(fSpeak),
                reading: parseInt(fRead),
                writing: parseInt(fWrite),
                listening: parseInt(fListen)
            } : undefined,
            workGen: {
                canadian: parseInt(workCan),
                foreign: parseInt(workFor)
            },
            spouse: maritalStatus === 'Married' ? {
                education: spouseEdu,
                canadianWork: parseInt(spouseWork),
                language: { // Simplified spouse lang (all same)
                    speaking: parseInt(spouseLang),
                    reading: parseInt(spouseLang),
                    writing: parseInt(spouseLang),
                    listening: parseInt(spouseLang)
                }
            } : undefined,
            additional: {
                siblingInCanada: sibling,
                jobOffer,
                nomination,
                tradeCertificate: tradeCert
            }
        }
        return calculateCRS(profile)
    }, [maritalStatus, age, education, canadianDegree, lSpeak, lRead, lWrite, lListen, hasFrench, fSpeak, fRead, fWrite, fListen, workCan, workFor, tradeCert, spouseEdu, spouseWork, spouseLang, sibling, jobOffer, nomination])

    // --- RENDER HELPERS ---
    const next = () => setStep(s => s + 1)
    const back = () => setStep(s => s - 1)

    return (
        <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-12 gap-8">
            {/* LEFT: WIZARD */}
            <div className="lg:col-span-8">
                <Card className="p-6 md:p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 h-1 bg-slate-100 w-full">
                        <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
                    </div>

                    <div className="mb-8 mt-2">
                        <div className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-1">Step {step} of 4</div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {step === 1 && 'Personal Profile'}
                            {step === 2 && 'Education & Language'}
                            {step === 3 && 'Work Experience'}
                            {step === 4 && 'Additional Factors'}
                        </h2>
                    </div>

                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Marital Status</Label>
                                    <Select value={maritalStatus} onValueChange={(v: any) => setMaritalStatus(v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Single">Single / Separated</SelectItem>
                                            <SelectItem value="Married">Married / Common-Law</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Age</Label>
                                    <Select value={age} onValueChange={setAge}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 30 }, (_, i) => i + 17).map(a => (
                                                <SelectItem key={a} value={a.toString()}>{a} years</SelectItem>
                                            ))}
                                            <SelectItem value="50">50+ years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {maritalStatus === 'Married' && (
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg border border-indigo-100 dark:border-indigo-800 space-y-4">
                                    <h4 className="font-semibold flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                                        <Heart className="w-4 h-4" /> Spouse Details
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Spouse Education</Label>
                                            <Select value={spouseEdu} onValueChange={setSpouseEdu}>
                                                <SelectTrigger className="bg-white dark:bg-slate-950"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="None">None / High School</SelectItem>
                                                    <SelectItem value="OneYear">1-Year Diploma</SelectItem>
                                                    <SelectItem value="Bachelors">Bachelors (3y+)</SelectItem>
                                                    <SelectItem value="Masters">Masters / PhD</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Spouse Canadian Work</Label>
                                            <Select value={spouseWork} onValueChange={setSpouseWork}>
                                                <SelectTrigger className="bg-white dark:bg-slate-950"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">None</SelectItem>
                                                    <SelectItem value="1">1 Year</SelectItem>
                                                    <SelectItem value="3">3+ Years</SelectItem>
                                                    <SelectItem value="5">5+ Years</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Spouse Language (Average CLB)</Label>
                                            <Select value={spouseLang} onValueChange={setSpouseLang}>
                                                <SelectTrigger className="bg-white dark:bg-slate-950"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">None</SelectItem>
                                                    <SelectItem value="5">CLB 5 or 6 (Basic)</SelectItem>
                                                    <SelectItem value="7">CLB 7 or 8 (Intermediate)</SelectItem>
                                                    <SelectItem value="9">CLB 9+ (Advanced)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Education Level</Label>
                                    <Select value={education} onValueChange={(v: any) => setEducation(v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="High School">High School</SelectItem>
                                            <SelectItem value="OneYear">1-Year Diploma</SelectItem>
                                            <SelectItem value="TwoYear">2-Year Diploma</SelectItem>
                                            <SelectItem value="Bachelors">Bachelors (3+ Years)</SelectItem>
                                            <SelectItem value="TwoOrMore">Two or More Certificates</SelectItem>
                                            <SelectItem value="Masters">Masters Degree</SelectItem>
                                            <SelectItem value="PhD">PhD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Canadian Degree?</Label>
                                    <Select value={canadianDegree} onValueChange={setCanadianDegree}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="None">No</SelectItem>
                                            <SelectItem value="OneTwoYear">1 or 2 Year Diploma</SelectItem>
                                            <SelectItem value="ThreeYearPlus">3+ Year Degree</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <Label className="text-base font-semibold">First Official Language (Test Results - CLB)</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { l: 'Speaking', s: setLSpeak, v: lSpeak },
                                        { l: 'Reading', s: setLRead, v: lRead },
                                        { l: 'Writing', s: setLWrite, v: lWrite },
                                        { l: 'Listening', s: setLListen, v: lListen }
                                    ].map(item => (
                                        <div key={item.l} className="space-y-1">
                                            <Label className="text-xs text-slate-500">{item.l}</Label>
                                            <Select value={item.v} onValueChange={item.s}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="10">CLB 10+</SelectItem>
                                                    <SelectItem value="9">CLB 9</SelectItem>
                                                    <SelectItem value="8">CLB 8</SelectItem>
                                                    <SelectItem value="7">CLB 7</SelectItem>
                                                    <SelectItem value="6">CLB 6</SelectItem>
                                                    <SelectItem value="5">CLB 5</SelectItem>
                                                    <SelectItem value="4">CLB 4</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="french" checked={hasFrench} onCheckedChange={(c: any) => setHasFrench(c)} />
                                <Label htmlFor="french">Include Second Official Language (French)?</Label>
                            </div>

                            {hasFrench && (
                                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                    <Label className="mb-2 block">French (TEF/TCF CLB)</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { l: 'Speaking', s: setFSpeak, v: fSpeak },
                                            { l: 'Reading', s: setFRead, v: fRead },
                                            { l: 'Writing', s: setFWrite, v: fWrite },
                                            { l: 'Listening', s: setFListen, v: fListen }
                                        ].map(item => (
                                            <div key={item.l}>
                                                <Select value={item.v} onValueChange={item.s}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0">None</SelectItem>
                                                        <SelectItem value="5">CLB 5</SelectItem>
                                                        <SelectItem value="7">CLB 7</SelectItem>
                                                        <SelectItem value="9">CLB 9</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Canadian Work Experience</Label>
                                    <Select value={workCan} onValueChange={setWorkCan}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">None</SelectItem>
                                            <SelectItem value="1">1 Year</SelectItem>
                                            <SelectItem value="2">2 Years</SelectItem>
                                            <SelectItem value="3">3 Years</SelectItem>
                                            <SelectItem value="4">4 Years</SelectItem>
                                            <SelectItem value="5">5+ Years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Foreign Work Experience</Label>
                                    <Select value={workFor} onValueChange={setWorkFor}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">None</SelectItem>
                                            <SelectItem value="1">1 or 2 Years</SelectItem>
                                            <SelectItem value="3">3+ Years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setTradeCert(!tradeCert)}>
                                <div className="space-y-1">
                                    <Label className="cursor-pointer">Certificate of Qualification (Trade)</Label>
                                    <p className="text-xs text-slate-500">Issued by a Canadian Province/Territory?</p>
                                </div>
                                <Checkbox checked={tradeCert} onCheckedChange={(c) => setTradeCert(c as boolean)} />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Do you have a valid Job Offer? (LMIA / Exempt)</Label>
                                    <Select value={jobOffer} onValueChange={(v: any) => setJobOffer(v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="None">No</SelectItem>
                                            <SelectItem value="NOC_0_1_2_3">Yes (TEER 0, 1, 2, 3) - 50 Pts</SelectItem>
                                            <SelectItem value="NOC_00">Yes (NOC 00 Senior Mgmt) - 200 Pts</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <Label className="cursor-pointer" htmlFor="sib">Sibling in Canada? (Citizen/PR)</Label>
                                    <Checkbox id="sib" checked={sibling} onCheckedChange={(c) => setSibling(c as boolean)} />
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <Label className="cursor-pointer" htmlFor="pnp">Provincial Nomination (PNP)?</Label>
                                    <Checkbox id="pnp" checked={nomination} onCheckedChange={(c) => setNomination(c as boolean)} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <Button variant="ghost" disabled={step === 1} onClick={back} className="pl-0 hover:bg-transparent">
                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        {step < 4 ? (
                            <Button onClick={next} className="bg-indigo-600 hover:bg-indigo-700">
                                Next <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button disabled className="bg-emerald-600 opacity-100">
                                Results Below
                            </Button>
                        )}
                    </div>
                </Card>
            </div>

            {/* RIGHT: SCOREBOARD (Sticky) */}
            <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-4">
                    <Card className="bg-slate-950 text-white p-6 shadow-xl border-slate-800">
                        <div className="text-center pb-6 border-b border-slate-800">
                            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Overall CRS Score</p>
                            <div className="text-5xl font-bold mt-2 mb-1">{result.total}</div>
                            <div className="text-xs text-slate-500">Max: 1200</div>
                        </div>

                        <div className="py-4 space-y-3">
                            <ScoreRow label="Core Human Capital" val={result.breakdown.core} icon={<GraduationCap className="w-4 h-4" />} />
                            <ScoreRow label="Spouse Factors" val={result.breakdown.spouse} icon={<Heart className="w-4 h-4" />} />
                            <ScoreRow label="Skill Transferability" val={result.breakdown.transferability} icon={<Briefcase className="w-4 h-4" />} />
                            <ScoreRow label="Additional Points" val={result.breakdown.additional} icon={<Award className="w-4 h-4" />} />
                        </div>

                        <div className="pt-4 border-t border-slate-800">
                            <Button variant="outline" className="w-full border-slate-700 text-slate-900 bg-white hover:bg-slate-200" onClick={() => setStep(1)}>
                                <RotateCcw className="w-4 h-4 mr-2" /> Reset
                            </Button>
                        </div>
                    </Card>

                    {/* Detailed Breakdown Accordion style */}
                    <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 text-sm space-y-2">
                        <h4 className="font-semibold mb-2">Detailed Breakdown</h4>
                        <DetailRow label="Age" val={result.details.age} />
                        <DetailRow label="Education" val={result.details.education} />
                        <DetailRow label="Language" val={result.details.language} />
                        <DetailRow label="Spouse Edu/Lang" val={result.details.spouseEducation + result.details.spouseLanguage} />
                        <DetailRow label="Transferability" val={result.breakdown.transferability} />
                        <DetailRow label="Provincial Nomination" val={result.details.nomination} highlight />
                    </Card>
                </div>
            </div>
        </div>
    )
}

function ScoreRow({ label, val, icon }: { label: string, val: number, icon: any }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-300">
                {icon} {label}
            </div>
            <div className="font-bold">{val}</div>
        </div>
    )
}

function DetailRow({ label, val, highlight }: { label: string, val: number, highlight?: boolean }) {
    if (val === 0) return null
    return (
        <div className={`flex justify-between ${highlight ? 'text-indigo-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
            <span>{label}</span>
            <span>+{val}</span>
        </div>
    )
}
