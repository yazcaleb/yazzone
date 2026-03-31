import './global.css'
import type { Metadata, Viewport } from 'next'
import { Atkinson_Hyperlegible, Literata } from 'next/font/google'
import { baseUrl } from './sitemap'

const atkinson = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
  display: 'swap',
})

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Yaz Caleb',
    template: '%s | Yaz Caleb',
  },
  description: 'Builder. Founder of Veto and Plaw. Essays on AI, infrastructure, and compounding conviction.',
  authors: [{ name: 'Yaz Caleb', url: baseUrl }],
  creator: 'Yaz Caleb',
  openGraph: {
    title: 'Yaz Caleb',
    description: 'Builder. Founder of Veto and Plaw. Essays on AI, infrastructure, and compounding conviction.',
    url: baseUrl,
    siteName: 'Yaz Caleb',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/yazzone-og.png`,
        width: 1200,
        height: 630,
        alt: 'Yaz Caleb',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yaz Caleb',
    description: 'Builder. Founder of Veto and Plaw. Essays on AI, infrastructure, and compounding conviction.',
    creator: '@yazcal',
    images: [`${baseUrl}/yazzone-og.png`],
  },
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
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: '/favicon.ico',
  },
  keywords: [
    'Yaz Caleb',
    'Yaz A. Caleb',
    'Yağız Erkam Çelebi',
    'Yaz Çelebi',
    'Plaw',
    'Veto',
    'programmable law',
    'AI agents',
    'authorization',
    'infrastructure',
    'founder',
    'essays',
  ],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${atkinson.variable} ${literata.variable}`}
    >

      <body className="antialiased max-w-6xl mx-4 sm:mx-8 mt-12 lg:mx-auto font-sans">
        <a id="top" aria-hidden="true" />
        <main className="flex-auto min-w-0 mt-8 flex flex-col px-2 sm:px-4 md:px-8">
          {children}
        </main>
      </body>
    </html>
  )
}
