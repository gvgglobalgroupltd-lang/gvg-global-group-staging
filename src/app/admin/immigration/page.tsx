
import { getAdminImmigrationServices } from '@/actions/immigration-admin'
import { ImmigrationAdminClient } from '@/components/admin/ImmigrationAdminClient'

export default async function ImmigrationAdminPage() {
    const services = await getAdminImmigrationServices() || []

    return (
        <ImmigrationAdminClient initialServices={services} />
    )
}
