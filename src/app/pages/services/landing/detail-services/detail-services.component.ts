import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { HeroDetailComponent } from '../../components/hero-detail/hero-detail.component';
import { SeoService } from '../../../../shared/services/seo.service';
import { MOCK_DETAIL_SERVICE } from '../../../../core/mock/service.mock';
import { DetailService } from '../../../../core/model/service.model';

@Component({
  selector: 'app-detail-services',
  imports: [RouterLink, HeroDetailComponent],
  templateUrl: './detail-services.component.html',
  styleUrl: './detail-services.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DetailServicesComponent implements OnInit {
  detailService?: DetailService;

  constructor(
    private seo: SeoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const detailSlug = params.get('detailSlug');

      this.detailService = MOCK_DETAIL_SERVICE.data.find(
        detailService => detailService.detailSlug === detailSlug
      );

      if (!this.detailService) {
        this.router.navigate(['/']);
        return;
      }

      this.seoUpdate(this.detailService);
    });
  }

  private seoUpdate(detailService: DetailService): void {
    if (!detailService) return;

    const parentServiceUrl = `https://xmdigitals.com/services/${detailService.slug}`;
    const pageUrl = `${parentServiceUrl}/${detailService.detailSlug}`;
    const pageTitle = detailService.metaTitle || 'Service Detail';
    const pageDesc = detailService.metaDescription || 'Default description for XM Digitals services.';

    const rawBanner = detailService.banner || 'xm-digitals-center.png';
    const pageImage = rawBanner.startsWith('http')
      ? rawBanner
      : `https://xmdigitals.com/assets/images/${rawBanner.replace(/^\/?(assets\/images\/)?/, '')}`;

    const parentLabel = detailService.slug
      .split('-')
      .map(word => word.toUpperCase() === 'XM' ? 'XM' : word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const schemaData = [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        "name": pageTitle,
        "url": pageUrl,
        "image": pageImage,
        "serviceType": pageTitle,
        "description": pageDesc,
        "provider": {
          "@type": "LocalBusiness",
          "@id": "https://xmdigitals.com/#localbusiness",
          "name": "XM Digitals",
          "url": "https://xmdigitals.com/",
          "image": "https://xmdigitals.com/assets/images/xm-digitals-center.png",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Jakarta",
            "addressCountry": "ID"
          }
        },
        "areaServed": {
          "@type": "Country",
          "name": "Indonesia"
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
            "name": parentLabel,
            "item": parentServiceUrl
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": pageTitle,
            "item": pageUrl
          }
        ]
      }
    ];

    this.seo.update({
      title: pageTitle,
      description: pageDesc,
      image: pageImage,
      url: pageUrl,
      type: 'website',
      schema: schemaData
    });
  }
}