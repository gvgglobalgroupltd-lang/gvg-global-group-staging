// Language Test to CLB Conversion Utilities

export type TestType = 'IELTS' | 'CELPIP' | 'PTE'

// IELTS to CLB Conversion
export function ieltsToCLB(score: number, skill: 'speaking' | 'reading' | 'writing' | 'listening'): number {
    // Listening
    if (skill === 'listening') {
        if (score >= 8.5) return 10
        if (score >= 8.0) return 9
        if (score >= 7.5) return 9
        if (score >= 6.0) return 8
        if (score >= 5.5) return 7
        if (score >= 5.0) return 6
        if (score >= 4.5) return 5
        return 4
    }

    // Reading
    if (skill === 'reading') {
        if (score >= 8.0) return 10
        if (score >= 7.0) return 9
        if (score >= 6.5) return 8
        if (score >= 6.0) return 7
        if (score >= 5.0) return 6
        if (score >= 4.0) return 5
        if (score >= 3.5) return 4
        return 4
    }

    // Writing
    if (skill === 'writing') {
        if (score >= 7.5) return 10
        if (score >= 7.0) return 9
        if (score >= 6.5) return 8
        if (score >= 6.0) return 7
        if (score >= 5.5) return 6
        if (score >= 5.0) return 5
        if (score >= 4.0) return 4
        return 4
    }

    // Speaking
    if (skill === 'speaking') {
        if (score >= 7.5) return 10
        if (score >= 7.0) return 9
        if (score >= 6.5) return 8
        if (score >= 6.0) return 7
        if (score >= 5.5) return 6
        if (score >= 5.0) return 5
        if (score >= 4.0) return 4
        return 4
    }

    return 4
}

// CELPIP (scores are already CLB-aligned, 1-12 scale)
export function celpipToCLB(score: number): number {
    // CELPIP scores directly correspond to CLB levels
    return Math.min(Math.max(score, 4), 12)
}

// PTE to CLB Conversion (approximate mapping)
export function pteToCLB(score: number, skill: 'speaking' | 'reading' | 'writing' | 'listening'): number {
    // Speaking
    if (skill === 'speaking') {
        if (score >= 88) return 10
        if (score >= 84) return 9
        if (score >= 76) return 8
        if (score >= 68) return 7
        if (score >= 59) return 6
        if (score >= 51) return 5
        if (score >= 42) return 4
        return 4
    }

    // Listening
    if (skill === 'listening') {
        if (score >= 88) return 10
        if (score >= 82) return 9
        if (score >= 71) return 8
        if (score >= 60) return 7
        if (score >= 50) return 6
        if (score >= 39) return 5
        if (score >= 28) return 4
        return 4
    }

    // Reading
    if (skill === 'reading') {
        if (score >= 88) return 10
        if (score >= 78) return 9
        if (score >= 69) return 8
        if (score >= 60) return 7
        if (score >= 51) return 6
        if (score >= 42) return 5
        if (score >= 33) return 4
        return 4
    }

    // Writing
    if (skill === 'writing') {
        if (score >= 88) return 10
        if (score >= 79) return 9
        if (score >= 69) return 8
        if (score >= 60) return 7
        if (score >= 51) return 6
        if (score >= 41) return 5
        if (score >= 32) return 4
        return 4
    }

    return 4
}

// Generate score options for dropdown
export function getScoreOptions(testType: TestType, skill: string): { value: string; label: string; clb: number }[] {
    if (testType === 'CELPIP') {
        return Array.from({ length: 9 }, (_, i) => {
            const score = i + 4
            return { value: score.toString(), label: `${score}`, clb: score }
        })
    }

    if (testType === 'IELTS') {
        const scores = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0]
        return scores.map(score => ({
            value: score.toString(),
            label: score.toFixed(1),
            clb: ieltsToCLB(score, skill as any)
        }))
    }

    if (testType === 'PTE') {
        const scores = Array.from({ length: 59 }, (_, i) => i + 30) // 30-90
        return scores.filter(s => s % 5 === 0 || [42, 51, 59, 68, 76, 84, 88].includes(s)).map(score => ({
            value: score.toString(),
            label: score.toString(),
            clb: pteToCLB(score, skill as any)
        }))
    }

    return []
}
