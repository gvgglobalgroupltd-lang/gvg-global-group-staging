import { CandidateProfile, ProgramResult } from './types';

// SINP 100 Point Grid (OID / Express Entry)
// Pass Mark: 60/100

function calculateSINPPoints(p: CandidateProfile): number {
    let score = 0;

    // 1. Education (Max 23)
    // Masters/PhD = 23. Bachelors = 20. Trade/2yr = 15. 1yr = 12.
    if (p.educationLevel === 'Masters' || p.educationLevel === 'PhD') score += 23;
    else if (p.educationLevel === 'Bachelors') score += 20;
    else if (p.educationLevel === 'TwoYear') score += 15;
    else if (p.educationLevel === 'OneYear') score += 12;

    // 2. Exp (Max 15)
    // 5 yrs (in last 5) = 10? + 5 in 6-10?
    // Simplified: 5 yrs = 10 pts.
    if (p.workExperience.foreign >= 5) score += 10;
    else if (p.workExperience.foreign >= 4) score += 8;
    else if (p.workExperience.foreign >= 3) score += 6;
    else if (p.workExperience.foreign >= 2) score += 4;
    else if (p.workExperience.foreign >= 1) score += 2;

    // 3. Language (Max 30)
    // CLB 8+ = 20. CLB 7 = 18. CLB 6 = 16. CLB 5 = 14. CLB 4 = 12.
    const clb = Math.min(p.clbEnglish.l, p.clbEnglish.s);
    if (clb >= 8) score += 20;
    else if (clb >= 7) score += 18;
    else if (clb >= 6) score += 16;
    else if (clb >= 5) score += 14;
    else if (clb >= 4) score += 12;
    // French bonus? (Check official grid - usually part of language max 30)

    // 4. Age (Max 12)
    // 22-34 = 12.
    if (p.age >= 22 && p.age <= 34) score += 12;
    else if (p.age >= 35 && p.age <= 45) score += 10; // Declines
    else if (p.age >= 46 && p.age <= 50) score += 8;
    else score += 0;

    // 5. Connection (Max 30)
    // Job Offer = 30
    // Relative = 20
    // Past Work/Study = 5
    if (p.workExperience.jobOfferProvince === 'Saskatchewan') score += 30;
    else if (p.connections.relativeInProvince.includes('Saskatchewan')) score += 20;
    else if (p.connections.pastWork.includes('Saskatchewan')) score += 5;
    else if (p.connections.pastStudy.includes('Saskatchewan')) score += 5;

    return score;
}

export function calculateSINP(p: CandidateProfile): ProgramResult[] {
    const results: ProgramResult[] = [];
    const score = calculateSINPPoints(p);

    // Eligibility: Scored 60+ AND has In-demand Occupation (excluded occupations list exist)
    // We assume "Other" might be excluded, but Tech/Health/Trades usually safe.

    // OID (Occupation In-Demand) - Non-Express Entry
    results.push({
        province: 'Saskatchewan',
        stream: 'Occupation In-Demand',
        score: score,
        maxScore: 110, // 100 + 10 bilingual bonus possibly
        eligible: score >= 60,
        drawProbability: score >= 68 ? 'High' : score >= 60 ? 'Medium' : 'Low',
        warnings: ['Occupation must not be on Excluded List'],
        checklist: ['settlement_funds', 'settlement_plan']
    });

    // Express Entry Sub-category
    // Needs EE Profile
    results.push({
        province: 'Saskatchewan',
        stream: 'Express Entry',
        score: score,
        maxScore: 110,
        eligible: score >= 60,
        drawProbability: score >= 68 ? 'High' : score >= 60 ? 'Medium' : 'Low',
        warnings: ['Valid Express Entry Profile Number required'],
        checklist: ['ee_profile_number']
    });

    return results;
}
