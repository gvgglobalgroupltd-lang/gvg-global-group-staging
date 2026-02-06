export type LegalProfile = {
    hasCriminalRecord: boolean;
    convictionDate?: Date; // For Deemed Rehab
    sentenceCompletedDate?: Date;
    offenseType?: 'DUI' | 'Theft' | 'Assault' | 'Fraud' | 'Other';
    offenseMaxSentenceInCanada?: number; // 10 years = Serious Criminality

    hasMedicalCondition: boolean;
    conditionType?: 'Chronic' | 'Developmental' | 'MentalHealth' | 'Other';
    annualTreatmentCost?: number; // Threshold ~$27,000

    hasRefusalHistory: boolean;
    refusalReason?: 'Misrepresentation' | 'Funds' | 'ReferenceLetter' | 'Other';

    isFlagpolingConsidered: boolean;
}

export type DefenseResult = {
    inadmissibility: {
        isInadmissible: boolean;
        ground: string; // 'Serious Criminality', 'Medical Excessive Demand'
        severity: 'Critical' | 'High' | 'Medium';
    };
    defenseStrategy: {
        title: string;
        arguments: string[]; // "Argue Deemed Rehabilitation via s.36(2)"
        recommendedDocuments: string[]; // "Legal Opinion Letter", "Medical Cost Projection Specialist Report"
    }[];
    probabilityOfSuccess: 'Low' | 'Medium' | 'High';
    lawyerNote: string;
}

export function analyzeLegalDefense(p: LegalProfile): DefenseResult {
    let result: DefenseResult = {
        inadmissibility: { isInadmissible: false, ground: '', severity: 'Medium' },
        defenseStrategy: [],
        probabilityOfSuccess: 'High',
        lawyerNote: "Standard Application Risk"
    };

    const YEAR_MS = 365 * 24 * 60 * 60 * 1000;
    const now = new Date();

    // 1. CRIMINALITY CHECK (S.36 IRPA)
    if (p.hasCriminalRecord && p.sentenceCompletedDate) {
        const timeSinceSentence = (now.getTime() - p.sentenceCompletedDate.getTime()) / YEAR_MS;
        const isSerious = (p.offenseMaxSentenceInCanada || 0) >= 10; // e.g., Fraud > $5k, DUI (post-2018)

        if (isSerious) {
            result.inadmissibility = { isInadmissible: true, ground: 'Serious Criminality (s.36(1))', severity: 'Critical' };
            result.probabilityOfSuccess = 'Low';
            result.lawyerNote = "Serious Criminality bars 'Deemed Rehabilitation'. Must apply for Criminal Rehabilitation.";

            if (timeSinceSentence >= 5) {
                result.defenseStrategy.push({
                    title: "Application for Criminal Rehabilitation",
                    arguments: ["Demonstrate 5 years of stability since sentence completion", "Prove low risk to Canadian society"],
                    recommendedDocuments: ["Form IMM 1444", "Police Certificates (All countries)", "Reference Letters regarding character"]
                });
            } else {
                result.defenseStrategy.push({
                    title: "Temporary Resident Permit (TRP) - Hardship Argument",
                    arguments: ["Need to enter Canada outweighs risk", "Compelling economic or family reason"],
                    recommendedDocuments: ["TRP Application", "Proof of significant benefit to Canada"]
                });
            }
        } else {
            // Non-Serious (s.36(2))
            if (timeSinceSentence >= 10) {
                result.inadmissibility = { isInadmissible: false, ground: 'Deemed Rehabilitated', severity: 'Medium' };
                result.defenseStrategy.push({
                    title: "Deemed Rehabilitation Defense",
                    arguments: ["10 years passed since sentence completion", "No subsequent offenses"],
                    recommendedDocuments: ["Legal Opinion Letter citing s.18(2) IRPR regulations"]
                });
            } else if (timeSinceSentence >= 5) {
                result.inadmissibility = { isInadmissible: true, ground: 'Criminality (Rehab eligible)', severity: 'Medium' };
                result.defenseStrategy.push({
                    title: "Apply for Rehabilitation",
                    arguments: ["5 years passed", "Good moral character"],
                    recommendedDocuments: ["Form IMM 1444"]
                });
            }
        }
    }

    // 2. MEDICAL INADMISSIBILITY (S.38 IRPA)
    if (p.hasMedicalCondition) {
        const THRESHOLD_2025 = 27162; // CAD/yr
        // Exemptions: Family Spouse/Child, Refugees
        // Assuming Economic Class for this engine (Non-exempt)

        if ((p.annualTreatmentCost || 0) > THRESHOLD_2025) {
            result.inadmissibility = { isInadmissible: true, ground: 'Excessive Demand on Health Services', severity: 'High' };
            result.probabilityOfSuccess = 'Medium';
            result.defenseStrategy.push({
                title: "Procedural Fairness Response - Mitigation Plan",
                arguments: [
                    "Ability to defray costs (private insurance not always accepted but willingness helps)",
                    "Challenge the officer's cost calculation (Fairness Letter)",
                    "Provide specialist report proving lower actual costs than generic average"
                ],
                recommendedDocuments: ["Specialist Medical Report", "Individualized Cost Mitigation Plan"]
            })
        }
    }

    // 3. PRIOR REFUSALS & MISREP (S.40 IRPA)
    if (p.hasRefusalHistory) {
        if (p.refusalReason === 'Misrepresentation') {
            result.inadmissibility = { isInadmissible: true, ground: 'Misrepresentation (5-Year Ban)', severity: 'Critical' };
            result.probabilityOfSuccess = 'Low';
            result.defenseStrategy.push({
                title: "Challenge Finding of Materiality",
                arguments: ["Error was innocent mistake, not fraudulent intent", "Information was not material to the decision"],
                recommendedDocuments: ["Affidavit explaining error", "Proof of attempt to correct"]
            });
        }
        if (p.refusalReason === 'ReferenceLetter') {
            result.defenseStrategy.push({
                title: "Strengthened Reference Letter Strategy",
                arguments: ["Provide notarized colleague affidavits if HR refuses specific duties", "Include pay stubs/T4s to prove employment reality"],
                recommendedDocuments: ["Notarized Supervisor Affidavit", "Pay Stubs", "Explanation Letter"]
            });
        }
    }

    // 4. FLAGPOLING (Procedural)
    if (p.isFlagpolingConsidered) {
        result.defenseStrategy.push({
            title: "Flagpoling Risk Mitigation",
            arguments: ["Ensure strict eligibility before arriving at POE", "POE officers have high discretion - verify quiet hours"],
            recommendedDocuments: ["Complete Application Package printed", "Proof of Status in US (if applicable)"]
        })
    }

    return result;
}
