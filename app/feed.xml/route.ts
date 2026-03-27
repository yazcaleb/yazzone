import RSS from 'rss';
import { getEssays } from 'app/essays/utils';
import { baseUrl } from 'app/sitemap';

export async function GET() {
  const allEssays = getEssays();

  const feed = new RSS({
    title: 'Yaz Caleb | Essays',
    description: 'Essays on systems, autonomy, and building things that matter.',
    site_url: `${baseUrl}/essays`,
    feed_url: `${baseUrl}/feed.xml`,
    language: 'en',
    pubDate: new Date(),
    copyright: `© ${new Date().getFullYear()} Yaz Caleb`,
  });

  allEssays.forEach((post) => {
    feed.item({
      title: post.metadata.title,
      description: post.metadata.summary,
      url: `${baseUrl}/essays/${post.slug}`,
      date: post.metadata.publishedAt,
      author: 'Yaz Caleb',
    });
  });

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
} 