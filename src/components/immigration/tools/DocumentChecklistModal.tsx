import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckSquare, FileText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// --- CHECKLIST DATA ---
const CHECKLISTS: Record<string, { title: string, docs: string[] }> = {
    'express-entry': {
        title: 'Express Entry Documents',
        docs: [
            'ECA Report (WES/ICAS/CES) - Must be < 5 years old',
            'IELTS/CELPIP/TEF Results - Must be < 2 years old',
            'Reference Letters from Employers (on letterhead, duties listed)',
            'Digital Photos (Specific dimensions)',
            'Police Clearance Certificates (for every country lived in > 6 months)',
            'Proof of Funds (Bank records for past 6 months)'
        ]
    },
    'oinp-hcp': {
        title: 'OINP Human Capital Priorities',
        docs: [
            'Notification of Interest (NOI) Letter',
            'Statement of Intent to Reside in Ontario',
            'ECA Report (Duplicate copy often needed)',
            'All pages of Passport',
            'Pay slips / Tax docs (T4/NOA) to prove work history',
            'Resume'
        ]
    },
    'bc-pnp': {
        title: 'BC PNP Skills Immigration',
        docs: [
            'BC PNP Registration File Number',
            'Job Offer Form (signed by employer)',
            'Employer Recommendation Letter',
            'Company Info (Business License, Incorporation)',
            'Evidence of Wage/Salary meeting industry standards'
        ]
    },
    'sinp': {
        title: 'Saskatchewan SINP',
        docs: [
            'SINP Ethical Conduct Disclosure',
            'Settlement Plan',
            'Proof of Connection (Family proof of residence in SK)',
            'Determined funds (liquid assets statement)',
            'Work experience credentials'
        ]
    },
    'mpnp': {
        title: 'Manitoba MPNP',
        docs: [
            'Manitoba Settlement Plan (Part 1 & 2)',
            'Proof of Close Relative/Friend in Manitoba (Health card, License)',
            'Letter of Support from Supporter',
            'Educational Transcripts'
        ]
    },
    'quebec-arrima': {
        title: 'Quebec Arrima / CSQ',
        docs: [
            'Tests de français (TEF-AQ, TCF-Q)',
            'Certified copies of Diplomas',
            'Work certificates matching NOC codes',
            'Contract of Financial Capacity'
        ]
    },
    'aip': {
        title: 'Atlantic Immigration Program',
        docs: [
            'IMM 0157 (Job Offer Form - Designation)',
            'Settlement Plan from Service Provider',
            'Copy of Employer Designation Confirmation',
            'English Test Results'
        ]
    },
    'nsnp': {
        title: 'Nova Scotia NSNP',
        docs: [
            'NSNP 100 - Application Form',
            'Copy of Express Entry Profile',
            'Proof of Financial Resources',
            'Employment Reference Letters'
        ]
    }
}

export function DocumentChecklistModal({ checklistId, programName }: { checklistId?: string, programName: string }) {
    const data = checklistId ? CHECKLISTS[checklistId] : null

    if (!data) return null

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2 text-xs gap-2">
                    <CheckSquare className="w-3 h-3" /> View Checklist
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        {data.title}
                    </DialogTitle>
                    <DialogDescription>
                        Based on 2024/2025 guidelines. Official requirements may vary.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-slate-50 dark:bg-slate-950">
                    <ul className="space-y-3">
                        {data.docs.map((doc, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-700 mt-0.5">
                                    <span className="text-transparent">✓</span>
                                </span>
                                {doc}
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
                <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">Download PDF (Simulated)</Button>
            </DialogContent>
        </Dialog>
    )
}
