import { Injectable } from '@angular/core';

import { Mapper } from '../base/base.mapper';
import { SitemapGroup, SitemapItem } from '../model/sitemap.model';

@Injectable({
  providedIn: 'root',
})
export class SitemapMapper implements Mapper<string, SitemapGroup[]> {
  private readonly upperWords = [
    'xm',
    'ai',
    'ui',
    'ux',
    'seo',
    'rea',
    'api',
    'saas',
    'cms',
    'erp',
    'crm',
    'sdui',
    'basf',
  ];

  mapFrom(xmlText: string): SitemapGroup[] {
    if (!xmlText || typeof DOMParser === 'undefined') {
      return this.getFallbackGroups();
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      return this.getFallbackGroups();
    }

    const urlNodes = Array.from(xmlDoc.getElementsByTagName('url'));
    const mainPages: SitemapItem[] = [];
    const services: SitemapItem[] = [];
    const projects: SitemapItem[] = [];
    const insights: SitemapItem[] = [];

    for (const node of urlNodes) {
      const loc = node.getElementsByTagName('loc')[0]?.textContent?.trim();
      const lastmod = node.getElementsByTagName('lastmod')[0]?.textContent?.trim();
      if (!loc) continue;

      const pathname = this.extractPathname(loc);
      if (pathname === '/sitemap') continue;

      const item: SitemapItem = {
        label: this.formatRouteLabel(pathname),
        route: pathname,
        lastmod,
      };

      if (pathname.startsWith('/services/')) {
        services.push(item);
      } else if (pathname.startsWith('/project/')) {
        projects.push(item);
      } else if (pathname.startsWith('/insight/') || pathname.startsWith('/insights/')) {
        insights.push(item);
      } else {
        mainPages.push(item);
      }
    }

    // Urutkan Insights berdasarkan lastmod terbaru jika tersedia
    insights.sort((a, b) => (b.lastmod || '').localeCompare(a.lastmod || ''));

    const groups: SitemapGroup[] = [];
    if (mainPages.length) groups.push({ category: 'Main Pages', items: mainPages });
    if (services.length) groups.push({ category: 'Services', items: services });
    if (projects.length) groups.push({ category: 'Projects', items: projects });
    if (insights.length) groups.push({ category: 'Insights', items: insights });

    return groups.length ? groups : this.getFallbackGroups();
  }

  getFallbackGroups(): SitemapGroup[] {
    return [
      {
        category: 'Main Pages',
        items: [
          { label: 'Home', route: '/' },
          { label: 'About Us', route: '/about-us' },
          { label: 'Contact Us', route: '/contact-us' },
        ],
      },
      {
        category: 'Services',
        items: [
          { label: 'XM Creative', route: '/services/xm-creative' },
          { label: 'XM Tech', route: '/services/xm-tech' },
          { label: 'XM AI', route: '/services/xm-ai' },
          { label: 'XM Growth', route: '/services/xm-growth' },
        ],
      },
    ];
  }

  private extractPathname(loc: string): string {
    let rawPath = '/';
    try {
      const urlObj = new URL(loc);
      rawPath = urlObj.pathname || '/';
    } catch {
      rawPath = loc.startsWith('/') ? loc : `/${loc}`;
    }

    // Normalisasi agar root tetap '/' dan sub-halaman tanpa trailing slash
    // sehingga selaras dengan Angular Router & pengecekan '/sitemap'
    if (rawPath === '/') return '/';
    return rawPath.replace(/\/+$/, '') || '/';
  }

  private formatRouteLabel(pathname: string): string {
    if (pathname === '/') return 'Home';

    const cleanSegment = pathname.replace(/\/+$/, '').split('/').pop() || pathname;

    return cleanSegment
      .split('-')
      .map((word) =>
        this.upperWords.includes(word.toLowerCase())
          ? word.toUpperCase()
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(' ');
  }
}