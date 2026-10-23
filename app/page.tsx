import Link from 'next/link'
import { getEssays } from 'app/essays/utils'
import AgeCounter from 'app/components/AgeCounter'
import ContribGraph from 'app/components/ContribGraph'
import PaperPage from 'app/components/PaperPage'
import { formatDate } from 'app/lib/format'
import { baseUrl } from 'app/sitemap'

export const revalidate = 3600

const external = { target: '_blank', rel: 'noopener noreferrer' }

const previously = [
  { name: 'Clade AI', note: 'Founder, 30+ people, shut down' },
  { name: 'Tavus', note: 'YC S21', href: 'https://www.tavus.io' },
  { name: 'Cluely', note: 'One week', href: 'https://cluely.com' },
  { name: 'NASA Space Apps', note: 'Mentor, 2023', href: 'https://www.spaceappschallenge.org/2023/' },
  { name: 'TED-Ed', note: 'Talk on terms and conditions' },
]

function Label({ children }: { children: React.ReactNode }) {
  return <h2 className="font-sans text-[14px] leading-5 text-label">{children}</h2>
}

export default function Page() {
  const essays = getEssays()
    .filter((e) => !e.metadata.unlisted)
    .sort((a, b) =>
      Number(Boolean(b.metadata.pinned)) - Number(Boolean(a.metadata.pinned)) ||
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
    )
    .slice(0, 5)

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
            alternateName: ['Yaz A. Caleb', 'Yaz Celebi', 'Yagiz Celebi', 'Yagiz Erkam Celebi'],
            url: baseUrl,
            image: `${baseUrl}/yaz-latest.webp`,
            description: 'Builder. Founder of Veto and Plaw. Essays on AI, infrastructure, and compounding conviction.',
            jobTitle: 'Cofounder & CEO',
            worksFor: { '@type': 'Organization', name: 'Plaw Inc.', url: 'https://plaw.io' },
            sameAs: ['https://x.com/yazcal', 'https://github.com/yazcaleb'],
            birthDate: '2009',
            nationality: ['Turkish', 'Albanian'],
          }),
        }}
      />

      <div className="mx-auto max-w-[600px] font-serif text-[15px] leading-[25px] text-graphite">
        <header>
          <img
            src="/avatar-192.webp"
            alt="Yaz Caleb"
            width={36}
            height={36}
            className="frame size-9 rounded-lg"
            decoding="async"
          />
          <h1 className="mt-5 text-[17px] font-medium leading-[26px] tracking-[-0.01em] text-ink">
            Yaz Caleb
          </h1>
          <p className="font-sans text-[13px] leading-5 text-label">
            Yaz Celebi / Yagiz Celebi / Ya&#287;&#305;z Erkam &Ccedil;elebi
          </p>
        </header>

        <div className="mt-7 space-y-3.5">
          <p>
            I build companies and the software inside them. Right now that means
            authorization for autonomous systems: agents call APIs, move money and
            sign contracts, but nobody has a good answer for who gets to say yes.{' '}
            <a href="https://veto.so" {...external} className="link text-ink">Veto</a> is my answer.
          </p>
          <p>
            Turkish-Albanian, grew up in Ankara. Self-taught, finished high school
            three years early. I like Camus, Orwell, tennis and isolation lifts.
          </p>
        </div>

        <p className="mt-3.5 flex items-baseline gap-2">
          <span className="font-sans text-[13px] text-label">Age</span>
          <span className="text-[14px] text-ink">
            <AgeCounter />
          </span>
        </p>

        <nav aria-label="Elsewhere" className="mt-[22px] flex flex-wrap gap-x-[22px] gap-y-2 font-sans text-[14px] leading-5 text-ink">
          <a href="https://x.com/yazcal" {...external} className="link">X</a>
          <a href="https://github.com/yazcaleb" {...external} className="link">GitHub</a>
          <a href="mailto:y@plaw.inc?subject=hey&amp;body=(via%20yaz.md)%0A%0A" className="link">Email</a>
          <Link href="/essays" className="link">Essays</Link>
          <a href="/feed.xml" className="link">RSS</a>
        </nav>

        <section className="mt-16 sm:mt-24">
          <Label>Now</Label>

          <a href="https://veto.so" {...external} className="mt-5 flex aspect-[3/2] justify-center overflow-hidden rounded-[14px] bg-shelf px-6 pt-7 sm:aspect-[600/316] sm:pt-10" aria-label="Veto, runtime authorization for AI agents">
            <picture className="block w-full sm:w-[80%]">
              <source srcSet="/images/home/veto-dark.webp" media="(prefers-color-scheme: dark)" />
              <img
                src="/images/home/veto-light.webp"
                alt="The veto.so homepage: Stop risky AI actions before they happen."
                width={1200}
                height={750}
                loading="lazy"
                decoding="async"
                className="frame lift w-full rounded-lg"
              />
            </picture>
          </a>
          <h3 className="mt-[18px] font-medium leading-6 text-ink">
            <a href="https://veto.so" {...external}>Veto</a>
          </h3>
          <p className="mt-1 leading-6">
            Runtime authorization for AI agents. Veto checks risky actions before
            money moves, data leaves, records change or a customer gets contacted.
            Built at{' '}
            <a href="https://plaw.io" {...external} className="link whitespace-nowrap text-ink">Plaw, Inc.</a>
          </p>

          <a href="/can-is-not-may.pdf" {...external} className="mt-11 flex justify-center overflow-hidden rounded-[14px] bg-shelf px-10 pt-7 sm:pt-10 aspect-[3/2] sm:aspect-[600/316]" aria-label="Can Is Not May, preprint (PDF)">
            <div className="w-[75%] sm:w-[60%]">
              <PaperPage
                src="/images/home/can-is-not-may-p1.webp"
                darkSrc="/images/home/can-is-not-may-p1-dark.webp"
                alt="First page of the preprint Can Is Not May: Authority Models for Governable AI Agents"
              />
            </div>
          </a>
          <h3 className="mt-[18px] font-medium leading-6 text-ink">
            <a href="/can-is-not-may.pdf" {...external}>Can Is Not May</a>
          </h3>
          <p className="mt-1 leading-6">
            My preprint on authority models. Across 7,427 trials, prompt-only
            guardrails let agents take unauthorized actions 18.3% of the time; an
            external authority model let through none.
          </p>

          <div className="mt-9 border-b border-hairline">
            <div className="flex items-baseline justify-between gap-4 border-t border-hairline py-[13px]">
              <span className="text-ink">Looking for a founding team</span>
              <a
                href="mailto:office@plaw.inc?subject=the%20best%20thing%20I%20ever%20built&amp;body=%0Askip%20the%20resume%3A%20what%20did%20you%20build%2C%20and%20why%20should%20we%20build%20together%3F%0A%0A"
                className="link shrink-0 font-sans text-[14px] leading-5"
              >
                office@plaw.inc
              </a>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-hairline py-[13px]">
              <span className="text-ink">Raising a pre-seed round</span>
              <a href="https://plaw.cal.com/yaz/investor" {...external} className="link shrink-0 font-sans text-[14px] leading-5">
                Schedule a call
              </a>
            </div>
          </div>
        </section>

        <section className="mt-16 sm:mt-[88px]">
          <Label>Writing</Label>
          <ul className="mt-3">
            {essays.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/essays/${post.slug}`}
                  className="group flex items-baseline justify-between gap-6 py-3 text-ink hover:no-underline"
                >
                  <span className="group-hover:underline group-hover:underline-offset-4">{post.metadata.title}</span>
                  <span className="shrink-0 font-sans text-[14px] leading-5 text-label tabular-nums">
                    {formatDate(post.metadata.publishedAt, true)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/essays" className="link mt-3 inline-block font-sans text-[14px] leading-5">
            All essays
          </Link>
        </section>

        <section className="mt-16 sm:mt-[88px]">
          <Label>Previously</Label>
          <dl className="mt-3">
            {previously.map((item) => (
              <div key={item.name} className="flex items-baseline gap-6 py-2.5">
                <dt className="w-32 shrink-0 text-ink sm:w-[180px]">
                  {item.href ? <a href={item.href} {...external}>{item.name}</a> : item.name}
                </dt>
                <dd>{item.note}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-16 flex items-start gap-4 sm:mt-[88px]" aria-label="Photos">
          <figure className="w-[62%] sm:w-[384px]">
            <img
              src="/yazpic2-sm.webp"
              alt="Yaz as a kid in a GAP sweatshirt"
              width={800}
              height={480}
              loading="lazy"
              decoding="async"
              className="frame h-[196px] w-full rounded-[10px] object-cover object-[center_20%] grayscale transition-[filter] duration-300 hover:grayscale-0 sm:h-[256px]"
            />
            <figcaption className="mt-2.5 font-sans text-[13px] leading-[18px] text-label">Before the companies.</figcaption>
          </figure>
          <figure className="flex-1">
            <img
              src="/maggie.webp"
              alt="Princess Maggie, a labrador, mid-yawn"
              width={451}
              height={800}
              loading="lazy"
              decoding="async"
              className="frame h-[196px] w-full rounded-[10px] object-cover grayscale transition-[filter] duration-300 hover:grayscale-0 sm:h-[256px]"
            />
            <figcaption className="mt-2.5 font-sans text-[13px] leading-[18px] text-label">Princess Maggie, 8.</figcaption>
          </figure>
        </section>

        <a
          href="https://plaw.cal.com/yaz"
          {...external}
          aria-label="Better call Yaz: schedule a call"
          className="mt-16 block w-[168px] -rotate-3 text-ink opacity-90 transition-opacity hover:opacity-100 sm:mt-[88px]"
        >
          <span
            aria-hidden="true"
            className="block aspect-[2048/983] bg-current"
            style={{
              WebkitMask: 'url(/better-call-yaz.svg) center / contain no-repeat',
              mask: 'url(/better-call-yaz.svg) center / contain no-repeat',
            }}
          />
        </a>

        <footer className="mt-12">
          <ContribGraph />
          <div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-hairline pt-4 font-sans text-[13px] leading-[18px] text-label">
            <span>Yaz Caleb, {new Date().getFullYear()}</span>
            <span>Set in Literata and Atkinson Hyperlegible</span>
          </div>
        </footer>
      </div>
    </>
  )
}
