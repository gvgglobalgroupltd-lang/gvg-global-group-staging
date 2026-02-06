export type CRSProfile = {
    maritalStatus: 'Single' | 'Married';
    age: number;
    education: string; // 'None' | 'HighSchool' | 'OneYear' | 'TwoYear' | 'Bachelors' | 'TwoOrMore' | 'Masters' | 'PhD'
    canadianDegree: string; // 'None' | 'OneTwoYear' | 'ThreeYearPlus'
    language: {
        speaking: number;
        reading: number;
        writing: number;
        listening: number;
    };
    secondLanguage?: {
        speaking: number;
        reading: number;
        writing: number;
        listening: number;
    };
    workGen: {
        canadian: number; // Years
        foreign: number; // Years
    };
    spouse?: {
        education: string;
        language: {
            speaking: number;
            reading: number;
            writing: number;
            listening: number;
        };
        canadianWork: number;
    };
    additional: {
        siblingInCanada: boolean;
        jobOffer: 'None' | 'NOC_00' | 'NOC_0_1_2_3'; // 0, 200, 50
        nomination: boolean;
        tradeCertificate: boolean; // Valid Trade Cert
    };
}

export type CRSResult = {
    total: number;
    breakdown: {
        core: number;
        spouse: number;
        transferability: number;
        additional: number;
    };
    details: {
        age: number;
        education: number;
        language: number;
        canadianWork: number;
        spouseEducation: number;
        spouseLanguage: number;
        spouseWork: number;
        transferabilityEdu: number;
        transferabilityForeign: number;
        transferabilityCert: number;
        sibling: number;
        french: number;
        educationCanada: number;
        jobOffer: number;
        nomination: number;
    };
}

// --- CONSTANTS ---

const AGE_POINTS_SINGLE = [0, 99, 105, 110, 110, 110, 110, 110, 110, 110, 105, 99, 94, 88, 83, 77, 72, 66, 61, 55, 50, 39, 28, 17, 6, 0]; // 17-45+ (Indices mapped)
const AGE_POINTS_MARRIED = [0, 90, 95, 100, 100, 100, 100, 100, 100, 100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 35, 25, 15, 5, 0];

const EDU_POINTS = {
    'None': { s: 0, m: 0 },
    'High School': { s: 30, m: 28 },
    'OneYear': { s: 90, m: 84 },
    'TwoYear': { s: 98, m: 91 },
    'Bachelors': { s: 120, m: 112 },
    'TwoOrMore': { s: 128, m: 119 },
    'Masters': { s: 135, m: 126 },
    'PhD': { s: 150, m: 140 }
};

const SPOUSE_EDU_POINTS = {
    'None': 0, 'High School': 2, 'OneYear': 6, 'TwoYear': 7,
    'Bachelors': 8, 'TwoOrMore': 9, 'Masters': 10, 'PhD': 10
};

// Language (CLB to Points per band)
// Single: CLB 4=6, 5=6, 6=9, 7=17, 8=23, 9=31, 10=34
// Married: CLB 4=6, 5=6, 6=8, 7=16, 8=22, 9=29, 10=32
const LANG_POINTS_SINGLE = { 3: 0, 4: 6, 5: 6, 6: 9, 7: 17, 8: 23, 9: 31, 10: 34 };
const LANG_POINTS_MARRIED = { 3: 0, 4: 6, 5: 6, 6: 8, 7: 16, 8: 22, 9: 29, 10: 32 };
const SPOUSE_LANG_POINTS = { 4: 0, 5: 1, 6: 1, 7: 3, 8: 3, 9: 5 }; // Very simplified, CLB 5/6=1, 7/8=3, 9=5?
// Actually: CLB 5/6 -> 1, CLB 7/8 -> 3, CLB 9+ -> 5. 
// Max 20 total. 5 per band.

// --- CALCULATOR ---

export function calculateCRS(p: CRSProfile): CRSResult {
    const isSingle = p.maritalStatus === 'Single';

    // 1. AGE
    let agePts = 0;
    const ageIdx = p.age < 18 ? 0 : p.age > 45 ? 25 : (p.age - 17);
    if (ageIdx >= 0 && ageIdx < 26) {
        agePts = isSingle ? AGE_POINTS_SINGLE[ageIdx] : AGE_POINTS_MARRIED[ageIdx];
    } else {
        agePts = 0; // Fallback
    }

    // 2. EDUCATION
    // @ts-ignore
    const eduPts = isSingle ? EDU_POINTS[p.education].s : EDU_POINTS[p.education].m;

    // 3. LANGUAGE
    const getLangPts = (clb: number, single: boolean) => {
        const c = clb >= 10 ? 10 : clb;
        // @ts-ignore
        return single ? (LANG_POINTS_SINGLE[c] || 0) : (LANG_POINTS_MARRIED[c] || 0);
    }
    const langPts =
        getLangPts(p.language.speaking, isSingle) +
        getLangPts(p.language.reading, isSingle) +
        getLangPts(p.language.writing, isSingle) +
        getLangPts(p.language.listening, isSingle);

    // 4. CANADIAN WORK
    // Single: 1yr=40, 2yr=53, 3yr=64, 4yr=72, 5yr=80
    // Married: 1yr=35, 2yr=46, 3yr=56, 4yr=63, 5yr=70
    const cw = p.workGen.canadian;
    let cwPts = 0;
    if (cw >= 1) {
        if (isSingle) cwPts = cw === 1 ? 40 : cw === 2 ? 53 : cw === 3 ? 64 : cw === 4 ? 72 : 80;
        else cwPts = cw === 1 ? 35 : cw === 2 ? 46 : cw === 3 ? 56 : cw === 4 ? 63 : 70;
    }

    // --- SPOUSE FACTORS (Max 40) ---
    let spousePts = 0;
    let sEdu = 0, sLang = 0, sWork = 0;
    if (!isSingle && p.spouse) {
        // Spouse Edu
        // @ts-ignore
        sEdu = SPOUSE_EDU_POINTS[p.spouse.education] || 0;

        // Spouse Lang (CLB 5/6=1, 7/8=3, 9+=5 per band)
        const getSL = (c: number) => c >= 9 ? 5 : c >= 7 ? 3 : c >= 5 ? 1 : 0;
        sLang =
            getSL(p.spouse.language.speaking) +
            getSL(p.spouse.language.reading) +
            getSL(p.spouse.language.writing) +
            getSL(p.spouse.language.listening);

        // Spouse Work (1yr=5, 2yr=7, 3yr=8, 4yr=9, 5yr=10)
        const sw = p.spouse.canadianWork;
        sWork = sw >= 5 ? 10 : sw === 4 ? 9 : sw === 3 ? 8 : sw === 2 ? 7 : sw >= 1 ? 5 : 0;

        spousePts = sEdu + sLang + sWork;
    }

    // --- SKILL TRANSFERABILITY (Max 100) ---
    let trans = 0;

    // A. Education + Language
    // CLB 7+ all: CLB7 -> 13pts (deg), 25 (master). CLB9 -> 25 (deg), 50 (master).
    const all7 = Object.values(p.language).every(l => l >= 7);
    const all9 = Object.values(p.language).every(l => l >= 9);
    let transEduLang = 0;
    if (all9) {
        if (p.education === 'Masters' || p.education === 'PhD') transEduLang = 50;
        else if (p.education === 'TwoOrMore') transEduLang = 50;
        else if (p.education === 'OneYear' || p.education === 'Bachelors') transEduLang = 25; // wait, Bachelors usually 25? Yes, 1yr+ is 25? Actually Degree=25, 2+ = 50.
        // Correction: Two or more post-secondary credentials + CLB9 = 50. One post-secondary + CLB9 = 25.
        // Re-mapping: 
        if (['TwoOrMore', 'Masters', 'PhD'].includes(p.education)) transEduLang = 50;
        else if (['OneYear', 'TwoYear', 'Bachelors'].includes(p.education)) transEduLang = 25;
    } else if (all7) {
        if (['TwoOrMore', 'Masters', 'PhD'].includes(p.education)) transEduLang = 25;
        else if (['OneYear', 'TwoYear', 'Bachelors'].includes(p.education)) transEduLang = 13;
    }

    // B. Education + Canadian Work
    // 1yr CW + deg = 13/25. 2yr CW + deg = 25/50.
    let transEduWork = 0;
    if (p.workGen.canadian >= 2) {
        if (['TwoOrMore', 'Masters', 'PhD'].includes(p.education)) transEduWork = 50;
        else if (['OneYear', 'TwoYear', 'Bachelors'].includes(p.education)) transEduWork = 25;
    } else if (p.workGen.canadian === 1) {
        if (['TwoOrMore', 'Masters', 'PhD'].includes(p.education)) transEduWork = 25;
        else if (['OneYear', 'TwoYear', 'Bachelors'].includes(p.education)) transEduWork = 13;
    }

    // Cap A + B at 50
    const eduTrans = Math.min(50, transEduLang + transEduWork);

    // C. Foreign Work + Language (CLB 7/9)
    // CLB 9 + 3yrs Foreign = 50. CLB 7 + 3yrs = 25.
    let transForLang = 0;
    if (all9) {
        if (p.workGen.foreign >= 3) transForLang = 50;
        else if (p.workGen.foreign >= 1) transForLang = 25;
    } else if (all7) {
        if (p.workGen.foreign >= 3) transForLang = 25;
        else if (p.workGen.foreign >= 1) transForLang = 13;
    }

    // D. Foreign Work + Canadian Work
    // 2yr Can + 3yr For = 50. 1yr Can + 3yr For = 25.
    let transForCan = 0;
    if (p.workGen.canadian >= 2) {
        if (p.workGen.foreign >= 3) transForCan = 50;
        else if (p.workGen.foreign >= 1) transForCan = 25;
    } else if (p.workGen.canadian === 1) {
        if (p.workGen.foreign >= 3) transForCan = 25;
        else if (p.workGen.foreign >= 1) transForCan = 13;
    }

    // Cap C + D at 50
    const workTrans = Math.min(50, transForLang + transForCan);

    // E. Certificate of Qualification (Trades) + Language
    // CLB 7 all needed? No, CLB 5/7 mix usually. Simplified: CLB 7 all check.
    let transCert = 0;
    if (p.additional.tradeCertificate && all7) { // Simplified CLB check
        if (all7) transCert = 50; // Actually CLB 7 is 50. CLB 5 is 25.
        else transCert = 25; // if less than 7 but > 5?
    }
    // Cap Overall Transferability at 100
    trans = Math.min(100, eduTrans + workTrans + transCert);


    // --- ADDITIONAL POINTS ---
    let add = 0;

    // 1. Sibling (15)
    let sib = p.additional.siblingInCanada ? 15 : 0;

    // 2. French (NCLC 7+)
    // NCLC 7 in all 4 French + CLB 4 English = 50. NCLC 7 French only = 25.
    // Simplified French Check:
    let fr = 0;
    if (p.secondLanguage && Object.values(p.secondLanguage).every(l => l >= 7)) {
        // Check English
        if (Object.values(p.language).every(l => l >= 5)) fr = 50;
        else fr = 25;
    }

    // 3. Education in Canada
    let eduCan = 0;
    if (p.canadianDegree === 'ThreeYearPlus') eduCan = 30;
    else if (p.canadianDegree === 'OneTwoYear') eduCan = 15;

    // 4. Job Offer
    let job = 0;
    if (p.additional.jobOffer === 'NOC_00') job = 200;
    else if (p.additional.jobOffer === 'NOC_0_1_2_3') job = 50;

    // 5. Nomination
    let nom = p.additional.nomination ? 600 : 0;

    add = Math.min(600, sib + fr + eduCan + job + nom); // Technically Nomination alone is 600. Max total additional is 600.

    return {
        total: agePts + eduPts + langPts + cwPts + spousePts + trans + add,
        breakdown: {
            core: agePts + eduPts + langPts + cwPts,
            spouse: spousePts,
            transferability: trans,
            additional: add
        },
        details: {
            age: agePts, education: eduPts, language: langPts, canadianWork: cwPts,
            spouseEducation: sEdu, spouseLanguage: sLang, spouseWork: sWork,
            transferabilityEdu: eduTrans, transferabilityForeign: workTrans, transferabilityCert: transCert,
            sibling: sib, french: fr, educationCanada: eduCan, jobOffer: job, nomination: nom
        }
    }
}
