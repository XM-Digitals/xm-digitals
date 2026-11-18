import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

export interface SeoData {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
  type?: 'website' | 'article';
  author?: string;
  robots?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private isBrowser: boolean;
  private readonly SITE_URL = 'https://xmdigitals.com';
  private readonly BRAND_NAME = 'XM Digitals';
  private readonly DEFAULT_TITLE = 'XM Digitals | End-to-End Digital Solutions, Enhanced with AI';

  constructor(
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) platformId: object,
    @Inject(DOCUMENT) private dom: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * 🎯 METHOD UTAMA: Update semua SEO dan Structured Data
   */
  update(data: SeoData): void {
    // 1. Deteksi path aktif yang aman untuk SSR/Prerender maupun Browser
    const domPath = this.dom?.location?.pathname || '/';
    const routerPath = this.router.url.split('?')[0].split('#')[0];
    const activePath = (routerPath && routerPath !== '/') ? routerPath : domPath;

    // Normalisasi: root tetap '/', rute lain tanpa trailing slash
    const cleanPath = activePath === '/' ? '/' : activePath.replace(/\/+$/, '');
    const dynamicUrl = `${this.SITE_URL}${cleanPath}`;
    const finalUrl = data.url ? this.normalizeUrl(data.url) : dynamicUrl;

    // 2. Format Title
    const fullTitle = this.formatTitle(data.title ?? this.DEFAULT_TITLE);
    this.titleService.setTitle(fullTitle);

    // 3. Update Meta Tags (OG, Twitter, Standard)
    this.updateMetaTags({ ...data, url: finalUrl }, fullTitle);

    // 4. Update Canonical (100% sinkron dengan sitemap.xml)
    this.updateCanonical(finalUrl);

    // 5. Update JSON-LD (pertahankan schema homepage jika di root '/')
    if (data.schema) {
      this.updateJsonLd(data.schema);
    } else if (cleanPath !== '/') {
      this.removeJsonLd();
    }
  }

  private updateMetaTags(data: SeoData, fullTitle: string): void {
    const description = data.description || '';
    const imageUrl = this.getAbsoluteUrl(data.image || 'assets/images/xm-digitals-center.png');

    const tags: any[] = [
      // Open Graph
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: imageUrl },
      { property: 'og:type', content: data.type ?? 'website' },
      { property: 'og:site_name', content: this.BRAND_NAME },
      { property: 'og:url', content: data.url || `${this.SITE_URL}/` },

      // Twitter
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },
      { name: 'twitter:card', content: 'summary_large_image' },

      // Standard SEO
      { name: 'description', content: description },
      { name: 'author', content: data.author ?? this.BRAND_NAME },
      {
        name: 'robots',
        content: data.robots ?? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      }
    ];

    if (data.keywords) {
      tags.push({ name: 'keywords', content: data.keywords });
    } else {
      this.metaService.removeTag("name='keywords'");
    }

    tags.forEach(tag => {
      this.metaService.updateTag(tag);
    });
  }

  private updateCanonical(url: string): void {
    const head = this.dom.head;
    const existingLinks = head.querySelectorAll('link[rel="canonical"]');
    existingLinks.forEach(el => head.removeChild(el));

    const link = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    head.appendChild(link);
  }

  private updateJsonLd(schema: Record<string, any> | Record<string, any>[]): void {
    let script = this.dom.getElementById('xm-json-ld') as HTMLScriptElement | null;
    if (!script) {
      script = this.dom.createElement('script');
      script.id = 'xm-json-ld';
      script.type = 'application/ld+json';
      this.dom.head.appendChild(script);
    }
    script.text = JSON.stringify(schema);
  }

  private removeJsonLd(): void {
    const script = this.dom.getElementById('xm-json-ld');
    if (script) {
      script.remove();
    }
  }

  private normalizeUrl(url: string): string {
    const clean = url.split('?')[0].split('#')[0];
    return clean === `${this.SITE_URL}/` ? clean : clean.replace(/\/+$/, '');
  }

  private formatTitle(pageTitle: string): string {
    if (pageTitle.includes(this.BRAND_NAME)) return pageTitle;
    return `${pageTitle} | ${this.BRAND_NAME}`;
  }

  private getAbsoluteUrl(path: string): string {
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.SITE_URL}${cleanPath}`;
  }
}
