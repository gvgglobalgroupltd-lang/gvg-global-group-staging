'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Search, CheckCircle2, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

// Comprehensive PNP Data with ALL provinces and detailed eligibility logic
const ALL_PROVINCES = [
    {
        province: 'Ontario (OINP)',
        color: 'emerald',
        streams: [
            {
                name: 'Human Capital Priorities',
                focus: ['Tech', 'Healthcare', 'Business'],
                requirements: {
                    crs: '450+',
                    language: 'CLB 7+',
                    education: 'Bachelor+',
                    special: 'Express Entry profile required'
                },
                why: 'Ontario targets high-skilled professionals in tech and business sectors through Express Entry aligned draws.'
            },
            {
                name: 'Masters Graduate',
                focus: ['Any NOC', 'Recent Graduates'],
                requirements: {
                    crs: 'N/A',
                    language: 'CLB 7+',
                    education: 'Ontario Masters Degree (1 year)',
                    special: 'Must apply within 2 years of graduation'
                },
                why: 'Perfect for international students who completed a Masters in Ontario with no work experience needed.'
            },
            {
                name: 'Tech Draws',
                focus: ['Tech', 'Software', 'Engineering', 'Data Science'],
                requirements: {
                    crs: '450-470',
                    language: 'CLB 7+',
                    education: 'Bachelor+',
                    special: 'Must have Tech NOC (21xxx, 22xxx)'
                },
                why: 'Ontario regularly conducts tech-specific draws with lower CRS thresholds for software developers and IT professionals.'
            }
        ]
    },
    {
        province: 'British Columbia (BC PNP)',
        color: 'blue',
        streams: [
            {
                name: 'BC Tech',
                focus: ['Tech', 'IT', 'Software', 'Media'],
                requirements: {
                    crs: 'N/A',
                    language: 'CLB 4-7 (varies by NOC)',
                    education: 'Bachelor+',
                    special: 'Job offer from BC Tech employer (29 eligible NOCs)'
                },
                why: 'BC prioritizes tech workers with job offers through weekly draws with faster processing times.'
            },
            {
                name: 'Healthcare Professional',
                focus: ['Healthcare', 'Doctors', 'Nurses', 'Allied Health'],
                requirements: {
                    crs: 'N/A',
                    language: 'CLB 7+',
                    education: 'Relevant Health Credential',
                    special: 'Job offer + Provincial health authority approval'
                },
                why: 'BC has critical healthcare shortages and offers direct pathways for licensed health professionals.'
            },
            {
                name: 'International Graduate',
                focus: ['Any NOC', 'Recent Graduates'],
                requirements: {
                    crs: 'N/A',
                    language: 'CLB 4+',
                    education: 'BC Post-Secondary (2 years)',
                    special: 'Job offer within 3 years of graduation'
                },
                why: 'BC offers streamlined pathways for graduates of BC institutions with relevant job offers.'
            }
        ]
    },
    {
        province: 'Alberta (AAIP)',
        color: 'orange',
        streams: [
            {
                name: 'Alberta Opportunity Stream',
                focus: ['General', 'Trades', 'Hospitality', 'Retail'],
                requirements: {
                    crs: 'N/A',
                    language: 'CLB 4-5',
                    education: 'High School+',
                    special: '12-18 months Alberta work experience'
                },
                why: 'Alberta prioritizes workers already employed in the province across all skill levels including TEER 4/5.'
            },
            {
                name: 'Tech Pathway',
                focus: ['Tech', 'IT', 'Software'],
                requirements: {
                    crs: '300+',
                    language: 'CLB 6+',
                    education: 'Bachelor+',
                    special: 'Express Entry profile + Tech NOC'
                },
                why: 'Alberta accelerates nominations for tech workers in the Express Entry pool with competitive salaries.'
            }
        ]
    },
    {
        province: 'Saskatchewan (SINP)',
        color: 'yellow',
        streams: [
            {
                name: 'Occupations In-Demand',
                focus: ['Agriculture', 'Trades', 'Construction', 'Transport'],
                requirements: {
                    crs: 'N/A',
                    language: 'CLB 4+',
                    education: 'Trade Certification or 1-year program',
                    special: '1 year work experience in last 10 years (NOC list)'
                },
                why: 'Saskatchewan targets workers in agriculture and trades that match provincial labour market needs.'
            },
            {
                name: 'Tech Talent Pathway',
                focus: ['Tech', 'Software', 'Engineering'],
                requirements: {
                    crs: '68+',
                    language: 'CLB 5+',
                    education: 'Bachelor+',
                    special: 'No job offer needed for tech NOCs'
                },
                why: 'SINP offers a rare no-job-offer pathway specifically for tech professionals with Express Entry profiles.'
            }
        ]
    },
    {
        province: 'Manitoba (MPNP)',
        color: 'red',
        streams: [
            {
                name: 'Skilled Worker in Manitoba',
                focus: ['General', 'Trades', 'Healthcare'],
                requirements: {
                    crs: 'N/A',
                    language: 'CLB 4+',
                    education: 'High School+',
                    special: '6 months Manitoba work + job offer OR connection'
                },
                why: 'Manitoba prioritizes workers with existing ties (work, study, relatives) to the province.'
            },
            {
                name: 'International Education Stream',
                focus: ['Recent Graduates', 'Any NOC'],
                requirements: {
                    crs: 'N/A',
                    language: 'CLB 6+',
                    education: 'Manitoba Diploma/Degree (1 year+)',
                    special: 'Job offer aligned with studies'
                },
                why: 'Manitoba offers guaranteed nominations for graduates of  Manitoba institutions with relevant job offers.'
            }
        ]
    },
    {
        province: 'Nova Scotia (NSNP)',
        color: 'purple',
        streams: [
            {
                name: 'NS Experience: Express Entry',
                focus: ['General', 'Any NOC TEER 0-3'],
                requirements: {
                    crs: '67+',
                    language: 'CLB 7+',
                    education: 'High School+',
                    special: '1 year Nova Scotia work experience'
                },
                why: 'Nova Scotia prioritizes workers already contributing to the provincial economy through work experience.'
            },
            {
                name: 'Labour Market Priorities',
                focus: ['Healthcare', 'French', 'Trades'],
                requirements: {
                    crs: '400+',
                    language: 'CLB 7 EN + CLB 6 FR (for French draws)',
                    education: 'Bachelor+',
                    special: 'Express Entry + Letter of Interest from NS'
                },
                why: 'NS conducts targeted draws for French speakers and specific occupations like nurses and carpenters.'
            },
            {
                name: 'Occupations in Demand',
                focus: ['Construction', 'Transport', 'Food Service', 'Patient Care'],
                requirements: {
                    crs: 'N/A',
                    language: 'CLB 4+',
                    education: 'High School',
                    special: 'NS job offer (TEER 4/5 eligible NOCs)'
                },
                why: 'Nova Scotia offers pathways for semi-skilled workers in critical sectors like healthcare support and trades.'
            }
        ]
    },
    {
        province: 'New Brunswick (NBPNP)',
        color: 'teal',
        streams: [
            {
                name: 'Express Entry Labour Market Stream',
                focus: ['General', 'Healthcare', 'IT'],
                requirements: {
                    crs: '67+',
                    language: 'CLB 7+',
                    education: 'Bachelor+',
                    special: 'Connection to NB (work, study, family, visit)'
                },
                why: 'New Brunswick requires a genuine connection to the province but offers nominations with lower CRS requirements.'
            }
        ]
    },
    {
        province: 'Newfoundland & Labrador (NLPNP)',
        color: 'indigo',
        streams: [
            {
                name: 'Priority Skills NL',
                focus: ['Tech', 'Healthcare', 'Aquaculture', 'Agriculture'],
                requirements: {
                    crs: '67+',
                    language: 'CLB 5+',
                    education: 'Bachelor or Trade Cert',
                    special: 'Express Entry + Priority occupation'
                },
                why: 'NL targets specific  industries critical to provincial growth with streamlined Express Entry nominations.'
            }
        ]
    },
    {
        province: 'Prince Edward Island (PEI PNP)',
        color: 'pink',
        streams: [
            {
                name: 'PEI Express Entry',
                focus: ['General', 'Trades', 'Healthcare'],
                requirements: {
                    crs: '67+',
                    language: 'CLB 6+',
                    education: 'High School+',
                    special: 'Connection to PEI (work, education, family)'
                },
                why: 'PEI offers lower competition draws for candidates with genuine ties to the smallest province.'
            }
        ]
    },
    {
        province: 'Yukon (YNP)',
        color: 'cyan',
        streams: [
            {
                name: 'Yukon Skilled Worker',
                focus: ['Any NOC', 'Critical Worker'],
                requirements: {
                    crs: 'N/A',
                    language: 'CLB 4+',
                    education: 'High School',
                    special: 'Job offer + 6 months Yukon work'
                },
                why: 'Yukon has labour shortages across all sectors and offers fast nominations for workers already employed in the territory.'
            }
        ]
    }
]

export function PNPFinder() {
    const [occupation, setOccupation] = useState('')
    const [hasJobOffer, setHasJobOffer] = useState<string>('')
    const [hasSearched, setHasSearched] = useState(false)
    const [expandedProvince, setExpandedProvince] = useState<string | null>(null)

    const handleSearch = () => {
        setHasSearched(true)
    }

    // Filter provinces based on search criteria
    const filteredProvinces = hasSearched ? ALL_PROVINCES.map(province => {
        const matchingStreams = province.streams.filter(stream => {
            // If no occupation selected, show all
            if (!occupation || occupation === 'All') return true

            // Check if stream focuses on this occupation
            return stream.focus.some(f => f.toLowerCase().includes(occupation.toLowerCase()))
        })

        return { ...province, streams: matchingStreams, matchCount: matchingStreams.length }
    }).filter(p => p.matchCount > 0) : []

    const nonMatchingProvinces = hasSearched ? ALL_PROVINCES.filter(province =>
        !filteredProvinces.some(fp => fp.province === province.province)
    ) : []

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-slate-900 border-slate-800 text-white">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4">Find Your Best Province Match</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto">
                        See ALL Canadian provinces and territories with detailed eligibility criteria and explanations.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Your Occupation/Sector</label>
                        <Select value={occupation} onValueChange={setOccupation}>
                            <SelectTrigger className="bg-slate-950 border-slate-700 h-11">
                                <SelectValue placeholder="Select Job Sector" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                <SelectItem value="All">Show All Provinces</SelectItem>
                                <SelectItem value="Tech">Tech & 🔮 IT</SelectItem>
                                <SelectItem value="Healthcare">Healthcare & Medical</SelectItem>
                                <SelectItem value="Trades">Skilled Trades</SelectItem>
                                <SelectItem value="Agriculture">Agriculture & Food</SelectItem>
                                <SelectItem value="Construction">Construction</SelectItem>
                                <SelectItem value="Business">Business & Finance</SelectItem>
                                <SelectItem value="Transport">Transportation</SelectItem>
                                <SelectItem value="Recent Graduates">Recent Graduate</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Current Situation</label>
                        <Select value={hasJobOffer} onValueChange={setHasJobOffer}>
                            <SelectTrigger className="bg-slate-950 border-slate-700 h-11">
                                <SelectValue placeholder="Select Situation" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                <SelectItem value="none">No Job Offer</SelectItem>
                                <SelectItem value="offer">Have Job Offer</SelectItem>
                                <SelectItem value="working">Currently Working in Canada</SelectItem>
                                <SelectItem value="student">International Student</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <Button onClick={handleSearch} size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-11 px-12">
                        <Search className="w-4 h-4 mr-2" /> Analyze My Options
                    </Button>
                </div>
            </Card>

            {hasSearched && (
                <div className="space-y-6">
                    {/* MATCHING PROVINCES */}
                    {filteredProvinces.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <h3 className="text-xl font-bold">Best Match Provinces ({filteredProvinces.length})</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredProvinces.map((prov) => (
                                    <ProvinceCard key={prov.province} province={prov} expanded={expandedProvince === prov.province} onToggle={() => setExpandedProvince(expandedProvince === prov.province ? null : prov.province)} occupation={occupation} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* NON-MATCHING BUT AVAILABLE PROVINCES */}
                    {nonMatchingProvinces.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-slate-400" />
                                <h3 className="text-lg font-semibold text-slate-600">Other Available Provinces</h3>
                                <p className="text-sm text-slate-500">(No direct match for "{occupation}" but may have general streams)</p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                {nonMatchingProvinces.map((prov) => (
                                    <Card key={prov.province} className="p-4 bg-slate-50 border-slate-200 opacity-60 hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <h4 className="font-semibold text-sm">{prov.province}</h4>
                                        </div>
                                        <p className="text-xs text-slate-500">{prov.streams.length} stream(s) available</p>
                                        <p className="text-xs text-slate-600 mt-1">Focus: {prov.streams[0]?.focus.slice(0, 2).join(', ')}</p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {filteredProvinces.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="font-semibold">No exact match found for your criteria</p>
                            <p className="text-sm">Try selecting "Show All Provinces" or different occupation</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function ProvinceCard({ province, expanded, onToggle, occupation }: any) {
    return (
        <Card className={`p-6 bg-white border-2 border-${province.color}-200 hover:border-${province.color}-400 transition-all cursor-pointer group`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-${province.color}-100 flex items-center justify-center`}>
                        <MapPin className={`w-6 h-6 text-${province.color}-600`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900">{province.province}</h3>
                        <p className="text-xs text-slate-500">{province.streams.length} relevant stream(s)</p>
                    </div>
                </div>
                <Badge className={`bg-${province.color}-100 text-${province.color}-700`}>
                    {province.matchCount} Match{province.matchCount > 1 ? 'es' : ''}
                </Badge>
            </div>

            <div className="space-y-3 mb-4">
                {province.streams.slice(0, expanded ? undefined : 2).map((stream: any, idx: number) => (
                    <Collapsible key={idx}>
                        <div className="border rounded-lg p-3 hover:bg-slate-50 transition-colors">
                            <CollapsibleTrigger asChild>
                                <div className="flex justify-between items-start cursor-pointer">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-sm text-slate-900">{stream.name}</h4>
                                            <ChevronDown className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {stream.focus.filter((f: string) => !occupation || occupation === 'All' || f.toLowerCase().includes(occupation.toLowerCase())).slice(0, 3).map((tag: string) => (
                                                <Badge key={tag} variant="secondary" className={`bg-${province.color}-50 text-${province.color}-700 text-xs`}>
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-3 space-y-2">
                                <div className="bg-blue-50 border-l-4 border-blue-500 pl-3 py-2 text-xs">
                                    <p className="font-semibold text-blue-900 mb-1">Why This Province?</p>
                                    <p className="text-blue-800">{stream.why}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="font-semibold block text-slate-600">CRS Score:</span>
                                        <span className="text-slate-900">{stream.requirements.crs}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold block text-slate-600">Language:</span>
                                        <span className="text-slate-900">{stream.requirements.language}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-semibold block text-slate-600">Education:</span>
                                        <span className="text-slate-900">{stream.requirements.education}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-semibold block text-slate-600">Special:</span>
                                        <span className="text-slate-900">{stream.requirements.special}</span>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </div>
                    </Collapsible>
                ))}
            </div>

            {province.streams.length > 2 && (
                <Button variant="ghost" size="sm" className="w-full text-slate-600 hover:text-slate-900" onClick={onToggle}>
                    {expanded ? <><ChevronUp className="w-4 h-4 mr-1" /> Show Less</> : <><ChevronDown className="w-4 h-4 mr-1" /> Show {province.streams.length - 2} More Stream(s)</>}
                </Button>
            )}
        </Card>
    )
}
