'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, Trash2, FileText, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
    getDealDocuments,
    getDocumentDownloadUrl,
    deleteDocument,
    getDocumentIcon,
    formatFileSize,
    type DocumentMetadata
} from '@/lib/storage/document-storage'
import { useToast } from '@/hooks/use-toast'

interface DocumentListProps {
    dealId: string
    isAdmin?: boolean
    refreshTrigger?: number
}

interface GroupedDocuments {
    [tag: string]: DocumentMetadata[]
}

export function DocumentList({ dealId, isAdmin = false, refreshTrigger = 0 }: DocumentListProps) {
    const [documents, setDocuments] = useState<DocumentMetadata[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [downloadingId, setDownloadingId] = useState<string | null>(null)
    const { toast } = useToast()

    const loadDocuments = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        const result = await getDealDocuments(dealId)

        if (result.error) {
            setError(result.error)
            setDocuments([])
        } else {
            setDocuments(result.documents || [])
        }

        setIsLoading(false)
    }, [dealId])

    useEffect(() => {
        loadDocuments()
    }, [dealId, refreshTrigger, loadDocuments])

    const handleDownload = async (doc: DocumentMetadata) => {
        setDownloadingId(doc.id)

        try {
            const result = await getDocumentDownloadUrl(doc.file_path)

            if (result.error) {
                throw new Error(result.error)
            }

            if (result.url) {
                // Open in new tab
                window.open(result.url, '_blank')

                toast({
                    title: 'Download Started',
                    description: `Opening ${doc.file_name}`
                })
            }
        } catch (error) {
            toast({
                title: 'Download Failed',
                description: error instanceof Error ? error.message : 'Please try again',
                variant: 'destructive'
            })
        } finally {
            setDownloadingId(null)
        }
    }

    const handleDelete = async (docId: string, fileName: string) => {
        try {
            const result = await deleteDocument(docId)

            if (result.success) {
                toast({
                    title: 'Document Deleted',
                    description: `${fileName} has been removed`
                })
                loadDocuments() // Refresh list
            } else {
                throw new Error(result.error || 'Delete failed')
            }
        } catch (error) {
            toast({
                title: 'Delete Failed',
                description: error instanceof Error ? error.message : 'Please try again',
                variant: 'destructive'
            })
        }
    }

    // Group documents by tag
    const groupedDocuments: GroupedDocuments = documents.reduce((acc, doc) => {
        if (!acc[doc.document_tag]) {
            acc[doc.document_tag] = []
        }
        acc[doc.document_tag].push(doc)
        return acc
    }, {} as GroupedDocuments)

    if (isLoading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </Card>
        )
    }

    if (documents.length === 0) {
        return (
            <Card className="p-6">
                <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">
                        No documents uploaded yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Upload your first document using the form above
                    </p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                    Deal Documents ({documents.length})
                </h3>
            </div>

            <div className="space-y-4">
                {Object.entries(groupedDocuments).map(([tag, docs]) => (
                    <div key={tag} className="space-y-2">
                        {/* Tag Header */}
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <span className="text-xl">{getDocumentIcon(tag as any)}</span>
                            <h4 className="font-semibold text-sm">{tag}</h4>
                            <Badge variant="secondary" className="ml-auto">
                                {docs.length}
                            </Badge>
                        </div>

                        {/* Documents in this tag */}
                        <div className="space-y-2 pl-6">
                            {docs.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium truncate">
                                                {doc.file_name}
                                            </p>
                                            {doc.document_tag === 'Bill of Entry' && (
                                                <Badge variant="default" className="text-xs">
                                                    Required
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                            <span>{formatFileSize(doc.file_size)}</span>
                                            <span>•</span>
                                            <span>
                                                {new Date(doc.uploaded_at).toLocaleDateString()}
                                            </span>
                                            {(doc as any).uploader?.full_name && (
                                                <>
                                                    <span>•</span>
                                                    <span>{(doc as any).uploader.full_name}</span>
                                                </>
                                            )}
                                        </div>
                                        {doc.notes && (
                                            <p className="text-xs text-muted-foreground mt-1 italic">
                                                {doc.notes}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownload(doc)}
                                            disabled={downloadingId === doc.id}
                                        >
                                            {downloadingId === doc.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Download className="h-4 w-4" />
                                            )}
                                        </Button>

                                        {isAdmin && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Document</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete "{doc.file_name}"?
                                                            This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(doc.id, doc.file_name)}
                                                            className="bg-destructive hover:bg-destructive/90"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}
