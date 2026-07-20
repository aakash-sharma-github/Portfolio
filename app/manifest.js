// app/manifest.js — auto-served at /manifest.webmanifest by Next.js

export default function manifest() {
    return {
        name:             'Aakash Sharma',
        short_name:       'Aakash Sharma',
        description:      'Portfolio of Aakash Sharma — full-stack software developer based in Dubai, UAE.',
        start_url:        '/',
        scope:            '/',
        display:          'standalone',
        orientation:      'natural',
        background_color: '#1c1c22',
        theme_color:      '#3F88C5',
        categories:       ['portfolio', 'productivity', 'developer'],

        icons: [
            { src: '/icons/icon-72.png',           sizes: '72x72',   type: 'image/png' },
            { src: '/icons/icon-96.png',           sizes: '96x96',   type: 'image/png' },
            { src: '/icons/icon-128.png',          sizes: '128x128', type: 'image/png' },
            { src: '/icons/icon-144.png',          sizes: '144x144', type: 'image/png' },
            { src: '/icons/icon-152.png',          sizes: '152x152', type: 'image/png' },
            { src: '/icons/icon-192.png',          sizes: '192x192', type: 'image/png', purpose: 'any'      },
            { src: '/icons/icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
            { src: '/icons/icon-384.png',          sizes: '384x384', type: 'image/png' },
            { src: '/icons/icon-512.png',          sizes: '512x512', type: 'image/png', purpose: 'any'      },
            { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],

        screenshots: [
            {
                src: '/screenshots/desktop.png', sizes: '1280x720',
                type: 'image/png', form_factor: 'wide',
                label: 'Aakash Sharma Portfolio — Desktop',
            },
            {
                src: '/screenshots/mobile.png', sizes: '390x844',
                type: 'image/png', form_factor: 'narrow',
                label: 'Aakash Sharma Portfolio — Mobile',
            },
        ],

        shortcuts: [
            {
                name: 'View Portfolio', short_name: 'Portfolio',
                description: 'Browse projects and work',
                url: '/work',
                icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
            },
            {
                name: 'Read Blog', short_name: 'Blog',
                description: 'Read tech articles and tutorials',
                url: '/blog',
                icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
            },
            {
                name: 'Contact Me', short_name: 'Contact',
                description: 'Get in touch for job or freelance opportunities',
                url: '/contact',
                icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
            },
        ],
    };
}
