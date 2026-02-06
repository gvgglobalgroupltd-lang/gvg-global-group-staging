'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Search, ArrowRight } from 'lucide-react'

// Simplified Data for MVP - In real app, this would be a larger DB or API
const PNP_DATA = [
    {
        province: 'Ontario (OINP)',
        streams: [
            { name: 'Human Capital Priorities', focus: ['Tech', 'Healthcare', 'Trades'] },
            { name: 'Tech Draws', focus: ['Tech', 'Software', 'Engineering'] }
        ]
    },
    {
        province: 'British Columbia (BC PNP)',
        streams: [
            { name: 'BC Tech', focus: ['Tech', 'IT', 'Media'] },
            { name: 'Healthcare Professional', focus: ['Healthcare', 'Doctors', 'Nurses'] }
        ]
    },
    {
        province: 'Alberta (AAIP)',
        streams: [
            { name: 'Alberta Opportunity Stream', focus: ['General', 'Trades', 'Hospitality'] },
            { name: 'Tech Pathway', focus: ['Tech', 'IT'] }
        ]
    },
    {
        province: 'Saskatchewan (SINP)',
        streams: [
            { name: 'Occupations In-Demand', focus: ['Agriculture', 'Trades', 'Construction'] },
            { name: 'Tech Talent Pathway', focus: ['Tech'] }
        ]
    }
]

export function PNPFinder() {
    const [occupation, setOccupation] = useState('')
    const [results, setResults] = useState<typeof PNP_DATA>([])
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = () => {
        setHasSearched(true)
        if (!occupation) {
            setResults([])
            return
        }

        const filtered = PNP_DATA.filter(p =>
            p.streams.some(s =>
                s.focus.some(f => f.toLowerCase().includes(occupation.toLowerCase())) ||
                (occupation === 'All' ? true : false)
            )
        )
        setResults(filtered)
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900 border-slate-800 text-white text-center">
                <h2 className="text-2xl font-bold mb-4">Find Your Province</h2>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                    Select your occupation field to see which Provincial Nominee Programs (PNPs) might be targeting your skills.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Select value={occupation} onValueChange={setOccupation}>
                        <SelectTrigger className="bg-slate-950 border-slate-700 h-11">
                            <SelectValue placeholder="Select Job Sector" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-white">
                            <SelectItem value="Tech">Tech & IT</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Trades">Skilled Trades</SelectItem>
                            <SelectItem value="Agriculture">Agriculture</SelectItem>
                            <SelectItem value="Construction">Construction</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleSearch} size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-11 px-8">
                        <Search className="w-4 h-4 mr-2" /> Find
                    </Button>
                </div>
            </Card>

            {hasSearched && (
                <div className="grid md:grid-cols-2 gap-6">
                    {results.length > 0 ? (
                        results.map((prov) => (
                            <Card key={prov.province} className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-indigo-500" />
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{prov.province}</h3>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-3">
                                    {prov.streams.map(stream => (
                                        <div key={stream.name} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600 dark:text-slate-300">{stream.name}</span>
                                            <div className="flex gap-1">
                                                {stream.focus.filter(f => !occupation || f.toLowerCase().includes(occupation.toLowerCase())).map(tag => (
                                                    <Badge key={tag} variant="secondary" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-2 text-center text-slate-500 py-12">
                            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No specific streams found for this selection directly in our simplified database.</p>
                            <p className="text-sm">Try broader searches or contact us for a detailed assessment.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
