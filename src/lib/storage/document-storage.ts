/**
 * Supabase Storage Configuration and Helper Functions
 * For deal document management
 */

import { createClient } from '@/lib/supabase/client'


export const STORAGE_BUCKET = 'deal-docs-private'

export const DOCUMENT_TAGS = [
    'Bill of Lading',
    'Commercial Invoice',
    'PSIC',
    'Weight Slip',
    'Bill of Entry',
    'Packing List',
    'Certificate of Origin',
    'Insurance Certificate',
    'Quality Certificate',
    'Other'
] as const

export type DocumentTag = typeof DOCUMENT_TAGS[number]

export const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.ms-excel', // xls
] as const

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export interface UploadDocumentParams {
    dealId: string
    file: File
    documentTag: DocumentTag
    notes?: string
}

export interface DocumentMetadata {
    id: string
    deal_id: string
    file_name: string
    file_path: string
    file_size: number
    file_type: string
    document_tag: DocumentTag
    uploaded_by: string
    uploaded_at: string
    notes?: string
    version: number
    is_current: boolean
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
        }
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
        return {
            valid: false,
            error: 'Invalid file type. Allowed: PDF, JPG, PNG, Excel'
        }
    }

    return { valid: true }
}

/**
 * Generate storage path for document
 */
export function generateStoragePath(dealId: string, fileName: string): string {
    const timestamp = Date.now()
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    return `${dealId}/${timestamp}-${sanitizedName}`
}

/**
 * Upload document to Supabase Storage
 */
export async function uploadDocument(
    params: UploadDocumentParams,
    userId: string
): Promise<{ success: boolean; data?: DocumentMetadata; error?: string }> {
    const { dealId, file, documentTag, notes } = params

    try {
        // Validate file
        const validation = validateFile(file)
        if (!validation.valid) {
            return { success: false, error: validation.error }
        }

        const supabase = createClient()

        // Generate storage path
        const storagePath = generateStoragePath(dealId, file.name)

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(storagePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Storage upload error:', uploadError)
            return { success: false, error: uploadError.message }
        }

        // Create metadata record
        const { data: metadataData, error: metadataError } = await supabase
            .from('deal_documents')
            .insert({
                deal_id: dealId,
                file_name: file.name,
                file_path: uploadData.path,
                file_size: file.size,
                file_type: file.type,
                document_tag: documentTag,
                uploaded_by: userId,
                notes: notes || null
            })
            .select()
            .single() as any

        if (metadataError) {
            // Rollback: delete uploaded file
            await supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
            console.error('Metadata creation error:', metadataError)
            return { success: false, error: metadataError.message }
        }

        return { success: true, data: metadataData }
    } catch (error) {
        console.error('Upload document error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed'
        }
    }
}

/**
 * Get signed URL for downloading document
 */
export async function getDocumentDownloadUrl(
    filePath: string
): Promise<{ url?: string; error?: string }> {
    try {
        const supabase = createClient()

        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .createSignedUrl(filePath, 3600) // 1 hour expiry

        if (error) {
            return { error: error.message }
        }

        return { url: data.signedUrl }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Failed to generate URL'
        }
    }
}

/**
 * Delete document (admin only)
 */
export async function deleteDocument(
    documentId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = createClient()

        // Get document metadata
        const { data: doc, error: fetchError } = await supabase
            .from('deal_documents')
            .select('file_path')
            .eq('id', documentId)
            .single() as any

        if (fetchError || !doc) {
            return { success: false, error: 'Document not found' }
        }

        // Delete from storage
        const { error: storageError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([doc.file_path])

        if (storageError) {
            console.warn('Storage deletion warning:', storageError)
            // Continue anyway to delete metadata
        }

        // Delete metadata
        const { error: deleteError } = await supabase
            .from('deal_documents')
            .delete()
            .eq('id', documentId)

        if (deleteError) {
            return { success: false, error: deleteError.message }
        }

        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Delete failed'
        }
    }
}

/**
 * Get all documents for a deal
 */
export async function getDealDocuments(
    dealId: string
): Promise<{ documents?: DocumentMetadata[]; error?: string }> {
    try {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('deal_documents')
            .select(`
        *,
        uploader:profiles!uploaded_by(
          full_name,
          email
        )
      `)
            .eq('deal_id', dealId)
            .eq('is_current', true)
            .order('uploaded_at', { ascending: false })

        if (error) {
            return { error: error.message }
        }

        return { documents: data as any }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Failed to fetch documents'
        }
    }
}

/**
 * Check if deal has required document
 */
export async function hasRequiredDocument(
    dealId: string,
    documentTag: DocumentTag
): Promise<boolean> {
    try {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('deal_documents')
            .select('id')
            .eq('deal_id', dealId)
            .eq('document_tag', documentTag)
            .eq('is_current', true)
            .single()

        return !!data && !error
    } catch {
        return false
    }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get icon for document tag
 */
export function getDocumentIcon(tag: DocumentTag): string {
    const iconMap: Record<DocumentTag, string> = {
        'Bill of Lading': '🚢',
        'Commercial Invoice': '📄',
        'PSIC': '📋',
        'Weight Slip': '⚖️',
        'Bill of Entry': '🏛️',
        'Packing List': '📦',
        'Certificate of Origin': '🌍',
        'Insurance Certificate': '🛡️',
        'Quality Certificate': '✅',
        'Other': '📁'
    }
    return iconMap[tag] || '📁'
}
