import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

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
export class InsightComponent implements OnInit {
  listInsights?: ListInsight[];

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.listInsights = LIST_MOCK_INSIGHT.data;

    const insightUrl = 'https://xmdigitals.com/insight';
    const pageTitle = 'Insights | XM Digitals';
    const pageDesc = 'Latest trends in AI, Technology, Software Architecture, and Digital Growth by XM Digitals.';

    const firstBanner = this.listInsights?.[0]?.banner;
    const schemaImage = firstBanner
      ? (firstBanner.startsWith('http')
          ? firstBanner
          : `https://xmdigitals.com/assets/images/${firstBanner.replace(/^\/?(assets\/images\/)?/, '')}`)
      : 'https://xmdigitals.com/assets/images/xm-digitals-center.png';

    // Gunakan versi .jpg untuk Open Graph (WhatsApp & Sosmed)
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
}