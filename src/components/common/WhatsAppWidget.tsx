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
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                    aria-label="WhatsApp Contact"
                >
                    {isOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <MessageCircle className="h-6 w-6 group-hover:animate-pulse" />
                    )}
                </button>

                {/* Notification Badge */}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                        !
                    </div>
                )}
            </div>
        </>
    )
}
