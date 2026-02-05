import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''

    // Define the immigration subdomain (adjust for localhost vs production)
    // For localhost, we might use "immigration.localhost:3000"
    // For prod, "immigration.gvgglobalgroupltd.com"
    const isImmigrationSubdomain = hostname.startsWith('immigration.')

    if (isImmigrationSubdomain) {
        // Rewrite to the /immigration folder
        // Only rewrite if the path doesn't already start with /immigration (avoid loops/redundancy)
        if (!url.pathname.startsWith('/immigration')) {
            url.pathname = `/immigration${url.pathname}`
            return NextResponse.rewrite(url)
        }
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
