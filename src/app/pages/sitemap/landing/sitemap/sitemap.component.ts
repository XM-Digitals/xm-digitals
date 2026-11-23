import {
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { SitemapGroup, SitemapItem } from '../../../../core/model/sitemap.model';
import { GetSitemapUseCase } from '../../../../core/usecase/get-sitemap.usecase';
import { SeoService } from '../../../../shared/services/seo.service';

@Component({
  selector: 'app-sitemap',
  imports: [RouterLink],
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SitemapComponent implements OnInit {
  private seo = inject(SeoService);
  private getSitemapUseCase = inject(GetSitemapUseCase);

  sitemapGroups = signal<SitemapGroup[]>([]);
  totalLinks = signal(0);
  isLoading = signal(true);

  readonly itemStep = 10;
  visibleCounts = signal<Record<string, number>>({});

  ngOnInit(): void {
    this.initSeo();
    this.loadSitemap();
  }

  getVisibleCount(category: string): number {
    return this.visibleCounts()[category] ?? this.itemStep;
  }

  getVisibleItems(group: SitemapGroup): SitemapItem[] {
    return group.items.slice(0, this.getVisibleCount(group.category));
  }

  hasMoreItems(group: SitemapGroup): boolean {
    return this.getVisibleCount(group.category) < group.items.length;
  }

  getRemainingCount(group: SitemapGroup): number {
    return Math.max(0, group.items.length - this.getVisibleCount(group.category));
  }

  loadMore(category: string): void {
    this.visibleCounts.update((counts) => ({
      ...counts,
      [category]: (counts[category] ?? this.itemStep) + this.itemStep,
    }));
  }

  private initSeo(): void {
    const sitemapUrl = 'https://xmdigitals.com/sitemap';
    const pageTitle = 'Sitemap | XM Digitals';
    const pageDesc =
      'Complete HTML sitemap of XM Digitals — browse all pages, digital services, and technical insights for easy navigation.';

    const schemaData = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${sitemapUrl}#webpage`,
        url: sitemapUrl,
        name: pageTitle,
        description: pageDesc,
        isPartOf: {
          '@id': 'https://xmdigitals.com/#website',
        },
        about: {
          '@id': 'https://xmdigitals.com/#organization',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://xmdigitals.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Sitemap',
            item: sitemapUrl,
          },
        ],
      },
    ];

    this.seo.update({
      title: pageTitle,
      description: pageDesc,
      url: sitemapUrl,
      schema: schemaData,
    });
  }

  private async loadSitemap(): Promise<void> {
    const response = await this.getSitemapUseCase.execute();
    const groups = response.data;
    const total = groups.reduce((acc, g) => acc + g.items.length, 0);

    this.sitemapGroups.set(groups);
    this.totalLinks.set(total);
    this.isLoading.set(false);
  }
}