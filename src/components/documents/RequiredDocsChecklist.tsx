'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { hasRequiredDocument, getDocumentIcon, type DocumentTag } from '@/lib/storage/document-storage'

interface RequiredDocument {
    tag: DocumentTag
    requiredForStatus: string
    description: string
}

const REQUIRED_DOCUMENTS: RequiredDocument[] = [
    {
        tag: 'Bill of Lading',
        requiredForStatus: 'Shipped',
        description: 'Proof of shipment from origin port'
    },
    {
        tag: 'Commercial Invoice',
        requiredForStatus: 'Approved',
        description: 'Invoice from supplier with pricing details'
    },
    {
        tag: 'Bill of Entry',
        requiredForStatus: 'Customs',
        description: 'Required for customs clearance'
    },
    {
        tag: 'Weight Slip',
        requiredForStatus: 'Shipped',
        description: 'Weight verification at origin'
    }
]

interface RequiredDocsChecklistProps {
    dealId: string
    currentStatus: string
    refreshTrigger?: number
}

export function RequiredDocsChecklist({
    dealId,
    currentStatus,
    refreshTrigger = 0
}: RequiredDocsChecklistProps) {
    const [documentStatus, setDocumentStatus] = useState<Record<DocumentTag, boolean>>({} as any)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function checkDocuments() {
            setIsLoading(true)
            const status: Record<string, boolean> = {}

            for (const doc of REQUIRED_DOCUMENTS) {
                const exists = await hasRequiredDocument(dealId, doc.tag)
                status[doc.tag] = exists
            }

            setDocumentStatus(status as any)
            setIsLoading(false)
        }

        checkDocuments()
    }, [dealId, refreshTrigger])

    const getStatusIcon = (tag: DocumentTag) => {
        if (isLoading) {
            return <Circle className="h-5 w-5 text-muted-foreground animate-pulse" />
        }

        return documentStatus[tag] ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
        )
    }

    const missingDocs = REQUIRED_DOCUMENTS.filter((doc) => !documentStatus[doc.tag])
    const isBlocked = missingDocs.some((doc) => {
        // Check if we're trying to reach a status that requires this document
        const statusOrder = ['Draft', 'Approved', 'Shipped', 'Customs', 'Stock', 'Sold']
        const currentIndex = statusOrder.indexOf(currentStatus)
        const requiredIndex = statusOrder.indexOf(doc.requiredForStatus)
        return currentIndex >= requiredIndex
    })

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Required Documents</h3>
                <Badge variant={missingDocs.length === 0 ? 'default' : 'secondary'}>
                    {REQUIRED_DOCUMENTS.length - missingDocs.length} / {REQUIRED_DOCUMENTS.length}
                </Badge>
            </div>

            {isBlocked && (
                <Alert className="mb-4 border-amber-500/50 bg-amber-500/10">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <AlertDescription className="text-amber-700 dark:text-amber-400">
                        <strong>Action Required:</strong> Some required documents are missing for the current deal status.
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-3">
                {REQUIRED_DOCUMENTS.map((doc) => {
                    const isUploaded = documentStatus[doc.tag]
                    const isRequired = currentStatus === doc.requiredForStatus ||
                        (currentStatus === 'Stock' && doc.tag === 'Bill of Entry') ||
                        (currentStatus === 'Sold' && doc.tag === 'Bill of Entry')

                    return (
                        <div
                            key={doc.tag}
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${isUploaded
                                    ? 'bg-green-500/5 border-green-500/20'
                                    : isRequired
                                        ? 'bg-amber-500/5 border-amber-500/20'
                                        : 'bg-muted/30 border-transparent'
                                }`}
                        >
                            {getStatusIcon(doc.tag)}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{getDocumentIcon(doc.tag)}</span>
                                    <p className="text-sm font-medium">{doc.tag}</p>
                                    {isRequired && !isUploaded && (
                                        <Badge variant="destructive" className="text-xs">
                                            Required
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {doc.description}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Required for: <span className="font-medium">{doc.requiredForStatus}</span>
                                </p>
                            </div>
                            {isUploaded && (
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                            )}
                        </div>
                    )
                })}
            </div>

            {missingDocs.length === 0 && !isLoading && (
                <Alert className="mt-4 border-green-500/50 bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700 dark:text-green-400">
                        All required documents have been uploaded!
                    </AlertDescription>
                </Alert>
            )}
        </Card>
    )
}
