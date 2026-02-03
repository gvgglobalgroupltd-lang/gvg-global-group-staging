'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, File, X, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    uploadDocument,
    validateFile,
    DOCUMENT_TAGS,
    type DocumentTag,
    formatFileSize
} from '@/lib/storage/document-storage'
import { useToast } from '@/hooks/use-toast'

interface DocumentUploaderProps {
    dealId: string
    userId: string
    onUploadComplete: () => void
}

export function DocumentUploader({ dealId, userId, onUploadComplete }: DocumentUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [documentTag, setDocumentTag] = useState<DocumentTag | ''>('')
    const [notes, setNotes] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0])
        }
    }, [])

    const handleFileSelect = (file: File) => {
        const validation = validateFile(file)
        if (!validation.valid) {
            toast({
                title: 'Invalid File',
                description: validation.error,
                variant: 'destructive'
            })
            return
        }
        setSelectedFile(file)
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!selectedFile || !documentTag) {
            toast({
                title: 'Missing Information',
                description: 'Please select a file and document type',
                variant: 'destructive'
            })
            return
        }

        setIsUploading(true)
        setUploadProgress(0)

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => Math.min(prev + 10, 90))
        }, 200)

        try {
            const result = await uploadDocument(
                {
                    dealId,
                    file: selectedFile,
                    documentTag: documentTag as DocumentTag,
                    notes: notes || undefined
                },
                userId
            )

            clearInterval(progressInterval)
            setUploadProgress(100)

            if (result.success) {
                toast({
                    title: 'Upload Successful',
                    description: `${selectedFile.name} has been uploaded`
                })

                // Reset form
                setSelectedFile(null)
                setDocumentTag('')
                setNotes('')
                setUploadProgress(0)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }

                // Notify parent
                onUploadComplete()
            } else {
                throw new Error(result.error || 'Upload failed')
            }
        } catch (error) {
            clearInterval(progressInterval)
            toast({
                title: 'Upload Failed',
                description: error instanceof Error ? error.message : 'Please try again',
                variant: 'destructive'
            })
        } finally {
            setIsUploading(false)
            setTimeout(() => setUploadProgress(0), 1000)
        }
    }

    const handleRemoveFile = () => {
        setSelectedFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Document</h3>

            <div className="space-y-4">
                {/* Drag & Drop Area */}
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-muted-foreground/25 hover:border-primary/50'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium mb-2">
                        Drag and drop your file here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                        PDF, JPG, PNG, Excel • Max 10MB
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        Browse Files
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx"
                        onChange={handleFileInputChange}
                        disabled={isUploading}
                    />
                </div>

                {/* Selected File */}
                {selectedFile && (
                    <Alert>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <File className="h-4 w-4 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium">{selectedFile.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(selectedFile.size)}
                                    </p>
                                </div>
                            </div>
                            {!isUploading && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleRemoveFile}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </Alert>
                )}

                {/* Document Type */}
                <div className="space-y-2">
                    <Label htmlFor="documentTag">Document Type *</Label>
                    <Select
                        value={documentTag}
                        onValueChange={(value) => setDocumentTag(value as DocumentTag)}
                        disabled={isUploading}
                    >
                        <SelectTrigger id="documentTag">
                            <SelectValue placeholder="Select document type..." />
                        </SelectTrigger>
                        <SelectContent>
                            {DOCUMENT_TAGS.map((tag) => (
                                <SelectItem key={tag} value={tag}>
                                    {tag}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                        id="notes"
                        placeholder="Add any additional notes about this document..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        disabled={isUploading}
                        rows={3}
                    />
                </div>

                {/* Upload Progress */}
                {isUploading && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Uploading...</span>
                            <span className="font-medium">{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                    </div>
                )}

                {/* Upload Button */}
                <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || !documentTag || isUploading}
                    className="w-full"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                        </>
                    ) : uploadProgress === 100 ? (
                        <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Uploaded
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Document
                        </>
                    )}
                </Button>
            </div>
        </Card>
    )
}
