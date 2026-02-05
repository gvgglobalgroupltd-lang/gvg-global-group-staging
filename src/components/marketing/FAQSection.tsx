"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const faqs = [
    {
        question: "What types of scrap metal do you purchase?",
        answer: "We purchase a wide range of ferrous and non-ferrous metals including Copper (Millberry, Berry, Birch), Aluminum (Taint/Tabor, Tense, 6063), Brass (Honey, Ocean), Stainless Steel (304, 316), and Heavy Melting Steel (HMS 1&2)."
    },
    {
        question: "Do you handle international logistics?",
        answer: "Yes, we manage standard logistics including shipping, customs clearance documentation, and inland transport coordination. We typically trade on CIF or FOB terms depending on client preference."
    },
    {
        question: "What are your standard payment terms?",
        answer: "For new partners, we typically operate on LC (Letter of Credit) or CAD (Cash Against Documents). For long-term partners, we offer flexible terms subject to credit approval and trade history."
    },
    {
        question: "What is your minimum order quantity (MOQ)?",
        answer: "Our typical MOQ is one 20ft container (approx. 20-25 MT for heavy metals). For high-value materials like Copper, we can discuss smaller trial lots."
    },
    {
        question: "Are you ISO certified?",
        answer: "Yes, GVG Global Group is ISO 9001:2015 certified for Quality Management Systems, ensuring consistent service and reliable sourcing."
    }
]

export function FAQSection() {
    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-12 gap-12">
                    <div className="md:col-span-4">
                        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-8">
                            Common questions about our trading process, logistics, and terms.
                        </p>
                        <Button asChild>
                            <Link href="/contact">Still have questions?</Link>
                        </Button>
                    </div>

                    <div className="md:col-span-8">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, idx) => (
                                <AccordionItem key={idx} value={`item-${idx}`}>
                                    <AccordionTrigger className="text-left text-lg font-medium text-slate-800 dark:text-slate-200">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}
