import { JetBrains_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import ClientLayout from '@/components/ClientLayout';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrainsMono",
  display: "swap",
});

const myFont = localFont({
  src: '../public/assets/Fonts/FORTE.ttf',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

// ─── Root metadata ────────────────────────────────────────────────────────────
// Strategy: target UAE software developer job market (Dubai, Abu Dhabi, Sharjah)
// + recruiter / HR / LinkedIn discovery keywords.
// Template ensures every page appends " | Aakash Sharma" automatically.
export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'Aakash Sharma | Full-Stack Developer in Dubai, UAE — React, Next.js, Node.js',
    template: '%s | Aakash Sharma',
  },

  description:
    'Aakash Sharma is a full-stack software developer based in Dubai, UAE, ' +
    'specialising in React, Next.js, Node.js, React Native, and Python. ' +
    'Open to software engineer roles in Dubai, Abu Dhabi, and Sharjah. ' +
    'Available for full-time employment and freelance contracts.',

  // ── Keyword strategy ──────────────────────────────────────────────────────
  // Three layers:
  //   1. Role keywords  — what recruiters search (ATS-friendly)
  //   2. Location terms — UAE cities where tech hiring is concentrated
  //   3. Tech stack     — what HR filter tools and LinkedIn Recruiter look for
  keywords: [
    // Role
    'software developer Dubai',
    'software engineer UAE',
    'full stack developer Dubai',
    'full stack developer UAE',
    'React developer Dubai',
    'Next.js developer UAE',
    'Node.js developer Dubai',
    'frontend developer Dubai',
    'backend developer Dubai',
    'web developer Dubai',
    'mobile app developer UAE',
    'React Native developer UAE',
    'JavaScript developer Dubai',
    'Python developer UAE',
    // Location variants
    'software developer Abu Dhabi',
    'software developer Sharjah',
    'software engineer Abu Dhabi',
    'web developer UAE',
    'developer for hire UAE',
    'freelance developer Dubai',
    'freelance web developer UAE',
    // People also search
    'hire software developer UAE',
    'software developer available UAE',
    'expat developer Dubai',
    'Nepali developer UAE',
    // Stack
    'React', 'Next.js', 'Node.js', 'React Native', 'Python',
    'MongoDB', 'Express.js', 'Tailwind CSS', 'TypeScript',
    'REST API', 'GraphQL', 'Docker', 'AWS',
    // Personal brand
    'Aakash Sharma developer',
    'Aakash Sharma Dubai',
    'Aakash Sharma portfolio',
  ],

  authors: [{ name: 'Aakash Sharma', url: SITE_URL }],
  creator: 'Aakash Sharma',
  publisher: 'Aakash Sharma',
  category: 'Technology',
  classification: 'Software Development Portfolio',

  alternates: {
    canonical: SITE_URL,
  },

  // ── Open Graph ────────────────────────────────────────────────────────────
  // Optimised for LinkedIn shares — when recruiters share or view the profile,
  // the OG image + title make a strong first impression.
  openGraph: {
    title: 'Aakash Sharma | Full-Stack Developer in Dubai, UAE',
    description:
      'Full-stack developer (React · Next.js · Node.js · React Native) based in Dubai, UAE. ' +
      '3+ years experience. Open to software engineer roles across Dubai, Abu Dhabi & Sharjah. ' +
      'View projects and get in touch.',
    url: SITE_URL,
    siteName: 'Aakash Sharma — Developer Portfolio',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Aakash Sharma — Full-Stack Developer based in Dubai, UAE',
        type: 'image/png',
      },
    ],
    locale: 'en_AE',      // en_AE = English as used in UAE — important for regional signals
    type: 'website',
  },

  // ── Twitter / X ───────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'Aakash Sharma | Full-Stack Developer in Dubai, UAE',
    description:
      'React · Next.js · Node.js · React Native developer in Dubai, UAE. ' +
      'Open to full-time and freelance opportunities.',
    images: [`${SITE_URL}/og-image.png`],
    creator: '@aakashsharma',
  },

  // ── Crawling ──────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Google Search Console verification ───────────────────────────────────
  // verification: {
  //   google: process.env.GOOGLE_SITE_VERIFICATION || '',
  // },

  applicationName: 'Aakash Sharma Portfolio',
  referrer: 'origin-when-cross-origin',
  formatDetection: { email: false, address: false, telephone: false },

  // ── Geographic targeting ──────────────────────────────────────────────────
  // These meta tags signal to search engines that this content is relevant
  // to UAE-based searches.
  other: {
    'geo.region': 'AE',         // UAE country code
    'geo.placename': 'Dubai',
    'geo.position': '25.2048;55.2708',
    'ICBM': '25.2048, 55.2708',
    'language': 'English',
    'revisit-after': '7 days',
    'rating': 'general',
    // LinkedIn / professional discovery tags
    'profile:first_name': 'Aakash',
    'profile:last_name': 'Sharma',
    'profile:username': 'aakash-sharma',
  },
};

// ─── Structured data (JSON-LD) ────────────────────────────────────────────────
// Google uses structured data for rich results. Three schemas:
//   1. Person       — establishes Aakash as a professional entity
//   2. WebSite      — enables the search box and site links
//   3. BreadcrumbList — helps Google understand site structure
const jsonLd = [
  // ── Person schema ─────────────────────────────────────────────────────────
  // This is what Google uses to populate Knowledge Panels and rich snippets.
  // When recruiters Google "Aakash Sharma developer Dubai", this schema
  // can surface a card with job title, location, and links.
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Aakash Sharma',
    alternateName: ['Aakash Sharma Developer', 'Aakash Sharma Dubai'],
    url: SITE_URL,
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/assets/avatar.png`,
      width: 800,
      height: 800,
    },
    jobTitle: 'Full-Stack Software Developer',
    description:
      'Full-stack software developer specialising in React, Next.js, Node.js, ' +
      'React Native, and Python. Based in Dubai, UAE. Open to software engineer ' +
      'roles across Dubai, Abu Dhabi, and Sharjah.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE',
    },
    // Geographic coordinates — reinforces UAE location signal to Google
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.2048,
      longitude: 55.2708,
    },
    email: 'aakashsharma9855@gmail.com',
    nationality: {
      '@type': 'Country',
      name: 'Nepal',
    },
    sameAs: [
      'https://github.com/aakash-sharma-github',
      'https://linkedin.com/in/aakash-sharma',
      SITE_URL,
    ],
    knowsAbout: [
      'React', 'Next.js', 'Node.js', 'React Native', 'Python',
      'JavaScript', 'TypeScript', 'MongoDB', 'Express.js',
      'REST API Development', 'Mobile App Development',
      'Full-Stack Web Development', 'Docker', 'Cloud Computing',
    ],
    // Work experience as structured data — Google can surface this
    worksFor: {
      '@type': 'Organization',
      name: 'Telcovate Communication Network Solutions',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'AE',
      },
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Parul University',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Gujarat',
        addressCountry: 'IN',
      },
    },
    // Offer/availability — tells Google this person is seeking employment
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Software Development Services',
        description:
          'Full-stack web development, mobile app development, API development, ' +
          'and custom software solutions.',
        areaServed: [
          { '@type': 'City', name: 'Dubai' },
          { '@type': 'City', name: 'Abu Dhabi' },
          { '@type': 'City', name: 'Sharjah' },
          { '@type': 'Country', name: 'United Arab Emirates' },
        ],
      },
    },
  },

  // ── WebSite schema ────────────────────────────────────────────────────────
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Aakash Sharma — Full-Stack Developer Portfolio',
    description:
      'Portfolio and blog of Aakash Sharma, a full-stack developer in Dubai, UAE.',
    publisher: { '@id': `${SITE_URL}/#person` },
    inLanguage: 'en-AE',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },

  // ── ProfilePage schema ────────────────────────────────────────────────────
  // Newer schema type that Google uses specifically for professional profiles.
  // Especially effective when your name is Googled directly.
  {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/#profilepage`,
    url: SITE_URL,
    name: 'Aakash Sharma — Full-Stack Developer in Dubai, UAE',
    dateCreated: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntity: { '@id': `${SITE_URL}/#person` },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      ],
    },
  },
];

export default function RootLayout({ children }) {
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Preconnect for performance (LCP improvement = better Core Web Vitals = better SEO) */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured data — injected as separate <script> tags for clarity */}
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

        {/* PWA / favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1c1c22" />
      </head>
      <body className={jetbrainsMono.variable}>
        <ClientLayout myFont={myFont}>
          {children}
        </ClientLayout>
        {isProduction && <SpeedInsights />}
        {isProduction && <Analytics />}
      </body>
    </html>
  );
}