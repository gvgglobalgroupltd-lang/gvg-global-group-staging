'use client'

import { useState } from 'react'
import { MessageCircle, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface WhatsAppRegion {
    name: string
    flag: string
    number: string
    message: string
}

export function WhatsAppWidget() {
    const [isOpen, setIsOpen] = useState(false)

    const regions: WhatsAppRegion[] = [
        {
            name: 'USA / Canada',
            flag: '🇺🇸',
            number: '+1-XXX-XXX-XXXX', // Replace with actual number
            message: 'Hello! I would like to inquire about your services.'
        },
        {
            name: 'India',
            flag: '🇮🇳',
            number: '+91-XXXXX-XXXXX', // Replace with actual number
            message: 'Hello! I would like to inquire about your services.'
        },
        {
            name: 'UAE / Middle East',
            flag: '🇦🇪',
            number: '+971-XX-XXX-XXXX', // Replace with actual number
            message: 'Hello! I would like to inquire about your services.'
        },
        {
            name: 'Africa',
            flag: '🇿🇦',
            number: '+27-XX-XXX-XXXX', // Replace with actual number
            message: 'Hello! I would like to inquire about your services.'
        }
    ]

    const departments = [
        {
            name: 'Metals Trading',
            message: 'Hi! I am interested in metals trading services.'
        },
        {
            name: 'IT Consulting',
            message: 'Hi! I would like to discuss IT consulting services.'
        },
        {
            name: 'General Inquiry',
            message: 'Hello! I have a general inquiry.'
        }
    ]

    const openWhatsApp = (number: string, message: string) => {
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${number.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
        window.open(whatsappUrl, '_blank')
        setIsOpen(false)
    }

    return (
        <>
            {/* Floating Button */}
            <div className="fixed bottom-6 right-6 z-50">
                {isOpen && (
                    <Card className="mb-4 w-80 shadow-2xl animate-in slide-in-from-bottom-5">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-t-lg text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />
                                    <div>
                                        <p className="font-semibold">Chat with us</p>
                                        <p className="text-xs text-green-100">We reply instantly</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="hover:bg-green-800 p-1 rounded transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 max-h-96 overflow-y-auto">
                            {/* Department Quick Actions */}
                            <div className="mb-4">
                                <p className="text-sm font-semibold mb-2 text-muted-foreground">Quick Contact:</p>
                                <div className="space-y-2">
                                    {departments.map((dept) => (
                                        <button
                                            key={dept.name}
                                            onClick={() => openWhatsApp(regions[0].number, dept.message)}
                                            className="w-full text-left p-3 rounded-lg border hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
                                        >
                                            <p className="font-semibold text-sm">{dept.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Regional Numbers */}
                            <div>
                                <p className="text-sm font-semibold mb-2 text-muted-foreground">Select Your Region:</p>
                                <div className="space-y-2">
                                    {regions.map((region) => (
                                        <button
                                            key={region.name}
                                            onClick={() => openWhatsApp(region.number, region.message)}
                                            className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-green-50 dark:hover:bg-green-950 transition-colors group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{region.flag}</span>
                                                <div className="text-left">
                                                    <p className="font-semibold text-sm">{region.name}</p>
                                                    <p className="text-xs text-muted-foreground">{region.number}</p>
                                                </div>
                                            </div>
                                            <MessageCircle className="h-4 w-4 text-green-600 group-hover:scale-110 transition-transform" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 text-center text-xs text-muted-foreground">
                                <p>Available 24/7 for your convenience</p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Main Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                    aria-label="WhatsApp Contact"
                >
                    {isOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 fill-current group-hover:animate-pulse"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                    )}
                </button>
            </div>
        </>
    )
}
