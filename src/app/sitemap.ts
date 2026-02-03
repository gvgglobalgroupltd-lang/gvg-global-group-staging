import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://gvgglobal.com' // Replace with your actual domain

    const staticPages = [
        '',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
        '/cookie-policy',
        '/disclaimer',
        '/tech',
    ]

    const staticEntries = staticPages.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : route === '/tech' ? 0.9 : 0.7,
    }))

    return staticEntries
}
