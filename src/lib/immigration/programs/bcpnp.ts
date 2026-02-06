import { CandidateProfile, ProgramResult } from './types';

// BC PNP SIRS (Skills Immigration Registration System) - Max 200
// Factors: Human Capital (120) + Economic (80)

function calculateSIRS(p: CandidateProfile): number {
    let score = 0;

    // 1. DIRECTLY RELATED WORK EXPERIENCE (Max 40)
    // 5+ yrs = 20, 4=16, 3=12, 2=8, 1=4
    // We use total foreign/canadian experience here as strictly "Related"
    const totalExp = p.workExperience.canadian + p.workExperience.foreign;
    if (totalExp >= 5) score += 20;
    else if (totalExp >= 4) score += 16;
    else if (totalExp >= 3) score += 12;
    else if (totalExp >= 2) score += 8;
    else if (totalExp >= 1) score += 4;

    // Bonus: At least 1 year in Canada? (+10)
    if (p.workExperience.canadian >= 1) score += 10;
    // Bonus: Current Employment in BC (+10) - Proxy: Job Offer in BC
    if (p.workExperience.jobOfferProvince === 'BC') score += 10;


    // 2. EDUCATION (Max 40)
    // Masters/PhD = 27
    // Bachelors = 15
    // Diploma/Cert = 15 (if eligible trade?)
    if (p.educationLevel === 'PhD') score += 27;
    else if (p.educationLevel === 'Masters') score += 22; // Actually 22 for Masters
    else if (p.educationLevel === 'Bachelors') score += 15;
    else if (p.educationLevel === 'TwoYear' || p.educationLevel === 'OneYear') score += 5; // Diploma is low without trade/license

    // Bonus: BC Education (+8)
    if (p.canadianEducation.province === 'BC') score += 8;


    // 3. LANGUAGE (Max 30)
    // CLB 9+ = 30, 8=25, 7=20, 6=15, 5=10, 4=5
    const clb = Math.min(p.clbEnglish.l, p.clbEnglish.r, p.clbEnglish.w, p.clbEnglish.s);
    if (clb >= 9) score += 30;
    else if (clb >= 8) score += 25;
    else if (clb >= 7) score += 20;
    else if (clb >= 6) score += 15;
    else if (clb >= 5) score += 10;


    // 4. WAGE (Max 55)
    // > $70/hr = 55... 
    // $40/hr ~ 25 pts. $25/hr ~ 10 pts.
    // Simplified Linear approx: 0.5 pts per $ below 70? 
    // Let's use brackets:
    // >$70=55. $60-69=50. $50-59=40. $40-49=30. $30-39=20. <30 = 8-15.
    const w = p.workExperience.jobOfferWage;
    if (w >= 70) score += 55;
    else if (w >= 60) score += 50;
    else if (w >= 50) score += 40;
    else if (w >= 40) score += 30;
    else if (w >= 30) score += 20;
    else if (w > 16) score += 10; // Min wageish

    // 5. AREA OF EMPLOYMENT (Max 25)
    // Greater Vancouver = 0.
    // Squamish/Abbotsford = 5.
    // Far regions = 15-25.
    // Assuming user inputs "BC" without city, we take conservative 0 (Vancouver).
    // Or check if we have city data. We don't.
    // We'll Default to 0 but note it.

    return score;
}

export function calculateBCPNP(p: CandidateProfile): ProgramResult[] {
    const results: ProgramResult[] = [];

    // Core Req: Job Offer IN BC (usually indeterminate)
    // Exception: Int'l Post-Graduate (Science/Tech Masters from BC) - No Job Offer needed.

    const hasJobOfferBC = p.workExperience.jobOfferProvince === 'BC';
    const isTech = p.workExperience.jobOfferNoc === 'Tech';
    const isHealth = p.workExperience.jobOfferNoc === 'Health';

    // 1. Skills Immigration (Skilled Worker)
    if (hasJobOfferBC) {
        const sirs = calculateSIRS(p);

        // Tech Draw Cutoff (Lower, ~80-90)
        // General Draw Cutoff (Higher, ~100-110)
        let pass = 105;
        let prob: 'High' | 'Medium' | 'Low' | 'None' = 'Low';

        if (isTech) {
            pass = 85;
            if (sirs >= 90) prob = 'High';
            else if (sirs >= 80) prob = 'Medium';
        } else if (isHealth) {
            pass = 60; // Health is very low/targeted
            if (sirs >= 60) prob = 'High';
        } else {
            if (sirs >= 110) prob = 'High';
            else if (sirs >= 100) prob = 'Medium';
        }

        results.push({
            province: 'British Columbia',
            stream: isTech ? 'BC PNP Tech' : isHealth ? 'BC PNP Healthcare' : 'Skills Immigration - Skilled Worker',
            score: sirs,
            maxScore: 200,
            eligible: true, // Assuming basic eligibility met by job offer
            drawProbability: prob,
            drawCutoff: pass,
            warnings: ['Job Offer must be indeterminate'],
            checklist: ['bc_job_offer_form', 'employer_recommendation']
        });
    }

    // 2. International Post-Graduate (BC Science Masters)
    // No Job Offer needed!
    if (p.educationLevel === 'Masters' || p.educationLevel === 'PhD') {
        if (p.canadianEducation.province === 'BC' && p.fieldOfStudy === 'STEM_Health_Trades') {
            results.push({
                province: 'British Columbia',
                stream: 'International Post-Graduate',
                score: 200, // Direct PR practically
                maxScore: 200,
                eligible: true,
                drawProbability: 'High',
                warnings: ['Must have graduated from eligible BC institution in Science/Tech'],
                checklist: ['degree_certificate', 'transcripts_final']
            });
        }
    }

    return results;
}
