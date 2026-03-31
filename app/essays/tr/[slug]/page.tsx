import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CustomMDX } from 'app/components/mdx'
import type { Metadata } from 'next'

const TR_DIR = path.join(process.cwd(), 'data', 'tr')

function getTrEssay(slug: string) {
  const filePath = path.join(TR_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const readingTime = `${Math.ceil(wordCount / wordsPerMinute)} dakikalık okuma`

  return {
    metadata: data as { title: string; publishedAt: string; summary: string },
    content: content.replace(/—/g, ' - '),
    readingTime,
    slug,
  }
}

export async function generateStaticParams() {
  if (!fs.existsSync(TR_DIR)) return []
  return fs.readdirSync(TR_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ slug: f.replace(/\.md$/, '') }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getTrEssay(params.slug)
  if (!post) return {}
  return {
    title: post.metadata.title,
    description: post.metadata.summary,
    robots: { index: false, follow: false },
  }
}

export default function TrEssayPage({ params }: { params: { slug: string } }) {
  const post = getTrEssay(params.slug)
  if (!post) notFound()

  const date = new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${post.metadata.publishedAt}T00:00:00`))

  return (
    <section className="max-w-[640px] mx-auto font-serif text-zinc-900 dark:text-zinc-100">
      <div className="mb-7">
        <Link
          href="/essays"
          className="text-[12px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          &larr; makaleler
        </Link>
      </div>

      <header className="mb-10">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 text-black dark:text-white">
          {post.metadata.title}
        </h1>
        <div className="flex items-center gap-3 text-[12px] text-zinc-400 dark:text-zinc-500">
          <time dateTime={post.metadata.publishedAt}>{date}</time>
          <span>/</span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      <article className="prose">
        <CustomMDX source={post.content} />
      </article>

      <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mb-6">
          &mdash;{' '}
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Yağız
          </Link>
        </p>
        <p className="text-[12px] text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
          <Link
            href={`/essays/everyone-is-a-vc`}
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Read in English &rarr;
          </Link>
          <span>/</span>
          <span>Gemini 3.1 Pro tarafından otomatik Türkçeye çevrilmiştir</span>
        </p>
      </footer>
    </section>
  )
}
