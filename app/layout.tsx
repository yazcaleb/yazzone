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
        url: `${baseUrl}/og`,
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
    images: [`${baseUrl}/og`],
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
    'Yagiz Celebi',
    'Yağız Çelebi',
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
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0e' },
  ],
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

      <body className="antialiased font-sans">
        <a id="top" aria-hidden="true" />
        <main className="min-w-0 px-6 pt-16 pb-14 sm:pt-28 sm:pb-24">
          {children}
        </main>
      </body>
    </html>
  )
}
