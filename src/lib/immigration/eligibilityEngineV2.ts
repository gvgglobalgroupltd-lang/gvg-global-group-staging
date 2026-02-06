import { CandidateProfile, ProgramResult } from './programs/types';
import { calculateOINP } from './programs/oinp';
import { calculateBCPNP } from './programs/bcpnp';
import { calculateSINP } from './programs/sinp';
import { calculateMPNP } from './programs/mpnp';
import { calculateAAIP, calculateAtlantic } from './programs/aaip_atlantic';
import { calculateNSNP } from './programs/nsnp';

export function calculateAllStreams(profile: CandidateProfile, currentCrs: number): ProgramResult[] {
    let results: ProgramResult[] = [];

    // 1. Run all provincial engines
    results = [
        ...results,
        ...calculateOINP(profile, currentCrs),
        ...calculateBCPNP(profile),
        ...calculateSINP(profile),
        ...calculateMPNP(profile),
        ...calculateAAIP(profile, currentCrs),
        ...calculateNSNP(profile, currentCrs),
        ...calculateAtlantic(profile)
    ];

    // 2. Sort by Probability -> Score
    return results.sort((a, b) => {
        const probMap = { 'High': 3, 'Medium': 2, 'Low': 1, 'None': 0 };
        const pA = probMap[a.drawProbability];
        const pB = probMap[b.drawProbability];

        if (pA !== pB) return pB - pA; // High first
        return b.score - a.score; // Higher score first
    });
}
