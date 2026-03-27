import Link from 'next/link'
import { getEssays } from './utils'
import { formatDate } from '../lib/format'
import { baseUrl } from 'app/sitemap'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Essays',
  description: 'Essays by Yaz Caleb on leverage, systems, and building things that matter.',
  alternates: {
    canonical: `${baseUrl}/essays`,
  },
  openGraph: {
    title: 'Essays | Yaz Caleb',
    description: 'Essays by Yaz Caleb on leverage, systems, and building things that matter.',
    url: `${baseUrl}/essays`,
    type: 'website',
    images: [{ url: `${baseUrl}/yazzone-og.png`, width: 1200, height: 630, alt: 'Essays by Yaz Caleb' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essays | Yaz Caleb',
    description: 'Essays by Yaz Caleb on leverage, systems, and building things that matter.',
    creator: '@yazcal',
    images: [`${baseUrl}/yazzone-og.png`],
  },
}

export default function EssaysPage() {
  const essays = getEssays()
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1
      }
      return 1
    })

  return (
    <div className="max-w-[560px] mx-auto font-serif text-[14px] leading-[1.38] text-zinc-900 dark:text-zinc-100 min-h-[calc(100vh-5rem)] flex flex-col">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Essays by Yaz Caleb',
            itemListElement: essays.map((essay, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${baseUrl}/essays/${essay.slug}`,
              name: essay.metadata.title,
            })),
          }),
        }}
      />
      <div className="mb-7">
        <Link
          href="/"
          className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-[12px]"
        >
          &larr; yaz
        </Link>
      </div>

      <h1 className="underline mb-7 text-[14px] font-normal leading-[1.38]">essays</h1>

      <div className="space-y-5 mb-10">
        {essays.map((essay) => (
          <div key={essay.slug}>
            <div className="flex items-baseline justify-between gap-4">
              <Link
                href={`/essays/${essay.slug}`}
                className="hover:underline underline-offset-2"
              >
                &gt; {essay.metadata.title}
              </Link>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0 tabular-nums">
                {formatDate(essay.metadata.publishedAt, true)}
              </span>
            </div>
            <p className="text-[12px] text-zinc-400 dark:text-zinc-500 mt-0.5 pl-4 line-clamp-1">
              {essay.metadata.summary}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      <footer className="flex items-center gap-4 text-[12px] text-zinc-400 dark:text-zinc-500 mt-1">
        <a
          href="/feed.xml"
          className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          rss
        </a>
      </footer>
    </div>
  )
}
