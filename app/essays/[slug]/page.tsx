import { notFound } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from 'app/components/SiteHeader'
import { CustomMDX } from 'app/components/mdx'
import { getEssays, getEssay } from 'app/essays/utils'
import { formatDate } from 'app/lib/format'
import { baseUrl } from 'app/sitemap'
import type { Metadata } from 'next'

function getEssayImageUrl(metadata: {
  title: string
  ogImage?: string
  image?: string
}) {
  if (metadata.ogImage) {
    return metadata.ogImage.startsWith('http')
      ? metadata.ogImage
      : `${baseUrl}${metadata.ogImage}`
  }

  if (metadata.image) {
    return metadata.image.startsWith('http')
      ? metadata.image
      : `${baseUrl}${metadata.image}`
  }

  return `${baseUrl}/og?title=${encodeURIComponent(metadata.title)}`
}

function getImageAlt(metadata: { title: string; imageAlt?: string }) {
  return metadata.imageAlt || metadata.title
}

export async function generateStaticParams() {
  let posts = getEssays()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata | undefined {
  let post = getEssays().find((post) => post.slug === params.slug)

  if (!post) {
    return undefined
  }

  let { title, publishedAt: publishedTime, summary } = post.metadata
  let finalOgImage = getEssayImageUrl(post.metadata)

  return {
    title,
    description: summary,
    ...(post.metadata.unlisted && { robots: { index: false, follow: false } }),
    alternates: {
      canonical: `${baseUrl}/essays/${post.slug}`,
    },
    openGraph: {
      title,
      description: summary,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/essays/${post.slug}`,
      images: [
        {
          url: finalOgImage,
          width: post.metadata.ogImageWidth || 1200,
          height: post.metadata.ogImageHeight || 630,
          alt: getImageAlt(post.metadata),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: summary,
      images: [finalOgImage],
    },
  }
}


export default function Blog({ params }: { params: { slug: string } }) {
  let post = getEssay(params.slug)
  let essayImage = post ? getEssayImageUrl(post.metadata) : undefined
  const allEssays = getEssays()
  const readNext = allEssays
    .filter((e) => e.slug !== params.slug && !e.metadata.unlisted)
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .slice(0, 2)

  if (!post) {
    notFound()
  }

  return (
    <section className="mx-auto max-w-[600px] font-serif text-ink">
      <SiteHeader trail={{ href: '/essays', label: 'Essays' }} />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: essayImage,
            url: `${baseUrl}/essays/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'Yaz Caleb',
              url: baseUrl,
              sameAs: ['https://x.com/yazcal', 'https://github.com/yazcaleb'],
            },
          }),
        }}
      />

      <header className="mt-14 mb-10">
        <h1 className="title text-[25px] font-medium leading-8 tracking-[-0.015em] text-ink sm:text-[30px] sm:leading-[38px]">
          {post.metadata.title}
        </h1>
        <p className="mt-3 text-[17px] leading-[27px] text-graphite">{post.metadata.summary}</p>
        <p className="mt-4 flex gap-4 font-sans text-[13px] leading-5 text-label">
          <time dateTime={post.metadata.publishedAt}>{formatDate(post.metadata.publishedAt)}</time>
          <span>{post.metadata.readingTime}</span>
        </p>
      </header>

      {post.metadata.image && (
        <figure className="mb-11">
          <div className="relative aspect-[342/300] rounded-[14px] bg-shelf sm:aspect-[600/440]">
            <img
              src={post.metadata.image}
              alt={getImageAlt(post.metadata)}
              width={post.metadata.imageWidth || 1280}
              height={post.metadata.imageHeight || 720}
              decoding="async"
              className="absolute inset-0 m-auto h-auto max-h-[calc(100%_-_52px)] w-auto max-w-[calc(100%_-_52px)] shadow-[0_1px_2px_rgba(0,0,0,0.08),0_16px_40px_rgba(0,0,0,0.1)] sm:max-h-[calc(100%_-_64px)] sm:max-w-[calc(100%_-_64px)]"
            />
          </div>
          {post.metadata.imageCaption && (
            <figcaption className="mt-2.5 font-sans text-[13px] leading-[18px] text-label">
              {post.metadata.imageCaption}
            </figcaption>
          )}
        </figure>
      )}

      <article className="prose">
        <CustomMDX source={post.content} />
      </article>

      <footer className="mt-16 border-t border-hairline pt-6">
        {readNext.length > 0 && (
          <nav aria-label="Read next">
            <h2 className="font-sans text-[14px] leading-5 text-label">Read next</h2>
            <ul className="mt-2">
              {readNext.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/essays/${e.slug}`}
                    className="group flex items-baseline justify-between gap-6 py-3 text-[15px] leading-6 text-ink hover:no-underline"
                  >
                    <span className="group-hover:underline group-hover:underline-offset-4">{e.metadata.title}</span>
                    <span className="shrink-0 font-sans text-[14px] leading-5 text-label tabular-nums">
                      {formatDate(e.metadata.publishedAt, true)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <Link href="/" className="link mt-4 inline-block font-sans text-[14px] leading-5 text-graphite">
          Home
        </Link>
      </footer>
    </section>
  )
}
