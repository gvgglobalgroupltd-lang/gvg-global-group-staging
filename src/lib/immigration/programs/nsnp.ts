import { CandidateProfile, ProgramResult } from './types';

// NOVA SCOTIA NOMINEE PROGRAM (NSNP)
// Streams:
// 1. Nova Scotia Experience: Express Entry (1yr work in NS)
// 2. Nova Scotia Labour Market Priorities (Specific draws, e.g. Nurses, French)
// 3. Skilled Worker (Job Offer required)
// 4. Occupations in Demand (Job Offer in specific NOCs C/D -> TEER 4/5)
// 5. International Graduates in Demand (Specific NOCs: ECE, Paramedics, Pharmacy Techs)

export function calculateNSNP(p: CandidateProfile, crs: number): ProgramResult[] {
    const results: ProgramResult[] = [];

    // Common checks
    const hasNSJobOffer = p.workExperience.jobOfferProvince === 'Nova Scotia';
    const hasNSEdu = p.canadianEducation.province === 'Nova Scotia' && p.canadianEducation.completed;
    // Check if current work is in NS and they have > 1 year Canadian experience
    const workInNS = (p.workExperience.province === 'Nova Scotia' && p.workExperience.canadian >= 1) || p.connections.pastWork.includes('Nova Scotia');

    // ----------------------------------------------------------------
    // 1. NS Experience: Express Entry
    // Req: 1 yr work experience in NS in TEER 0,1,2,3.
    // ----------------------------------------------------------------
    if (workInNS && ['Teer0123'].includes(p.workExperience.currentJobOffer)) {
        results.push({
            province: 'Nova Scotia',
            stream: 'NS Experience: Express Entry',
            score: crs, // Linked to Express Entry
            maxScore: 1200,
            eligible: true,
            drawProbability: 'High',
            warnings: ['Requires active Express Entry profile', '1 year work experience in NS required'],
            checklist: ['ns_work_reference', 'ee_profile_number']
        });
    }

    // ----------------------------------------------------------------
    // 2. Skilled Worker Stream
    // Req: Job Offer (Permanent, Full-time) from NS employer.
    // ----------------------------------------------------------------
    if (hasNSJobOffer) {
        results.push({
            province: 'Nova Scotia',
            stream: 'Skilled Worker Stream',
            score: 0,
            maxScore: 0,
            eligible: true,
            drawProbability: 'High',
            warnings: ['Employer must be eligible'],
            checklist: ['ns_employer_form', 'job_offer_letter']
        });
    }

    // ----------------------------------------------------------------
    // 3. Occupations in Demand
    // Req: Job offer in TEER 4/5 specific NOCs (Nurses aides, Food service, Construction, etc.)
    // NOCs: 33102, 65200, 65201, 65310, 73300, 73400, 75110 (Examples)
    // ----------------------------------------------------------------
    // We rely on the "Semi-Skilled" toggle or specific NOC input if we had it.
    // Assuming "Semi-Skilled (TEER 4-5)" with NS Job Offer fits here.
    if (hasNSJobOffer && p.workExperience.currentJobOffer === 'Teer45') {
        results.push({
            province: 'Nova Scotia',
            stream: 'Occupations in Demand',
            score: 0,
            maxScore: 0,
            eligible: true,
            drawProbability: 'High',
            warnings: ['Check active NOC list (e.g., Construction, Transport, Patient Care)'],
            checklist: ['ns_employer_form', 'education_credential']
        });
    }

    // ----------------------------------------------------------------
    // 4. International Graduates in Demand
    // Req: Job offer in specific NOCs (ECE 42202, Paramedics 32102) OR just completed studies?
    // Actually requires Job Offer in these fields + Education in these fields.
    // ----------------------------------------------------------------
    // If they have NS Education and a Job Offer, likely easier.
    if (hasNSJobOffer && hasNSEdu) {
        results.push({
            province: 'Nova Scotia',
            stream: 'International Graduates in Demand',
            score: 0,
            maxScore: 0,
            eligible: true,
            drawProbability: 'Medium',
            warnings: ['Restricted to ECE, Paramedics, Pharmacy Techs'],
            checklist: ['ns_diploma', 'job_offer_letter']
        });
    }

    // ----------------------------------------------------------------
    // 5. Labour Market Priorities (LMP)
    // Passive stream. Selection from EE pool.
    // Criteria shifts (French, Nurses, Carpenters).
    // ----------------------------------------------------------------
    if (crs > 350 && p.intentProvinces.includes('Nova Scotia')) {
        let prob: 'High' | 'Medium' | 'Low' | 'None' = 'Low';
        let reason = '';

        if (p.clbFrench.s >= 7) {
            prob = 'High';
            reason = 'French-Speaking Priority';
        } else if (['STEM_Health_Trades'].includes(p.fieldOfStudy)) {
            prob = 'Medium';
            reason = 'Potential Occuaption Priority';
        }

        results.push({
            province: 'Nova Scotia',
            stream: 'Labour Market Priorities (EE)',
            score: crs,
            maxScore: 1200,
            eligible: true,
            drawProbability: prob,
            warnings: ['Interest Letter Required', reason],
            checklist: ['ee_profile_valid']
        });
    }

    return results;
}
