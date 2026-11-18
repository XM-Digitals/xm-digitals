import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { HeroComponent } from '../../components/hero/hero.component';
import { SeoService } from '../../../../shared/services/seo.service';
import { MOCK_SERVICE } from '../../../../core/mock/service.mock';
import { Service } from '../../../../core/model/service.model';

@Component({
  selector: 'app-services',
  imports: [HeroComponent, RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ServicesComponent implements OnInit {
  service?: Service;

  constructor(
    private seo: SeoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');

      this.service = MOCK_SERVICE.data.find(
        service => service.slug === slug
      );

      if (!this.service) {
        this.router.navigate(['/']);
        return;
      }

      this.seoUpdate(this.service);
    });
  }

  private seoUpdate(service: Service): void {
    if (!service) return;

    const serviceUrl = `https://xmdigitals.com/services/${service.slug}`;
    const pageTitle = service.metaTitle || 'XM Digitals Services';
    const pageDesc = service.metaDescription || 'End-to-end digital solutions by XM Digitals.';

    const rawBanner = service.banner || 'xm-digitals-center.png';
    const pageImage = rawBanner.startsWith('http')
      ? rawBanner
      : `https://xmdigitals.com/assets/images/${rawBanner.replace(/^\/?(assets\/images\/)?/, '')}`;

    const schemaData = [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${serviceUrl}#service`,
        "name": pageTitle,
        "url": serviceUrl,
        "image": pageImage,
        "serviceType": service.title || service.metaTitle || "Technology & Software Development",
        "description": pageDesc,
        "provider": {
          "@type": "Organization",
          "@id": "https://xmdigitals.com/#organization",
          "name": "XM Digitals",
          "url": "https://xmdigitals.com/",
          "logo": {
            "@type": "ImageObject",
            "url": "https://xmdigitals.com/assets/images/xm-digitals-center.png"
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
            "name": service.title || pageTitle,
            "item": serviceUrl
          }
        ]
      }
    ];

    this.seo.update({
      title: pageTitle,
      description: pageDesc,
      image: pageImage,
      url: serviceUrl,
      schema: schemaData
    });
  }
}