
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Eye, EyeOff, Stamp, MoreHorizontal } from 'lucide-react'
import { ImmigrationServiceForm } from '@/components/admin/ImmigrationServiceForm'
import { toggleServiceStatus } from '@/actions/immigration-admin'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ImmigrationAdminClient({ initialServices }: { initialServices: any[] }) {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingService, setEditingService] = useState<any>(null)

    const handleEdit = (service: any) => {
        setEditingService(service)
        setIsFormOpen(true)
    }

    const handleAddNew = () => {
        setEditingService(null)
        setIsFormOpen(true)
    }

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            await toggleServiceStatus(id, currentStatus)
        } catch (error) {
            console.error('Failed to toggle status', error)
            alert('Failed to update status')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Immigration Services</h1>
                    <p className="text-muted-foreground">Manage visa types, pricing, and requirements.</p>
                </div>
                <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Service
                </Button>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Service Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Processing</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialServices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No services found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialServices.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell>
                                        <Badge variant={service.is_active ? 'default' : 'secondary'}>
                                            {service.is_active ? 'Active' : 'Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Stamp className="h-4 w-4 text-muted-foreground" />
                                            {service.title}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{service.code}</TableCell>
                                    <TableCell>
                                        {service.currency === 'USD' ? '$' : service.currency} {service.price}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {service.processing_time}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEdit(service)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleToggle(service.id, service.is_active)}>
                                                    {service.is_active ? (
                                                        <>
                                                            <EyeOff className="mr-2 h-4 w-4 text-red-500" />
                                                            <span className="text-red-500">Deactivate</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="mr-2 h-4 w-4 text-green-600" />
                                                            <span className="text-green-600">Activate</span>
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {isFormOpen && (
                <ImmigrationServiceForm
                    key={editingService?.id || 'new'}
                    service={editingService}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>
    )
}
