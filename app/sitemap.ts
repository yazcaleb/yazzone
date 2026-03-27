import { getEssays } from 'app/essays/utils'

export const baseUrl = 'https://yaz.zone'

export default async function sitemap() {
  let allEssays = getEssays()

  let essays = allEssays.map((post) => ({
    url: `${baseUrl}/essays/${post.slug}`,
    lastModified: new Date(post.metadata.publishedAt).toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Derive route lastModified from latest essay publish date
  let latestDate = allEssays
    .map((p) => new Date(p.metadata.publishedAt))
    .sort((a, b) => b.getTime() - a.getTime())[0]
  let lastMod = latestDate
    ? latestDate.toISOString().split('T')[0]
    : '2025-01-01'

  let routes = [
    { url: baseUrl, lastModified: lastMod, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/essays`, lastModified: lastMod, changeFrequency: 'weekly' as const, priority: 0.9 },
  ]

  return [...routes, ...essays]
}
