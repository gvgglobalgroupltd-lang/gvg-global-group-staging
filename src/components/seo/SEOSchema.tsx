import Script from 'next/script'

interface SEOSchemaProps {
    type?: 'organization' | 'product' | 'service'
}

export function SEOSchema({ type = 'organization' }: SEOSchemaProps) {
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'GVG Global Group',
        description: 'International metals trading and IT consulting services company with operations across USA, Canada, India, UAE, and Africa.',
        url: 'https://gvgglobal.com',
        logo: 'https://gvgglobal.com/logo.png',
        image: 'https://gvgglobal.com/og-image.png',
        foundingDate: '2010',
        email: 'hello@gvgglobal.com',
        telephone: '+1-XXX-XXX-XXXX',
        address: [
            {
                '@type': 'PostalAddress',
                addressCountry: 'US',
                addressLocality: 'Your City',
                addressRegion: 'State',
                streetAddress: 'Your Address'
            },
            {
                '@type': 'PostalAddress',
                addressCountry: 'IN',
                addressLocality: 'Mumbai',
                addressRegion: 'Maharashtra',
                streetAddress: 'Your Address'
            },
            {
                '@type': 'PostalAddress',
                addressCountry: 'AE',
                addressLocality: 'Dubai',
                streetAddress: 'Your Address'
            }
        ],
        sameAs: [
            'https://www.linkedin.com/company/gvgglobal',
            'https://twitter.com/gvgglobal',
            'https://www.facebook.com/gvgglobal'
        ],
        contactPoint: [
            {
                '@type': 'ContactPoint',
                telephone: '+1-XXX-XXX-XXXX',
                contactType: 'customer service',
                areaServed: ['US', 'CA'],
                availableLanguage: ['en']
            },
            {
                '@type': 'ContactPoint',
                telephone: '+91-XXXXX-XXXXX',
                contactType: 'customer service',
                areaServed: ['IN'],
                availableLanguage: ['en', 'hi']
            },
            {
                '@type': 'ContactPoint',
                telephone: '+971-XX-XXX-XXXX',
                contactType: 'customer service',
                areaServed: ['AE'],
                availableLanguage: ['en', 'ar']
            }
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '200',
            bestRating: '5',
            worstRating: '1'
        },
        knowsAbout: [
            'Metals Trading',
            'IT Consulting',
            'ERP Development',
            'Import Export',
            'Logistics',
            'Quality Assurance'
        ]
    }

    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Metals Trading & IT Consulting',
        provider: {
            '@type': 'Organization',
            name: 'GVG Global Group'
        },
        areaServed: {
            '@type': 'Place',
            name: 'Worldwide'
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Metal Trading Services',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Steel Trading',
                        description: 'Import and export of various steel products including HR, CR, and galvanized steel'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Aluminum Trading',
                        description: 'High-quality aluminum products for automotive, aerospace, and construction industries'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'IT Consulting',
                        description: 'Custom ERP development, mobile apps, and quality assurance services'
                    }
                }
            ]
        }
    }

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://gvgglobal.com'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'About',
                item: 'https://gvgglobal.com/about'
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: 'Contact',
                item: 'https://gvgglobal.com/contact'
            }
        ]
    }

    return (
        <>
            {/* Organization Schema */}
            <Script
                id="organization-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema)
                }}
            />

            {/* Service Schema */}
            {type === 'service' && (
                <Script
                    id="service-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(serviceSchema)
                    }}
                />
            )}

            {/* Breadcrumb Schema */}
            <Script
                id="breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema)
                }}
            />
        </>
    )
}
