"use client"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/forms/ContactForm"
import { MessageSquarePlus } from "lucide-react"

export function QuickQuoteWidget() {
    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:block">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        className="h-auto py-4 px-1 rounded-l-lg rounded-r-none bg-primary hover:bg-primary/90 text-white shadow-lg writing-mode-vertical"
                        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                    >
                        <MessageSquarePlus className="w-5 h-5 mb-2 rotate-90" />
                        Get a Quote
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                    <SheetHeader className="mb-6 text-left">
                        <SheetTitle className="text-2xl font-bold">Request a Quote</SheetTitle>
                        <SheetDescription>
                            Tell us what you're looking for (Buy/Sell) and we'll get back to you with today's best rates.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="px-1">
                        {/* We use the existing form but strip its outer styling via CSS if needed, 
                            or just accept it. The form has its own padding/border. */}
                        <div className="[&>form]:shadow-none [&>form]:border-none [&>form]:p-0">
                            <ContactForm />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
