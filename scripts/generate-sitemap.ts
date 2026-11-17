import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { MOCK_SERVICE, MOCK_DETAIL_SERVICE } from '../src/app/core/mock/service.mock';
import { LIST_MOCK_INSIGHT } from '../src/app/core/mock/insight.mock';

const BASE_URL = 'https://xmdigitals.com';
const TODAY = new Date().toISOString().split('T')[0];

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
}

const staticPages: SitemapEntry[] = [
  { loc: '/', lastmod: TODAY, changefreq: 'weekly', priority: '1.0' },
  { loc: '/about-us', lastmod: TODAY, changefreq: 'monthly', priority: '0.6' },
  { loc: '/contact-us', lastmod: TODAY, changefreq: 'monthly', priority: '0.6' },
  { loc: '/sitemap', lastmod: TODAY, changefreq: 'monthly', priority: '0.5' },
  { loc: '/insight', lastmod: TODAY, changefreq: 'weekly', priority: '0.8' },
];

// 1. Service Clusters (/services/:slug)
const serviceClusterPages: SitemapEntry[] = MOCK_SERVICE.data.map((service) => ({
  loc: `/services/${service.slug}`,
  lastmod: TODAY,
  changefreq: 'weekly',
  priority: '0.8',
}));

// 2. Sub-Services (/services/:slug/:detailSlug)
const detailServicePages: SitemapEntry[] = MOCK_DETAIL_SERVICE.data.map((detail) => ({
  loc: `/services/${detail.slug}/${detail.detailSlug}`,
  lastmod: TODAY,
  changefreq: 'monthly',
  priority: '0.9',
}));

// 4. Insight Articles (/insight/:slug) -> Menggunakan tanggal asli artikel sebagai lastmod
const insightPages: SitemapEntry[] = LIST_MOCK_INSIGHT.data.map((article) => ({
  loc: `/insight/${article.slug}`,
  lastmod: article.date || TODAY,
  changefreq: 'monthly',
  priority: '0.8',
}));

const allEntries: SitemapEntry[] = [
  ...staticPages,
  ...serviceClusterPages,
  ...detailServicePages,
  ...insightPages,
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (entry) => `  <url>
    <loc>${BASE_URL}${entry.loc}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

// Tulis ke public/sitemap.xml (otomatis ikut ter-copy saat ng build)
const outputPath = resolve(process.cwd(), 'public/sitemap.xml');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, xml, 'utf-8');

console.log(`✅ Sitemap generated with ${allEntries.length} URLs at ${outputPath}`);