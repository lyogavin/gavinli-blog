import * as fs from 'fs';
import * as path from 'path';
import { getAllPosts } from '../lib/api';


// to run: tsc --esModuleInterop utils/sitemap-gen.ts
// then: node dist/utils/sitemap-gen.js
interface Page {
  path: string;
  priority: number;
}

const pages: Page[] = [
  { path: '/', priority: 1 },
];

const postsData = getAllPosts();

const postPages = postsData.map((post) => {
  return {
    path: `/posts/${post.slug}`,
    priority: 0.8,
  };
});

const generateSitemap = (): void => {
  const now = new Date().toISOString();
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${[...pages, ...postPages]
      .map((page) => {
        return `
      <url>
        ${page.path.startsWith('https://') ? `<loc>${page.path}</loc>` : `<loc>${`https://gavinliblog.com${page.path}`}</loc>`}
        <lastmod>${now}</lastmod>
        <changefreq>daily</changefreq>
        <priority>${page.priority}</priority>
      </url>
    `;
      })
      .join('')}
  </urlset>`;

  fs.writeFileSync(path.join("./public", 'sitemap.xml'), sitemap);
};

generateSitemap();