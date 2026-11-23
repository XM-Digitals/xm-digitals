import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SitemapRepository {
  private platformId = inject(PLATFORM_ID);

  async fetchRawSitemap(): Promise<string> {
    if (!isPlatformBrowser(this.platformId)) {
      return '';
    }

    try {
      const res = await fetch('/sitemap.xml', { cache: 'no-cache' });
      if (!res.ok) return '';
      return await res.text();
    } catch {
      return '';
    }
  }
}