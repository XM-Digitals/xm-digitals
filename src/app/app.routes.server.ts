import { RenderMode, ServerRoute } from '@angular/ssr';
import { MOCK_SERVICE, MOCK_DETAIL_SERVICE } from './core/mock/service.mock';
import { MOCK_USECASES } from './core/mock/use-cases.mock';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'insight', renderMode: RenderMode.Prerender },
  { path: 'about-us', renderMode: RenderMode.Prerender },
  { path: 'contact-us', renderMode: RenderMode.Prerender },
  { path: 'sitemap', renderMode: RenderMode.Prerender },
  { path: 'error-404', renderMode: RenderMode.Prerender },

  { path: 'services', renderMode: RenderMode.Client },
  { path: 'use-cases', renderMode: RenderMode.Client },
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
      return MOCK_USECASES.data.map(useCases => ({
        slug: useCases.slug
      }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];