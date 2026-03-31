import Link from 'next/link'
import { getEssays } from 'app/essays/utils'
import AgeCounter from 'app/components/AgeCounter'
import ContribGraph from 'app/components/ContribGraph'

export const revalidate = 3600

export default function Page() {
  const allEssays = getEssays()
    .filter((e) => !e.metadata.unlisted)
    .sort((a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
    )
    .slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Yaz Caleb',
            alternateName: ['Yaz A. Caleb', 'Yagiz Erkam Celebi'],
            url: 'https://yaz.zone',
            image: 'https://yaz.zone/yaz-latest.webp',
            description: 'Builder. Founder of Veto and Plaw. Essays on AI, infrastructure, and compounding conviction.',
            jobTitle: 'Cofounder & CEO',
            worksFor: { '@type': 'Organization', name: 'Plaw Inc.', url: 'https://plaw.io' },
            sameAs: ['https://x.com/yazcal', 'https://github.com/yazcaleb'],
            birthDate: '2009',
            nationality: ['Turkish', 'Albanian'],
          }),
        }}
      />

      <div className="homepage-minimal max-w-[560px] mx-auto font-serif text-[14px] leading-[1.38] text-zinc-900 dark:text-zinc-100 min-h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="text-[14px] font-normal leading-[1.38]">Hi, I&apos;m Yaz.</h1>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Yaz Caleb / Yaz Celebi / Ya&#287;&#305;z Erkam &Ccedil;elebi</p>
          </div>
          <img
            src="/avatar-192.webp"
            alt="Yaz Caleb"
            width={20}
            height={20}
            className="rounded-[2px] mt-0.5"
            decoding="async"
          />
        </div>

        <div className="mb-6">
          <p>&gt; <AgeCounter /></p>
        </div>

        <p className="mb-1">
          Turkish-Albanian. I like Camus, Orwell, tennis and isolation lifts.
        </p>
        <p className="mb-7">
          but I spend most of my time on authorization for autonomous
          systems &mdash; agents call APIs, move money, sign contracts,
          and nobody has a good answer for who gets to say yes. I think
          the system that acts needs to be accountable before it acts,
          not after.
        </p>

        {/* Now + photo */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-4 mb-8 items-start">
          <div>
            <p className="underline mb-4">now</p>
            <p>
              &gt;{' '}building{' '}
              <a href="https://veto.so" target="_blank" rel="noopener noreferrer">Veto</a>
              <span className="text-zinc-400 dark:text-zinc-500"> &mdash; agent authorization &middot; </span>
              <a href="https://plaw.io" target="_blank" rel="noopener noreferrer">P<span className="text-zinc-400 dark:text-zinc-500">(rogrammable)</span>law, Inc.</a>
            </p>
            <p>&gt; <a href="/can-is-not-may.pdf" target="_blank" rel="noopener noreferrer">Can Is Not May</a><span className="text-zinc-400 dark:text-zinc-500"> &mdash; preprint &middot; ASU</span></p>
            <p>&gt; looking for founding team &mdash; <a href="mailto:team@plaw.io?subject=the%20best%20thing%20I%20ever%20built&amp;body=%0Askip%20the%20resume%20%E2%80%94%20what%20did%20you%20build%2C%20and%20why%20should%20we%20build%20together%3F%0A%0A" className="underline underline-offset-2 decoration-1">team@plaw.io</a></p>
            <p>&gt; raising pre-seed &mdash; <a href="https://cal.com/yaz/bet" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-1">schedule a call</a></p>
          </div>
          <img
            src="/yazpic2-sm.webp"
            alt="Yaz Caleb"
            width={800}
            height={480}
            className="w-full h-auto object-cover object-[center_20%] grayscale contrast-[1.15] sm:-mt-4"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Past + photo */}
        <div className="grid grid-cols-[105px_1fr] gap-6 mb-7 items-start">
          <img
            src="/maggie.webp"
            alt="Maggie"
            width={451}
            height={800}
            className="w-full h-[140px] object-cover object-center contrast-[1.05]"
            loading="lazy"
            decoding="async"
          />
          <div>
            <p className="mb-5">previously at / contributed to</p>
            <div className="space-y-0.5">
              <p>&gt; <a href="https://cluely.com" target="_blank" rel="noopener noreferrer">Cluely</a><span className="text-zinc-400 dark:text-zinc-500"> — one week</span></p>
              <p>&gt; <a href="https://thirdlayer.inc" target="_blank" rel="noopener noreferrer">ThirdLayer</a> (YC W25)</p>
              <p>&gt; Clade AI &mdash; shut down</p>
              <p>&gt; NASA Space Apps</p>
              <p>&gt; TED-Ed talk</p>
              <p>&gt; <span className="text-zinc-400 dark:text-zinc-500">...and a few that didn&apos;t make it</span></p>
            </div>
          </div>
        </div>

        {/* Essays */}
        <div className="mb-4">
          <p className="underline mb-4">recent writing</p>
          {allEssays.map((post) => {
            const [y, m] = post.metadata.publishedAt.split('-')
            const mon = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')[+m - 1]
            return (
              <p key={post.slug} className="flex items-baseline justify-between gap-3">
                <span>
                  &gt;{' '}
                  <Link href={`/essays/${post.slug}`}>
                    {post.metadata.title}
                  </Link>
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0">{mon} {y}</span>
              </p>
            )
          })}
        </div>

        <div className="flex-1" />

        <ContribGraph />

        <footer className="flex items-center justify-between mt-1">
          <a href="https://x.com/yazcal" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">x</a>
          <Link href="/essays">essays</Link>
          <a href="https://github.com/yazcaleb" target="_blank" rel="noopener noreferrer">github</a>
          <a href="mailto:y@plaw.io?subject=hey&amp;body=(via%20yaz.zone)%0A%0A">y@plaw.io</a>
        </footer>
      </div>
    </>
  )
}
