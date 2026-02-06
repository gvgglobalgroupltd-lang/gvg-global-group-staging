export type ExperienceValidationInput = {
    hoursPerWeek: number;
    weeksWorked: number;
    isSeasonal: boolean;
    isStudent: boolean;
    isSelfEmployed: boolean;
    isCoop: boolean;
    programTarget: 'CEC' | 'FSW' | 'FST';
};

export type ExperienceValidationResult = {
    eligibleHours: number;
    eligibleYears: number;
    isContinuous: boolean; // Relevant for FSW
    isValidForProgram: boolean;
    warnings: string[];
    breakdown: string;
};

export function validateWorkExperience(input: ExperienceValidationInput): ExperienceValidationResult {
    const { hoursPerWeek, weeksWorked, isSeasonal, isStudent, isSelfEmployed, isCoop, programTarget } = input;
    let warnings: string[] = [];
    let isValid = true;

    // 1. Cap Hours per Week (Max 30 counted)
    // "You can work more than 30 hours... but the maximum you can count is 30 hours/week"
    const effectiveHoursPerWeek = Math.min(hoursPerWeek, 30);
    const totalHours = effectiveHoursPerWeek * weeksWorked;

    // 2. Minimum Hours for 1 Year
    // 1560 hours is the magic number
    const years = totalHours / 1560;

    let eligibleYears = parseFloat(years.toFixed(2));
    // Cap at actual duration? No, 30hrs/week for 52 weeks = 1.0. 
    // If they worked 15hrs for 104 weeks = 1.0. 

    // 3. Program Specific Exclusions

    // CEC Exclusions
    if (programTarget === 'CEC') {
        if (isStudent) {
            isValid = false;
            warnings.push("Work experience gained while a full-time student does not count for CEC.");
        }
        if (isCoop) {
            isValid = false;
            warnings.push("Co-op work experience does not count for CEC.");
        }
        if (isSelfEmployed) {
            isValid = false;
            warnings.push("Self-employment generally does not count for CEC (unless medical/specific exceptions).");
        }
    }

    // FSW Exclusions
    if (programTarget === 'FSW') {
        // Continuous Check
        // Seasonal work often has gaps. If seasonal, warn about continuity.
        if (isSeasonal) {
            warnings.push("Seasonal work may break 'Continuous Employment' requirement (no gaps allowed).");
        }
        // Student work CAN count for FSW if continuous, paid, and meets description.
        // But usually hard to prove continuity with study.
        if (isStudent) {
            warnings.push("Student work counts for FSW only if continuous and paid. Ensure no gaps.");
        }
    }

    // Work Permit / General
    if (isSeasonal && input.programTarget === 'CEC') {
        // Seasonal allowed for CEC if total hours met? Yes, gaps allowed.
        // But hard to accumulate 1560 hrs.
    }

    // 4. Overtime Warning
    if (hoursPerWeek > 30) {
        warnings.push(`You worked ${hoursPerWeek} hrs/week, but IRCC only counts 30 hrs/week.`);
    }

    return {
        eligibleHours: totalHours,
        eligibleYears: isValid ? eligibleYears : 0,
        isContinuous: !isSeasonal, // Simplification
        isValidForProgram: isValid,
        warnings,
        breakdown: `Counted ${effectiveHoursPerWeek} hrs/week for ${weeksWorked} weeks. Total: ${totalHours} eligible hours.`
    };
}
