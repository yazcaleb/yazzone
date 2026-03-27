import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CustomMDX } from 'app/components/mdx'
import { getEssays, getEssay } from 'app/essays/utils'
import { formatDate } from 'app/lib/format'
import { baseUrl } from 'app/sitemap'
import type { Metadata } from 'next'

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

  let {
    title,
    publishedAt: publishedTime,
    summary,
    ogImage,
  } = post.metadata
  let finalOgImage = ogImage
    ? ogImage
    : `${baseUrl}/yazzone-og.png`

  return {
    title,
    description: summary,
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
          width: 1200,
          height: 630,
          alt: title,
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

// Static TL;DR dropdown component - CSS only, no JS
function TldrDropdown({ title, slug }: { title: string; slug: string }) {
  const pageUrl = `/essays/${slug}`
  const prompt = `Read this page and summarize it in crisp bullet points: https://yaz.zone${pageUrl}

Title: "${title}"

Be direct—every bullet should carry weight. Include key arguments, facts, and conclusions. Skip filler. After summarizing, ask if I have questions.`

  const encodedPrompt = encodeURIComponent(prompt)

  return (
    <details className="tldr-dropdown">
      <summary>TL;DR</summary>
      <div className="tldr-menu">
        <div className="py-1">
          <a
            href={`https://chatgpt.com/?m=${encodedPrompt}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tldr-link"
          >
            ChatGPT
            <span className="text-xs text-zinc-400">↗</span>
          </a>
          <a
            href={`https://claude.ai/new?q=${encodedPrompt}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tldr-link"
          >
            Claude
            <span className="text-xs text-zinc-400">↗</span>
          </a>
          <a
            href={`https://www.perplexity.ai/search?q=${encodedPrompt}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tldr-link"
          >
            Perplexity
            <span className="text-xs text-zinc-400">↗</span>
          </a>
        </div>
        <div className="tldr-footer">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            AI will read &amp; summarize this page
          </p>
        </div>
      </div>
    </details>
  )
}

export default function Blog({ params }: { params: { slug: string } }) {
  let post = getEssay(params.slug)
  const allEssays = getEssays()
  const readNext = allEssays
    .filter((e) => e.slug !== params.slug)
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .slice(0, 2)

  if (!post) {
    notFound()
  }

  return (
    <section className="max-w-[640px] mx-auto font-serif text-zinc-900 dark:text-zinc-100">
      <div className="mb-7">
        <Link
          href="/essays"
          className="text-[12px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          &larr; essays
        </Link>
      </div>
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
            image: post.metadata.ogImage
              ? post.metadata.ogImage
              : `${baseUrl}/yazzone-og.png`,
            url: `${baseUrl}/essays/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'Yaz Caleb',
              url: 'https://yaz.zone',
              sameAs: ['https://x.com/yazcal', 'https://github.com/yazcaleb'],
            },
          }),
        }}
      />

      <header className="mb-10">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 text-black dark:text-white">
          {post.metadata.title}
        </h1>
        <div className="flex items-center gap-3 text-[12px] text-zinc-400 dark:text-zinc-500">
          <time dateTime={post.metadata.publishedAt}>
            {formatDate(post.metadata.publishedAt)}
          </time>
          <span>&middot;</span>
          <span>{post.metadata.readingTime}</span>
        </div>
        {post.metadata.image && (
          <div className="mt-8">
            <img
              src={post.metadata.image}
              alt={post.metadata.title}
              width={1280}
              height={720}
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        )}
      </header>

      <article className="prose">
        <CustomMDX source={post.content} />
      </article>

      <TldrDropdown title={post.metadata.title} slug={post.slug} />

      <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mb-6">
          &mdash;{' '}
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            yaz
          </Link>
        </p>
        {readNext.length > 0 && (
          <nav className="space-y-1 text-[13px]">
            {readNext.map((e) => (
              <p key={e.slug}>
                &gt;{' '}
                <Link
                  href={`/essays/${e.slug}`}
                  className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  {e.metadata.title}
                </Link>
              </p>
            ))}
          </nav>
        )}
      </footer>
    </section>
  )
}
