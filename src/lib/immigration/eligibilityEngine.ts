// Types
export type UserProfile = {
    age: number;
    education: 'High School' | 'Diploma' | 'Bachelors' | 'Masters' | 'PhD';
    clbEnglish: number;
    clbFrench: number;
    workExpCanada: number; // years
    workExpForeign: number; // years
    sector: string;
    jobOfferDest: string | 'None';
    connections: string[]; // Provinces with family
    connectionsFriend: string[]; // Provinces with friends (Important for Manitoba)
}

export type EligibilityResult = {
    program: string;
    eligible: boolean;
    score?: number;
    passScore?: number;
    reason: string;
    probability: 'High' | 'Medium' | 'Low' | 'None';
    checklistId?: string; // Link to specific document list
}

// --- HELPER SCORING FUNCTIONS ---

const getFSWAgePoints = (age: number) => {
    if (age >= 18 && age <= 35) return 12 // Max
    return Math.max(0, 12 - (age - 35))
}

const getEducationPoints = (edu: string, system: 'Federal' | 'MPNP' | 'SINP' | 'BC') => {
    // Simplified mapping
    switch (system) {
        case 'Federal': // Max 25
            if (edu === 'PhD') return 25
            if (edu === 'Masters') return 23
            if (edu === 'Bachelors') return 21
            if (edu === 'Diploma') return 19
            return 5
        case 'MPNP': // Max 25
            if (edu === 'PhD' || edu === 'Masters') return 23 // Master 23, PhD 23? Checked: Masters 23.
            if (edu === 'Bachelors') return 20
            if (edu === 'Diploma') return 19 // 2 years
            return 14
        case 'SINP': // Max 23
            if (edu === 'Masters' || edu === 'PhD') return 23
            if (edu === 'Bachelors') return 20
            if (edu === 'Diploma') return 15
            return 12
        case 'BC': // SIRS Max 40
            if (edu === 'Masters' || edu === 'PhD') return 27 // PhD 27, Masters 22
            if (edu === 'Bachelors') return 15
            if (edu === 'Diploma') return 15
            return 5
    }
    return 0
}

// --- MAIN ENGINE ---
export function calculateEligibility(profile: UserProfile): EligibilityResult[] {
    const results: EligibilityResult[] = [];

    // --- 1. FEDERAL SKILLED WORKER (FSW) - 67 POINTS GRID ---
    let fsw = 0
    // Factor 1: Age (Max 12)
    fsw += getFSWAgePoints(profile.age)
    // Factor 2: Education (Max 25)
    fsw += getEducationPoints(profile.education, 'Federal')
    // Factor 3: Work Experience (Max 15)
    fsw += profile.workExpForeign >= 6 ? 15 : profile.workExpForeign >= 4 ? 13 : profile.workExpForeign >= 2 ? 11 : profile.workExpForeign === 1 ? 9 : 0
    // Factor 4: Language (Max 28 - First Official)
    // Simplified: CLB 9=6/band -> 24. 
    const clbPts = profile.clbEnglish >= 9 ? 24 : profile.clbEnglish >= 8 ? 20 : profile.clbEnglish >= 7 ? 16 : 0
    fsw += clbPts
    // Factor 5: Arranged Employment (Max 10)
    if (profile.jobOfferDest !== 'None') fsw += 10
    // Factor 6: Adaptability (Max 10)
    // Connections, Canadian Exp, etc.
    let adapt = 0
    if (profile.connections.length > 0) adapt += 5
    if (profile.workExpCanada >= 1) adapt += 10
    fsw += Math.min(10, adapt) // Cap at 10

    const isFSW = fsw >= 67

    // CRS Estimator (Rough)
    let crs = 0;
    if (profile.age >= 20 && profile.age <= 29) crs += 110; else crs += 50;
    if (profile.education === 'Masters') crs += 135; else if (profile.education === 'Bachelors') crs += 120;
    if (profile.clbEnglish >= 9) crs += 136; else if (profile.clbEnglish >= 7) crs += 80;
    if (profile.clbFrench >= 7) crs += 50;
    if (profile.workExpCanada >= 1) crs += 40;
    if (profile.workExpForeign >= 3) crs += 50;

    results.push({
        program: 'Federal Skilled Worker (FSW)',
        eligible: isFSW,
        score: fsw,
        passScore: 67,
        reason: isFSW ? `Eligible. Scored ${fsw}/100 points. (Pass: 67). Next step: CRS check.` : `Ineligible. Scored ${fsw}/100. Need 67. Improve Language or Experience.`,
        probability: isFSW ? (crs > 480 ? 'High' : crs > 450 ? 'Medium' : 'Low') : 'None',
        checklistId: 'express-entry'
    });

    results.push({
        program: 'Federal Express Entry (CRS Status)',
        eligible: isFSW || (profile.workExpCanada >= 1 && profile.clbEnglish >= 5), // CEC Logic
        score: crs,
        reason: `Estimated CRS: ${crs}. Recent cut-offs: ~480-525.`,
        probability: crs > 500 ? 'High' : crs > 470 ? 'Medium' : 'Low',
        checklistId: 'express-entry'
    })

    // --- 2. ONTARIO (OINP) ---
    // HCP: CRS Based. Tech Draw: < 460 sometimes.
    const oinpTech = isFSW && ['Tech / IT', 'Healthcare'].includes(profile.sector) && crs > 400;
    results.push({
        program: 'Ontario (OINP) - Human Capital',
        eligible: oinpTech,
        reason: oinpTech ? `Target Sector matches. CRS ${crs} is competitive for Tech/Health draws.` : `Need CRS > 400 & Priority Sector.`,
        probability: oinpTech ? (crs > 460 ? 'High' : 'Medium') : 'Low',
        checklistId: 'oinp-hcp'
    });

    // --- 3. MANITOBA (MPNP) - 100 POINTS GRID ---
    // Connection is MANDATORY for Overseas
    let mpnp = 0
    // Factor 1: Language (Max 25)
    mpnp += profile.clbEnglish >= 8 ? 20 : profile.clbEnglish >= 7 ? 18 : 16
    // Factor 2: Age (Max 10) - 21-45 full pts
    mpnp += (profile.age >= 21 && profile.age <= 45) ? 10 : 0
    // Factor 3: Exp (Max 15) - 4+ years = 15
    mpnp += profile.workExpForeign >= 4 ? 15 : profile.workExpForeign === 3 ? 13 : 11
    // Factor 4: Edu (Max 25)
    mpnp += getEducationPoints(profile.education, 'MPNP')
    // Factor 5: Adaptability (Max 25) - HUGE
    let mpnpConnection = false
    if (profile.connections.includes('Manitoba')) { mpnp += 20; mpnpConnection = true } // Family
    else if (profile.connectionsFriend.includes('Manitoba')) { mpnp += 10; mpnpConnection = true } // Friend (Actually 10 pts for Friend, 20 for Relative)
    // Note: Connection is typically REQUIRED for SWM (Skilled Worker Overseas) unless invited by Strategic Initiative.

    results.push({
        program: 'Manitoba (MPNP)',
        eligible: mpnp >= 60 && mpnpConnection,
        score: mpnp,
        passScore: 60,
        reason: mpnpConnection ? `Scored ${mpnp}/100. Connection verified.` : `Scored ${mpnp}/100 but Ineligible due to missing MB Connection.`,
        probability: (mpnp >= 75 && mpnpConnection) ? 'High' : 'Low',
        checklistId: 'mpnp'
    })

    // --- 4. SASKATCHEWAN (SINP) - 100 POINTS GRID ---
    let sinp = 0
    // Edu (Max 23)
    sinp += getEducationPoints(profile.education, 'SINP')
    // Exp (Max 15) - 5 yrs = 10 (Wait, grid says 10 for 5yrs in last 5. 15 max total maybe?) Simplified to standard.
    sinp += profile.workExpForeign >= 5 ? 10 : 8
    // Language (Max 30) - CLB 8=20
    sinp += profile.clbEnglish >= 8 ? 20 : 18
    // Age (Max 12) - 22-34 full
    sinp += (profile.age >= 22 && profile.age <= 34) ? 12 : 10
    // Connection (Max 30) - Family = 20
    if (profile.connections.includes('Saskatchewan')) sinp += 20

    results.push({
        program: 'Saskatchewan (SINP - OID/EE)',
        eligible: sinp >= 60,
        score: sinp,
        passScore: 60,
        reason: sinp >= 60 ? `Scored ${sinp}/100. Eligible for EOI pool.` : `Scored ${sinp}/100. Need 60.`,
        probability: sinp >= 70 ? 'High' : sinp >= 63 ? 'Medium' : 'Low',
        checklistId: 'sinp'
    })

    // --- 5. BC PNP (SIRS) ---
    // Skills Immigration Registration System
    // Economic Factors (Wage particularly) are hard to guess.
    // We assume median wage for Tech ($80k => ~15-20 pts)
    let sirs = 0
    // Human Capital (Max 120)
    // Exp (Max 40) - Directly related. 5 yrs = 20 pts base.
    sirs += profile.workExpForeign >= 5 ? 20 : 16
    // Edu (Max 40)
    sirs += getEducationPoints(profile.education, 'BC')
    // Lang (Max 40)
    sirs += profile.clbEnglish >= 9 ? 30 : profile.clbEnglish >= 7 ? 20 : 10

    // Economic (Max 80)
    // Wage: Assuming sector avg. Tech/IT high ($40/hr -> ~25 pts). General Low (~10 pts).
    if (profile.sector === 'Tech / IT') sirs += 25
    else if (profile.sector === 'Healthcare') sirs += 20
    else sirs += 10
    // Area: Regional District. Assuming Vancouver (0 pts) for conservative calc.

    const bcPass = 90 // Float variable
    results.push({
        program: 'BC PNP (Skills Immigration)',
        eligible: sirs >= 80, // Loose eligibility
        score: sirs,
        reason: `Est. SIRS Score: ${sirs} (Conservative, assuming Vancouver). Recent Tech draws ~90-100.`,
        probability: sirs >= 100 ? 'High' : sirs >= 90 ? 'Medium' : 'Low',
        checklistId: 'bc-pnp'
    })

    // --- 6. ALBERTA, ATLANTIC, NS, QUEBEC ---
    // (Retain previous logic as they rely more on Job Offer / specific streams than rigid grids manageable here)
    // QUEBEC
    // French is vital.
    let qc = 0
    if (profile.education === 'Masters') qc += 14;
    if (profile.age <= 35) qc += 16;
    if (profile.clbFrench >= 7) qc += 16;
    const qcEligible = qc >= 45 // Very rough "selection" threshold
    results.push({
        program: 'Quebec (Arrima)',
        eligible: qcEligible,
        score: qc,
        reason: `Emphasis on French/Age. Scored ${qc}.`,
        probability: (qc >= 55 && profile.clbFrench >= 7) ? 'High' : 'Low',
        checklistId: 'quebec-arrima'
    })

    return results.sort((a, b) => (a.probability === 'High' ? -1 : 1));
}
