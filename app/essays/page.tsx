import Link from 'next/link'
import SiteHeader from 'app/components/SiteHeader'
import { getEssays } from './utils'
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
    .filter((e) => !e.metadata.unlisted)
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())

  const years: { year: string; essays: typeof essays }[] = []
  for (const essay of essays) {
    const year = essay.metadata.publishedAt.slice(0, 4)
    const group = years.find((g) => g.year === year)
    if (group) group.essays.push(essay)
    else years.push({ year, essays: [essay] })
  }

  return (
    <div className="mx-auto max-w-[600px] font-serif text-[15px] leading-6 text-graphite">
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

      <SiteHeader />

      <header className="mt-12 mb-16">
        <h1 className="text-[17px] font-medium leading-[26px] text-ink">Essays</h1>
        <p className="mt-1">On leverage, systems, and building things that matter.</p>
      </header>

      {years.map(({ year, essays }) => (
        <section key={year} className="flex flex-col gap-3 border-t border-hairline pt-5 pb-9 sm:flex-row sm:gap-0">
          <h2 className="w-[88px] shrink-0 font-sans text-[14px] leading-6 text-label tabular-nums">{year}</h2>
          <ul className="flex flex-1 flex-col gap-[22px]">
            {essays.map((essay) => (
              <li key={essay.slug}>
                <Link href={`/essays/${essay.slug}`} className="group flex items-start gap-6 hover:no-underline">
                  <span className="flex-1">
                    <span className="block text-ink group-hover:underline group-hover:underline-offset-4">{essay.metadata.title}</span>
                    <span className="mt-0.5 text-[14px] leading-[22px] line-clamp-2">{essay.metadata.summary}</span>
                  </span>
                  <span className="w-14 shrink-0 text-right font-sans text-[14px] leading-6 text-label tabular-nums">
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${essay.metadata.publishedAt}T00:00:00`))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <footer className="flex justify-between border-t border-hairline pt-4 font-sans text-[13px] leading-[18px] text-label">
        <Link href="/" className="hover:text-ink">Home</Link>
        <a href="/feed.xml" className="hover:text-ink">RSS</a>
      </footer>
    </div>
  )
}
