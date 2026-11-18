import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../../../shared/services/seo.service';

@Component({
  selector: 'app-sitemap',
  imports: [RouterLink],
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SitemapComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    const sitemapUrl = 'https://xmdigitals.com/sitemap';
    const pageTitle = 'Sitemap | XM Digitals';
    const pageDesc = 'Complete HTML sitemap of XM Digitals — browse all pages, digital services, and technical insights for easy navigation.';

    const schemaData = [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${sitemapUrl}#webpage`,
        "url": sitemapUrl,
        "name": pageTitle,
        "description": pageDesc,
        "isPartOf": {
          "@id": "https://xmdigitals.com/#website"
        },
        "about": {
          "@id": "https://xmdigitals.com/#organization"
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
            "name": "Sitemap",
            "item": sitemapUrl
          }
        ]
      }
    ];

    this.seo.update({
      title: pageTitle,
      description: pageDesc,
      url: sitemapUrl,
      schema: schemaData
    });
  }
}