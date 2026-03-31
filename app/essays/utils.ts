import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type Metadata = {
  title: string
  publishedAt: string
  summary: string
  ogImage?: string
  image?: string
  slug?: string
  readingTime: string
  featured?: boolean
  unlisted?: boolean
}

function parseFrontmatter(fileContent: string) {
  const { data, content } = matter(fileContent)
  return { metadata: data as Metadata, content }
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.md')
}

export function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTimeMinutes} min read`;
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file))
    let slug = metadata.slug || path.basename(file, path.extname(file))
    const readingTime = calculateReadingTime(content)

    return {
      metadata: { ...metadata, readingTime },
      slug,
      content: content.replace(/—/g, ' - '),
    }
  })
}

let essaysCache;

export function getEssays() {
  if (essaysCache) {
    return essaysCache;
  }
  essaysCache = getMDXData(path.join(process.cwd(), 'data', 'essays'));
  return essaysCache;
}

export function getEssay(slug: string) {
  const allEssays = getEssays();
  const essay = allEssays.find(e => e.slug === slug);

  if (!essay) {
    return;
  }

  return essay;
}

export function getBackstoryData() {
  const filePath = path.join(process.cwd(), 'data', 'backstory.md');
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContents);
  return {
    data,
    content: content.replace(/—/g, ' - '),
  };
}
