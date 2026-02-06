export type CandidateProfile = {
    // Personal
    age: number;
    maritalStatus: 'Single' | 'Married';

    // Education
    educationLevel: 'High School' | 'OneYear' | 'TwoYear' | 'Bachelors' | 'Masters' | 'PhD';
    fieldOfStudy: 'STEM_Health_Trades' | 'Business_Admin' | 'Arts_Humanities' | 'Other'; // Critical for OINP
    canadianEducation: {
        province: string; // 'Ontario', 'BC', etc.
        level: string;
        completed: boolean;
    };

    // Language
    clbEnglish: { l: number, r: number, w: number, s: number };
    clbFrench: { l: number, r: number, w: number, s: number };

    // Work Experience
    workExperience: {
        canadian: number; // Years
        foreign: number;
        province: string;
        currentJobOffer: 'None' | 'Teer0123' | 'Teer45';
        jobOfferProvince: string;
        jobOfferWage: number; // Hourly
        jobOfferNoc: string; // 'Tech', 'Health', 'Construction', 'Other'
        workHistory: {
            years: number;
            noc: string;
            earnings: number; // Annual
        }[];
    };

    // Connections / Regional
    connections: {
        relativeInProvince: string[]; // ['Ontario', 'Manitoba']
        friendInProvince: string[]; // ['Manitoba']
        pastStudy: string[]; // Provinces
        pastWork: string[]; // Provinces
    };

    intentProvinces: string[]; // ['Ontario', 'BC']
}

export type ProgramResult = {
    province: string;
    stream: string;
    score: number;
    maxScore: number;
    eligible: boolean;
    drawProbability: 'High' | 'Medium' | 'Low' | 'None';
    drawCutoff?: number;
    warnings: string[]; // "Requires Job Offer", "Requires CLB 7"
    checklist: string[]; // List of specific document keys
}
