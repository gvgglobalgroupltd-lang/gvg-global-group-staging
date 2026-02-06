import { CandidateProfile, ProgramResult } from './types';

// ALBERTA (AAIP) & ATLANTIC (AIP)
// These are less grid-heavy and more threshold-based.

export function calculateAAIP(p: CandidateProfile, crs: number): ProgramResult[] {
    const results: ProgramResult[] = [];

    // 1. Alberta Opportunity Stream (AOS) - Paused?
    // Req: Job Offer in AB (Eligible occupation).
    const hasABJob = p.workExperience.jobOfferProvince === 'Alberta';
    if (hasABJob) {
        results.push({
            province: 'Alberta',
            stream: 'Alberta Opportunity Stream (AOS)',
            score: 0,
            maxScore: 0,
            eligible: true,
            drawProbability: 'Medium', // Varies by sector
            warnings: ['Check for current pause/intake status', 'In-demand sectors prioritized (Construction/Health)'],
            checklist: ['ab_job_offer', 'lmia_or_exemption']
        });
    }

    // 2. Alberta Express Entry (Tech Pathway / Health / General)
    // Req: CRS > 300. Tech job offer? Or family connection?
    // Tech: Job offer in Tech NOC.
    const isTech = p.workExperience.jobOfferNoc === 'Tech'; // Proxy
    const hasFamily = p.connections.relativeInProvince.includes('Alberta');

    if (crs >= 300 && p.intentProvinces.includes('Alberta')) {
        let prob: 'High' | 'Medium' | 'Low' | 'None' = 'Low';
        let note = '';

        if (isTech && hasABJob) {
            prob = 'High';
            note = 'Accelerated Tech Pathway';
        } else if (['Construction', 'Health'].includes(p.workExperience.jobOfferNoc)) {
            prob = 'High';
            note = 'Priority Sector';
        } else if (hasFamily) {
            prob = 'Medium';
            note = 'Family Connection Factor';
        }

        results.push({
            province: 'Alberta',
            stream: 'Express Entry Stream',
            score: crs,
            maxScore: 1200,
            eligible: true,
            drawProbability: prob,
            warnings: ['NOI (Notification of Interest) required from Alberta'],
            checklist: ['ee_profile_valid']
        });
    }

    return results;
}

export function calculateAtlantic(p: CandidateProfile): ProgramResult[] {
    const results: ProgramResult[] = [];

    // Atlantic Immigration Program (AIP)
    // Req: Job Offer from Designated Employer in NB, NS, NL, PEI.
    // This is the SINGLE biggest factor.
    const atlanticProvs = ['New Brunswick', 'Nova Scotia', 'Newfoundland', 'PEI'];
    const hasJob = atlanticProvs.includes(p.workExperience.jobOfferProvince);

    results.push({
        province: 'Atlantic Canada (AIP)',
        stream: 'Atlantic Immigration Program',
        score: 0,
        maxScore: 0,
        eligible: hasJob,
        drawProbability: hasJob ? 'High' : 'None',
        warnings: ['Requires Job Offer from Designated Employer'],
        checklist: ['endorsement_certificate', 'designated_employer_offer']
    });

    return results;
}
