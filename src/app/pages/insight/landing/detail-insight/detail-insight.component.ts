import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { HeroComponent } from '../../components/hero/hero.component';
import { SeoService } from '../../../../shared/services/seo.service';
import { MOCK_INSIGHT } from '../../../../core/mock/insight.mock';
import { Insight } from '../../../../core/model/insight.model';

@Component({
  selector: 'app-detail-insight',
  imports: [RouterLink, HeroComponent],
  templateUrl: './detail-insight.component.html',
  styleUrl: './detail-insight.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DetailInsightComponent implements OnInit {
  insight?: Insight;

  constructor(
    private seo: SeoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');

      this.insight = MOCK_INSIGHT.data.find(
        insight => insight.slug === slug
      );

      if (!this.insight) {
        this.router.navigate(['/']);
        return;
      }

      this.seoUpdate(this.insight);
    });
  }

  private seoUpdate(insight: Insight): void {
    if (!insight) return;

    const articleUrl = `https://xmdigitals.com/insight/${insight.slug}`;
    const pageTitle = insight.metaTitle || insight.title || 'Insight';
    const pageDesc = insight.metaDescription || insight.description || 'Read our latest insights.';

    const rawBanner = insight.banner || 'assets/images/xm-digitals-center.png';
    const cleanBanner = rawBanner.replace(/^\/+/, '');
    const schemaImage = cleanBanner.startsWith('http')
      ? cleanBanner
      : `https://xmdigitals.com/${cleanBanner}`;

    const ogImage = schemaImage.replace(/\.webp$/i, '.jpg');
    const publishedDate = (insight as any).date || '2026-09-25';

    const schemaData = [
      {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "@id": `${articleUrl}#article`,
        "headline": pageTitle,
        "description": pageDesc,
        "image": [schemaImage],
        "datePublished": publishedDate,
        "dateModified": publishedDate,
        "author": {
          "@type": "Organization",
          "@id": "https://xmdigitals.com/#organization",
          "name": "XM Digitals",
          "url": "https://xmdigitals.com/"
        },
        "publisher": {
          "@type": "Organization",
          "@id": "https://xmdigitals.com/#organization",
          "name": "XM Digitals",
          "logo": {
            "@type": "ImageObject",
            "url": "https://xmdigitals.com/assets/images/xm-digitals-center.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": articleUrl
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
            "item": "https://xmdigitals.com/insight"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": insight.title || pageTitle,
            "item": articleUrl
          }
        ]
      }
    ];

    this.seo.update({
      title: pageTitle,
      description: pageDesc,
      image: ogImage,
      url: articleUrl,
      type: 'article',
      schema: schemaData
    });
  }
}