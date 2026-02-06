import { differenceInDays, addDays, format, isPast, isFuture } from 'date-fns';

export type StatusInput = {
    expiryDate: Date; // Current permit expiry
    hasSubmittedExtension: boolean; // Did they apply before expiry?
    currentLocation: 'InsideCanada' | 'OutsideCanada';
};

export type StatusStrategyResult = {
    statusState: 'Valid' | 'Maintained' | 'RestorationPeriod' | 'OutOfStatus';
    daysRemaining: number;
    actionPlan: string[];
    legalNuances: string[]; // "Loopholes" / Tips
    urgentActionRequired: boolean;
};

export function analyzeStatusStrategy(input: StatusInput): StatusStrategyResult {
    const today = new Date();
    const expiry = new Date(input.expiryDate);
    const diff = differenceInDays(expiry, today); // +ve = Future, -ve = Past

    let result: StatusStrategyResult = {
        statusState: 'Valid',
        daysRemaining: diff,
        actionPlan: [],
        legalNuances: [],
        urgentActionRequired: false
    };

    // 1. FUTURE EXPIRY (Valid)
    if (diff >= 0) {
        result.statusState = input.hasSubmittedExtension ? 'Maintained' : 'Valid';

        if (input.hasSubmittedExtension) {
            result.actionPlan.push("You are on Maintained Status (formerly Implied Status).");
            result.actionPlan.push("You can continue working under the exact same conditions as your original permit.");
            result.legalNuances.push("Do not leave Canada. If you leave, you lose Maintained Status and may not be able to work upon re-entry.");
        } else {
            // Options before expiry
            if (diff < 30) {
                result.urgentActionRequired = true;
                result.actionPlan.push("URGENT: Apply for extension IMMEDIATELY.");
                result.actionPlan.push("IRCC recommends 30 days buffer, but technically you can apply up to the last minute (UTC time). Don't risk it.");
            } else if (diff < 90) {
                result.actionPlan.push("Prepare your extension application now.");
            }

            // Strategy: Bridge to Visitor
            result.legalNuances.push("Strategy: If you don't have an ITA or LMIA yet, apply for a Visitor Record BEFORE expiry to stay legal.");
            result.legalNuances.push("Note: Changing to Visitor stops your ability to work, but keeps you in Canada legally.");
        }
    }
    // 2. PAST EXPIRY (Expired)
    else {
        const daysPast = Math.abs(diff);

        if (input.hasSubmittedExtension) {
            result.statusState = 'Maintained';
            result.daysRemaining = 0; // Indefinite until decision
            result.actionPlan.push("You are legally in Canada on Maintained Status.");
            result.legalNuances.push("Keep proof of your application (AOR) on you at all times.");
        } else {
            // NO Extension submitted. 
            if (daysPast <= 90) {
                result.statusState = 'RestorationPeriod';
                result.urgentActionRequired = true;
                result.daysRemaining = 90 - daysPast;

                result.actionPlan.push(`CRITICAL: You are OUT OF STATUS. You have ${90 - daysPast} days left to apply for Restoration.`);
                result.actionPlan.push("STOP WORKING IMMEDIATELY. You have no authorization to work.");
                result.actionPlan.push("Apply for 'Restoration of Status' + New Permit (Worker/Visitor).");
                result.legalNuances.push("Restoration is not guaranteed. You must explain why you overstayed.");
            } else {
                result.statusState = 'OutOfStatus';
                result.urgentActionRequired = true;
                result.daysRemaining = 0;

                result.actionPlan.push("You are beyond the 90-day restoration period.");
                result.actionPlan.push("You have no legal standing to apply for restoration from inside Canada.");
                result.actionPlan.push("Must leave Canada immediately or face deportation/bans.");
                result.legalNuances.push("Consult a lawyer for TRP (Temporary Resident Permit) only in extreme humanitarian cases.");
            }
        }
    }

    return result;
}
