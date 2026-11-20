import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../../../shared/services/seo.service';
import { LIST_MOCK_INSIGHT } from '../../../../core/mock/insight.mock';
import { ListInsight } from '../../../../core/model/insight.model';

@Component({
  selector: 'app-insight',
  imports: [RouterLink, DatePipe],
  templateUrl: './insight.component.html',
  styleUrl: './insight.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class InsightComponent implements OnInit, OnDestroy {
  listInsights?: ListInsight[];
  loadedImages: Record<string, boolean> = {};
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor(
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.listInsights = LIST_MOCK_INSIGHT.data;

    const insightUrl = 'https://xmdigitals.com/insight';
    const pageTitle = 'Insights | XM Digitals';
    const pageDesc = 'Latest trends in AI, Technology, Software Architecture, and Digital Growth by XM Digitals.';

    const firstBanner = this.listInsights?.[0]?.banner;
    const cleanBanner = firstBanner ? firstBanner.replace(/^\/+/, '') : 'assets/images/xm-digitals-center.png';
    const schemaImage = cleanBanner.startsWith('http')
      ? cleanBanner
      : `https://xmdigitals.com/${cleanBanner}`;

    const ogImage = schemaImage.replace(/\.webp$/i, '.jpg');

    const schemaData = [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${insightUrl}#collection`,
        "url": insightUrl,
        "name": pageTitle,
        "description": pageDesc,
        "image": schemaImage,
        "isPartOf": {
          "@id": "https://xmdigitals.com/#website"
        },
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": (this.listInsights || []).map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://xmdigitals.com/insight/${item.slug}`,
            "name": item.title
          }))
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://xmdigitals.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Insights",
            "item": insightUrl
          }
        ]
      }
    ];

    this.seo.update({
      title: pageTitle,
      description: pageDesc,
      image: ogImage,
      url: insightUrl,
      schema: schemaData
    });
  }

  onImageLoad(slug?: string): void {
    if (!slug) return;

    if (isPlatformBrowser(this.platformId)) {
      const timer = setTimeout(() => {
        this.loadedImages[slug] = true;
      }, 800);
      this.timers.push(timer);
    } else {
      this.loadedImages[slug] = true;
    }
  }

  onImageError(slug?: string): void {
    if (slug) {
      this.loadedImages[slug] = true;
    }
  }

  ngOnDestroy(): void {
    this.timers.forEach(timer => clearTimeout(timer));
  }
}