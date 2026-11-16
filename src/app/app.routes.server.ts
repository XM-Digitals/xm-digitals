import { RenderMode, ServerRoute } from '@angular/ssr';

import { MOCK_SERVICE, MOCK_DETAIL_SERVICE } from './core/mock/service.mock';
import { MOCK_INSIGHT } from './core/mock/insight.mock';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'insight', renderMode: RenderMode.Prerender },
  { path: 'about-us', renderMode: RenderMode.Prerender },
  { path: 'contact-us', renderMode: RenderMode.Prerender },
  { path: 'sitemap', renderMode: RenderMode.Prerender },
  { path: 'error-404', renderMode: RenderMode.Prerender },
  {
    path: 'services/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return MOCK_SERVICE.data.map(service => ({
        slug: service.slug
      }));
    }
  },
  {
    path: 'services/:slug/:detailSlug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return MOCK_DETAIL_SERVICE.data.map(detail => ({
        slug: detail.slug,
        detailSlug: detail.detailSlug
      }));
    }
  },
  {
    path: 'use-cases/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return MOCK_INSIGHT.data.map(insight => ({
        slug: insight.slug
      }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];