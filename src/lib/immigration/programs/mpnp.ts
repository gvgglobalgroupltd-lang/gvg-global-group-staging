import { CandidateProfile, ProgramResult } from './types';

// MPNP 100 Point Grid
// Pass Mark: 60/100
// Critical: CONNECTION is mandatory for proper SWO eligibility (Friend/Family)

function calculateMPNPPoints(p: CandidateProfile): number {
    let score = 0;

    // 1. Language (Max 25)
    // CLB 8+ = 20/25 (Second lang adds 5)
    const clb = Math.min(p.clbEnglish.l, p.clbEnglish.s);
    if (clb >= 8) score += 20;
    else if (clb >= 7) score += 18;
    else if (clb >= 6) score += 16;
    else if (clb >= 5) score += 14;
    else if (clb >= 4) score += 12;

    // 2. Age (Max 10)
    // 21-45 = 10
    if (p.age >= 21 && p.age <= 45) score += 10;

    // 3. Exp (Max 15)
    // 4+ yrs = 15
    if (p.workExperience.foreign >= 4) score += 15;
    else if (p.workExperience.foreign >= 1) score += 10; // Simplified

    // 4. Education (Max 25)
    // Masters/PhD = 23
    // Bachelors = 20
    // Trade/Diploma = 19
    if (p.educationLevel === 'PhD' || p.educationLevel === 'Masters') score += 23;
    else if (p.educationLevel === 'Bachelors') score += 20;
    else if (p.educationLevel === 'TwoYear' || p.educationLevel === 'OneYear') score += 19;

    // 5. Adaptability (Max 25)
    // Close Relative = 20
    // Friend / Distant Relative = 10
    // Past Edu/Work in MB = 10-12
    if (p.connections.relativeInProvince.includes('Manitoba')) score += 20;
    else if (p.connections.friendInProvince.includes('Manitoba')) score += 10;
    else if (p.connections.pastStudy.includes('Manitoba')) score += 10; // Actually 12?
    else if (p.connections.pastWork.includes('Manitoba')) score += 12;

    return score;
}

export function calculateMPNP(p: CandidateProfile): ProgramResult[] {
    const results: ProgramResult[] = [];
    const score = calculateMPNPPoints(p);

    const hasConnection = p.connections.relativeInProvince.includes('Manitoba') ||
        p.connections.friendInProvince.includes('Manitoba') ||
        p.connections.pastStudy.includes('Manitoba') ||
        p.connections.pastWork.includes('Manitoba');

    // Skilled Worker Overseas (SWO)
    // Must have connection OR be invited by Strategic Recruitment.
    // For tool, we assume Connection pathway.

    results.push({
        province: 'Manitoba',
        stream: 'Skilled Worker Overseas',
        score: score,
        maxScore: 100,
        eligible: score >= 60 && hasConnection,
        drawProbability: score >= 75 ? 'High' : score >= 60 ? 'Medium' : 'Low',
        warnings: hasConnection ? [] : ['Requires Connection to Manitoba (Friend/Family) or Strategic Invitation'],
        checklist: ['settlement_plan_2', 'proof_of_connection_mb']
    });

    // Career Employment Pathway (Graduates)
    // Job Offer in MB + Grad from MB
    if (p.workExperience.jobOfferProvince === 'Manitoba' &&
        p.canadianEducation.province === 'Manitoba' &&
        p.canadianEducation.completed) {
        results.push({
            province: 'Manitoba',
            stream: 'Career Employment Pathway (IES)',
            score: 100, // Pass/Fail stream mainly
            maxScore: 100,
            eligible: true,
            drawProbability: 'High',
            warnings: ['Job must be related to field of study'],
            checklist: ['job_offer_mb', 'degree_mb']
        })
    }

    return results;
}
